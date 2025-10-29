cc.Class({
    extends: cc.Component,

    properties: {
        inputAmount: cc.EditBox,
        inputUsername: cc.EditBox,
        inputOtp: cc.EditBox,
        btn_check_on: cc.Node,
        btn_check_off: cc.Node,
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
        this.btn_check_on.active = false;
        this.btn_check_off.active = false;
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
        this.clean();
    },
    clean() {
        this.inputAmount.string = "";
        this.inputUsername.string = "";
        this.inputOtp.string = "";
    },
    onChangerAmount: function (value = 0) {
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        this.inputAmount.string = value == 0 ? "" : value;
        // set value input khi nhập
        (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
    },
    clickTransfer() {
        if (this.inputUsername.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("ID người nhận không hợp lệ!", "info", 1, false);
        if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1000) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, false);
        if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, false);

        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    transfer: {
                        room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                        amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string),
                        username: this.inputUsername.string,
                        otp: this.inputOtp.string
                    }
                }
            }
        });
        // this.toggle();
    },
    clickGetOtp() {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    get_otp: {
                        room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                        action: "transfer_balance"
                    }
                }
            }
        });
    },
    toggle() {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    onData: function (bool) {
        if (bool) {
            this.btn_check_on.active = true;
            this.btn_check_off.active = false;
        } else {
            this.btn_check_on.active = false;
            this.btn_check_off.active = true;
        }
    },
    onChangerNickname: function (value = "") {
        if (value.length > 0) {
            cc.CORE.NETWORK.APP.Send({
                event: "game",
                data: {
                    sicbo: {
                        check_transfer: {
                            room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                            nickname: value
                        }
                    }
                }
            });
        } else {
            this.btn_check_on.active = false;
            this.btn_check_off.active = false;
        }
    },
    update(dt) {
        cc.CORE.GAME_SCENCE.currentPopupOpen = "transfer"; 
    }
});
