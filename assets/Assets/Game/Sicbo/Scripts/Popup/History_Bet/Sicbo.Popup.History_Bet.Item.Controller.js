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
            if (index < result.length) {
                const diceValue = result[index];
                // Sicbo: diceValue là số từ 1-6, sử dụng sprite tương ứng
                const spriteIndex = diceValue >= 1 && diceValue <= 6 ? diceValue : 0;
                item.getComponent(cc.Sprite).spriteFrame = this.CORE.sprite_dices[spriteIndex];
            } else {
                // Nếu không có dữ liệu, hiển thị sprite mặc định
                item.getComponent(cc.Sprite).spriteFrame = this.CORE.sprite_dices[0];
            }
        })
    },
    toggle() {
    },
    onClickBet() {
    },
    update(dt) {
    }
});
