cc.Class({
    extends: cc.Component,

    properties: {
        username_txt: cc.Label,
    },

    init(obj) {
        this.CORE = obj;
        this.data = {};
    },
    onLoad() {
    },
    onEnable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
    },
    clickConfirm() {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                xocdia: {
                    request_join: this.data
                }
            }
        });
        this.close();
    },
    show(data) {
        this.data = data;
        if (void 0 !== this.data.nickname) this.username_txt.string = this.data.nickname;
        this.node.active = true;
    },
    close() {
        this.node.active = false;
    },
    update(dt) {
    }
});
