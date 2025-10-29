const LocalStorage = require('LocalStorage');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
    },
    clickSignOut() {
        cc.CORE.GAME_SCENCE.PlayClick();
        LocalStorage.setItem("access_token", "");
        LocalStorage.setItem("refresh_token", "");
        LocalStorage.removeItem("ref_code");

        cc.CORE.NETWORK.APP._close();
        cc.CORE.IS_LOGIN = false;
        cc.CORE.USER = {};
        cc.CORE.GAME_ROOM.clean();
        cc.CORE.GAME_SCENCE.Header.setHeader();
        
        this.toggle();
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
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
