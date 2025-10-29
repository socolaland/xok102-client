
cc.Class({
    extends: cc.Component,

    properties: {
        bg_active: cc.Node,
        txt_bank_name: cc.Label,
    },

    init(obj, data, type) {
        this.CORE = obj;
        this.data = data;
        this.type = type;
        this.node.name = data.code;
    },
    onLoad() {
    },
    onEnable() {
    },
    onClickItem: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.bg_active.active = true;
        this.CORE.onSelectBank(this.data, this.type);
    },
    toggle() {
        this.node.active = !this.node.active;
    },
    update(dt) {
    }
});
