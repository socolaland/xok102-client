cc.Class({
    extends: cc.Component,

    properties: {
        inputAmount: cc.EditBox
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
        this.inputAmount.string = "";
    },
    onChangerAmount: function (value = 0) {
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        this.inputAmount.string = value == 0 ? "" : value;
        // set value input khi nhập
        (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
    },
    clickTip() {
        if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1000) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, false);

        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                xocdia: {
                    tip: {
                        room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                        amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)
                    }
                }
            }
        });
        this.toggle();
    },
    toggle() {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    update(dt) {
    }
});
