const HttpRequest = require("HttpRequest");

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.EditBox,
        NewPassword: {
            default: null,
            type: cc.EditBox,
        },
        ReNewPassword: {
            default: null,
            type: cc.EditBox,
        },
        inputOtp: cc.EditBox,
        captcha: cc.EditBox,
        captchaSprite: cc.Sprite,
    },

    init(obj) {
        this.CORE = this;
        this.captcha_code = null;
    },
    onLoad() {
    },
    onEnable() {
        this.initCaptcha();
    },
    clickGetOtp() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/auth/get-otp-forgot-password`,
            {},
            {
                "username": this.username.string,
                "action": "forgot_password"
            }
        ).then(result => {
            if (result.error_code == 0) {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "success", 1, 1, true);
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    onChangerClick: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);

        if (this.NewPassword.string.length < 5 ||
            this.NewPassword.string.length > 30 ||
            this.ReNewPassword.string.length < 5 ||
            this.ReNewPassword.string.length > 30
        ) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu từ 5 tới 30 ký tự!", "error", 1, 1, true);
        if (this.NewPassword.string != this.ReNewPassword.string) {
            return cc.CORE.GAME_SCENCE.FastNotify("Nhập lại mật khẩu mới không khớp!", "error", 1, 1, true);
        }
        if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, true);
        if (this.captcha.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mã xác nhận không hợp lệ!", "error", 1, 1, true);
        if (this.captcha.string != this.captcha_code) return cc.CORE.GAME_SCENCE.FastNotify("Mã captcha không hợp lệ!", "error", 1, 1, true);


        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/auth/recover-password`,
            {},
            {
                "username": this.username.string,
                "password": this.NewPassword.string,
                "otp": this.inputOtp.string
            }
        ).then(result => {
            if (result.error_code == 0) {
                this.toggle();
                cc.CORE.GAME_SCENCE.FastNotify("Đổi mật khẩu thành công!", "success", 1, 1, true);
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            // return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
            return cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, true);
        })
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
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
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    update(dt) {
    }
});
