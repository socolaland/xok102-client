cc.Class({
    extends: cc.Component,

    properties: {
        time: cc.Label,
        status: cc.Node,
        total_bet: cc.Label,
        total_refurn: cc.Label,
        fee: cc.Label,
        total_win: cc.Label,
    },

    init(obj, data) {
        this.CORE = obj;
        this.data = data;
    },
    onLoad() {
    },
    onEnable() {
    },
    onDisable() {
    },
    toggle() {
    },
    onClickBet() {
    },
    onClickViewDetail() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClickViewSessionByDate(this.data);
    },
    update(dt) {
    }
});
