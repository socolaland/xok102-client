const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.Label,
        session: cc.Label,
        time: cc.Label,
        status: cc.Node,
        total_bet: cc.Label,
        bet_door: cc.Label,
        total_refurn: cc.Label,
        fee: cc.Label,
        total_win: cc.Label,
        result_dot: {
            default: [],
            type: cc.Node
        }
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
    },
    onDisable() {
    },
    setResult(result) {
        this.result_dot.map((item, index) => {
            item.getComponent(cc.Sprite).spriteFrame = (result[index]) ? this.CORE.sprite_dices[0] : this.CORE.sprite_dices[1];
        })
    },
    toggle() {
    },
    onClickBet() {
    },
    update(dt) {
    }
});
