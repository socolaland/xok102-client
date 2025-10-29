
cc.Class({
    extends: cc.Component,

    properties: {
        top: cc.Label,
        username: cc.Label,
        is_current: cc.Node,
        btn_set: cc.Node,
        btn_cancel: cc.Node,
    },
    // onLoad () {},
    init(obj, data) {
        this.CORE = obj;
        this.data = data;
    },
    onEnable() {
    },
    onClickCancel: function () {
        this.CORE.onCancelContractor(this.data);
    },
    onClickSetContractor: function () {
        this.CORE.onClickSetContractor(this.data);
    },
    playClick: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
    }
    // update (dt) {},
});
