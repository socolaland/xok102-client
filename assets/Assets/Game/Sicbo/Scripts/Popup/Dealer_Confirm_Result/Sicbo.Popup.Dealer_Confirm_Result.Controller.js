cc.Class({
        extends: cc.Component,

        properties: {
                result_node: cc.Node,
        },

        init(obj) {
                this.CORE = obj;
        },
        getWinningDoorsText(result) {
                if (result.length == 0) return 'null';
        },
        onLoad() {
                this.setResultDoor([]);
        },
        onEnable() {
        },
        onDisable() {
                this.setResultDoor([]);
        },
        setResultDoor(result) {
                const spriteDice = cc.CORE.GAME_SCENCE.diceSprite;
                this.result_node.children.forEach((node, idx) => {
                        // Tắt node active trước
                        node.getChildByName("active").active = false;
                        // Lấy node sprite (giả sử node con tên là "dice")
                        const diceSprite = node.getChildByName("dice").getComponent(cc.Sprite);
                        if (result.length === 0) {
                                // Nếu không có kết quả, set sprite mặc định
                                diceSprite.spriteFrame = spriteDice[0];
                        } else if (idx < result.length) {
                                // Có kết quả, set sprite theo mặt xúc xắc
                                diceSprite.spriteFrame = spriteDice[result[idx]];
                                node.getChildByName("active").active = true;
                        } else {
                                // Nếu chưa có kết quả cho node này, set sprite mặc định
                                diceSprite.spriteFrame = spriteDice[0];
                        }
                });
        },
        toggle() {
                this.node.active = !this.node.active;
                // cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
        },
        onData(data_history) {

        },
        update(dt) {
        }
});
