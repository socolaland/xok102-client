const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.Label,
        session: cc.Label,
        time: cc.Label,
        status: cc.Node,
        total_bet: cc.Label,
        // bet_door: cc.Label,
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
        result_dot2: {
            default: [],
            type: cc.Node
        }
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
    onClickViewDetail() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClickViewSessionBySession(this.data);
    },
    update(dt) {
    }
});