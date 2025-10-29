const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        session: cc.Label,
        time: cc.Label,
        status: cc.Node,
        total_bet: cc.Label,
        bet_door: cc.Label,
        bet_door1: cc.Label,
        total_refurn: cc.Label,
        fee: cc.Label,
        total_win: cc.Label,
        dot_sprite: {
            default: [],
            type: cc.SpriteFrame
        },
        result_dot: {
            default: [],
            type: cc.Node
        },
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
    setResultDot(result) {
        this.result_dot.map((item, index) => {
            item.getComponent(cc.Sprite).spriteFrame = (result[index]) ? this.dot_sprite[0] : this.dot_sprite[1];
        });
    },
    toggle() {
    },
    onClickBet() {
    },
    update(dt) {
    }
});