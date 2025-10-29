const LocalStorage = require('LocalStorage');
const HttpRequest = require("HttpRequest");
const GameApiOverlayIframe = require("GameApiOverlayIframe");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    init(obj) {
        this.CORE = this;
        this.play_url = null;
        this.GameApiOverlayIframe = GameApiOverlayIframe;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
    },
    setPlayUrl(url) {
        console.log(url);
        this.play_url = url;
    },
    clickDirectUrl() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (!this.play_url) return cc.CORE.GAME_SCENCE.FastNotify("Không có URL để chuyển hướng!", "error", 1, 1, true);
        this.toggle(); // tắt popup

        cc.sys.openURL(this.play_url);
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },

    createOverlayIframe() {
        // === Tắt nhạc và hiệu ứng === //
        if (cc.CORE.SETTING.MUSIC) cc.CORE.AUDIO.stopMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic);

        // this.GameApiOverlayIframe.create();
        // // Thiết lập iframe
        // this.GameApiOverlayIframe.setIframeSrc(this.play_url);
        // // Tùy chỉnh button
        // // this.GameApiOverlayIframe.setButtonContent('🌐');
        // this.GameApiOverlayIframe.setButtonPosition(8, 60);
        // this.GameApiOverlayIframe.setCustomCallback(() => {
        //     if (cc.CORE.SETTING.MUSIC) cc.CORE.AUDIO.playMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic);
        //     cc.CORE.GAME_SCENCE.PlayClick();
        //     this.GameApiOverlayIframe.destroy();
        //     // cc.game.resume();
        // });
        // // Hiển thị
        // this.GameApiOverlayIframe.show();
        // // cc.game.pause();

        try {
            cc.CORE.GAME_SCENCE.MainWebview.active = true;
            cc.CORE.GAME_SCENCE.MainWebview.children[1].children[0].getComponent(cc.WebView).url = this.play_url;
        } catch (e) {
            console.log(e);
        }
    },

    update(dt) {
    }
});
