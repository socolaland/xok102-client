const LocalStorage = require('LocalStorage');
const HttpRequest = require("HttpRequest");

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.EditBox,
        password: cc.EditBox,
        password_confirm: cc.EditBox,
        captcha: cc.EditBox,
        captchaSprite: cc.Sprite,
        ref_code: cc.EditBox,
        mask_ref_code: cc.Node,
        acceptTerms: {
            default: true
        },
        tickTerms: cc.Node
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
        this.captcha_code = null;
    },
    onEnable() {
        this.initCaptcha();
        if (LocalStorage.getItem("ref_code")) {
            this.mask_ref_code.active = true;
            this.ref_code.string = LocalStorage.getItem("ref_code").toLowerCase().trim();
        }else {
            this.mask_ref_code.active = false;
        }
    },
    acceptTermsClick() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.acceptTerms = !this.acceptTerms;
        this.tickTerms.active = this.acceptTerms;
    },
    clickRegister() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);
        if (this.password.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu không hợp lệ!", "error", 1, 1, true);
        if (this.password_confirm.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Xác nhận mật khẩu không hợp lệ!", "error", 1, 1, true);
        if (this.password.string != this.password_confirm.string) return cc.CORE.GAME_SCENCE.FastNotify("2 mật khẩu không khớp!", "error", 1, 1, true);
        if (this.captcha.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mã xác nhận không hợp lệ!", "error", 1, 1, true);
        if (this.captcha.string != this.captcha_code) return cc.CORE.GAME_SCENCE.FastNotify("Mã captcha không hợp lệ!", "error", 1, 1, true);
        if (!this.acceptTerms) return cc.CORE.GAME_SCENCE.FastNotify("Bạn phải đồng ý với điều khoản!", "error", 1, 1, true);

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/auth/register`,
            {},
            {
                "name": "Player Account",
                "username": this.username.string,
                "password": this.password.string,
                "captcha": this.captcha.string,
                "ref_code": (this.ref_code.string == "" ? null : this.ref_code.string)
            }
        ).then(result => {
            console.log(result);
            if (result.error_code == 0) {
                const data = result.data;

                const accessToken = data.access_token;
                const refreshToken = data.refresh_token;

                LocalStorage.setItem("access_token", accessToken);
                LocalStorage.setItem("refresh_token", refreshToken);

                // sau khi đăng ký thành công thì xóa ref_code
                LocalStorage.removeItem("ref_code");

                this.toggle();

                cc.CORE.NETWORK.APP.Send({
                    event: "authentication",
                    data: {
                        type: "token",
                        access_token: accessToken
                    }
                });
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    initCaptcha() {
        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/captcha`,
            {},
            {}
        ).then(result => {
            if (result.error_code == 0) {
                const data = result.data;
                this.captcha_code = data.code;

                const image = new Image();
                image.src = data.captcha;
                image.onload = () => {
                    const texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    const spriteFrame = new cc.SpriteFrame(texture);
                    this.captchaSprite.spriteFrame = spriteFrame;
                };
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, true);
        })
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
