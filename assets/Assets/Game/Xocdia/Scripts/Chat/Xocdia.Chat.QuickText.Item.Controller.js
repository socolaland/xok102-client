
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label
    },
    // onLoad () {},

    init(obj) {
        this.CORE = obj;
    },
    onClick: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClickChatQuickTextItem(this.text.string);
    }
    // update (dt) {},
});
