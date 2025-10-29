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
        // sắp xếp theo thứ tự tăng dần 3 mặt xúc xắc
        result.sort((a, b) => a - b);
        this.result_dot.map((item, index) => {
            item.getComponent(cc.Sprite).spriteFrame = this.dot_sprite[result[index]];
        });
    },
    toggle() {
    },
    onClickBet() {
    },
    update(dt) {
    }
});