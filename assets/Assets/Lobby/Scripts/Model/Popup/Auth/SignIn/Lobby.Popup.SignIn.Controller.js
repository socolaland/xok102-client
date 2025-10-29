const LocalStorage = require('LocalStorage');
const HttpRequest = require("HttpRequest");

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.EditBox,
        password: cc.EditBox,
        remember: cc.Node,
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, () => {
        //     this.clickSignIn()
        // }, this);
    },
    onEnable() {
        // this.initCaptcha();
    },
    clickSignIn() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);
        if (this.password.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu không hợp lệ!", "error", 1, 1, true);

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/auth/login`,
            {},
            {
                "username": this.username.string,
                "password": this.password.string,
                // "captcha": this.captcha.string
            }
        ).then(result => {
            console.log(result);
            if (result.error_code == 0) {
                const data = result.data;

                const accessToken = data.access_token;
                const refreshToken = data.refresh_token;

                LocalStorage.setItem("access_token", accessToken);
                LocalStorage.setItem("refresh_token", refreshToken);

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
            return cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, true);
        })
    },
    // initCaptcha() {
    //     HttpRequest.Post(
    //         `${cc.CORE.CONFIG.SERVER_API}/captcha`,
    //         {},
    //         {}
    //     ).then(result => {
    //         console.log(result);
    //         if (result.error_code == 0) {
    //             const data = result.data;
    //             this.captcha_code = data.code;

    //             const image = new Image();
    //             image.src = data.captcha;
    //             image.onload = () => {
    //                 const texture = new cc.Texture2D();
    //                 texture.initWithElement(image);
    //                 texture.handleLoadedTexture();
    //                 const spriteFrame = new cc.SpriteFrame(texture);
    //                 this.captchaSprite.spriteFrame = spriteFrame;
    //             };
    //         } else {
    //             cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
    //         }
    //     }).catch(e => {
    //         console.log(e);
    //         return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
    //     })
    // },
    toggle() {
        // this.node.active = !this.node.active;
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    checkRemember() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.remember.active = !this.remember.active;
    },
    update(dt) {
    }
});
