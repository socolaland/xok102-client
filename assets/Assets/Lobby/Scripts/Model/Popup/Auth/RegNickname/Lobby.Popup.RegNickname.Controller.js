cc.Class({
    extends: cc.Component,

    properties: {
        nickname: cc.EditBox
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
    },
    clickRegNickname() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.nickname.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(this.nickname.string)) {
            return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);
        }

        cc.CORE.NETWORK.APP.Send({
            event: "user",
            data: {
                set_nickname: this.nickname.string
            }
        });
    },
    hidePopup() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
