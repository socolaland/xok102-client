cc.Class({
    extends: cc.Component,

    properties: {
        time: cc.Label,
        amount: cc.Label,
        game: cc.Label,
        room: cc.Label,
        session: cc.Label,
    },

    init(obj, data) {
        this.CORE = obj;
        this.data = null;
    },
    onLoad() {
    },
    onEnable() {
    },
    onDisable() {
    },
    onClickItem() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClickItem(this.data);
    },
    toggle() {
    },
    onClickBet() {
    },
    update(dt) {
    }
});
