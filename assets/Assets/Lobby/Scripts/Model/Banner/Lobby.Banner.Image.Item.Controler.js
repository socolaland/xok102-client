cc.Class({
    extends: cc.Component,

    properties: {
        image: cc.Sprite,
    },

    start () {
    },

    init(obj, item) {
        this.CORE = obj;
        this.item = item;
    },

    onClickItem() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.item.link !== null && this.item.link !== undefined && this.item.link !== "") {
            cc.sys.openURL(this.item.link);
        }
    },
});
