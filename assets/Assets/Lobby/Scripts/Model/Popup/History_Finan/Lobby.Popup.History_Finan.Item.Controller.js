cc.Class({
    extends: cc.Component,

    properties: {
        gate_name: cc.Label,
        time: cc.Label,
        amount: cc.Label,
        fee: cc.RichText,
        status: cc.Label,
        status_icons: {
            default: [],
            type: cc.Node
        }
    },

    init(obj, data) {
        this.CORE = obj;
        this.data = null;
    },
    setStatusIcon(status) {
        this.status_icons.forEach(node => {
            node.active = (node.name == status) ? true : false;
        });
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
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    onClickBet() {
    },
    update(dt) {
    }
});
