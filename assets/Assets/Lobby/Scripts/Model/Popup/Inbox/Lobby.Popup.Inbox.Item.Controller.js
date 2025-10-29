cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.RichText,
        time: cc.Label,
        from: cc.Label,
        new_icon: cc.Node,
    },

    init(obj, data = {}) {
        this.CORE = obj;
        this.data = data;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
    },
    onClickRemove: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onRemoveInbox(this.data);
    },
    onClickView: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClickViewInbox(this.data);
    },
});