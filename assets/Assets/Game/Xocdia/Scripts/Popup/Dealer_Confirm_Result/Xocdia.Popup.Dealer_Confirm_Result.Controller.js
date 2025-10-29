cc.Class({
    extends: cc.Component,

    properties: {
        result_node: cc.Node,
    },

    init(obj) {
        this.CORE = obj;
        this.BET_DOOR_ENUM = {
            "double": "CHẴN",
            "red3": "3 ĐỎ",
            "red4": "4 ĐỎ",
            "white3": "3 TRẮNG",
            "white4": "4 TRẮNG"
        };
    },
    getWinningDoorsText(result) {
        if (result.length == 0) return 'null';
        const red = result.filter(Boolean).length;
        const white = 4 - red;
        if (red == 2 && white == 2) return 'double';
        if (red == 3) return 'red3';
        if (red == 4) return 'red4';
        if (white == 3) return 'white3';
        if (white == 4) return 'white4';
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
        let door = this.getWinningDoorsText(result);
        this.result_node.children.forEach(node => {
            if (node.name == door) {
                node.getChildByName("active").active = true;
            } else {
                node.getChildByName("active").active = false;
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
