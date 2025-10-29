cc.Class({
    extends: cc.Component,

    properties: {},

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
        cc.CORE.GAME_SCENCE.VideoStream.node.active = false;
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.VideoStream.node.active = true;
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
    },
    toggle() {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    update(dt) {
    }
});
