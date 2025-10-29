const LocalStorage = require("LocalStorage");
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
        cc.CORE.AUDIO.playSound(cc.CORE.GAME_SCENCE.Audio.owner_leave);
    },
    toggle() {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    update(dt) {
    }
});
