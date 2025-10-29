cc.Class({
    extends: cc.Component,

    properties: {
        FormVerify: cc.Node,
        FormVerified: cc.Node,

        inputOtp: cc.EditBox,
        user_phone: cc.Label,
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        if (void 0 !== cc.CORE.USER.verify && void 0 !== cc.CORE.USER.phone) {
            if (cc.CORE.USER.verify && cc.CORE.USER.phone !== null) {
                this.user_phone.string = "+" + cc.CORE.USER.phone;
                this.FormVerify.active = false;
                this.FormVerified.active = true;
            } else {
                this.FormVerify.active = true;
                this.FormVerified.active = false;
            }
        } else {
            this.FormVerify.active = true;
            this.FormVerified.active = false;
        }
    },
    onDisable() {
        this.inputOtp.string = "";
    },
    onClickVerify() {
        cc.CORE.GAME_SCENCE.PlayClick();
        // this.FormVerify.active = false;
        // this.FormVerified.active = true;
        if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "error", 1, 1, true);
        cc.CORE.NETWORK.APP.Send({
            event: "security",
            data: {
                verify: { otp: this.inputOtp.string }
            }
        });
    },
    onClickOtpBot(event, customEventData = "TELEGRAM_BOT") {
        cc.CORE.GAME_SCENCE.PlayClick();
        // cc.CORE.GAME_SCENCE.onClickContact(null, customEventData);

        const type = customEventData;
        const contact = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[type];
        // Kiểm tra xem contact có hợp lệ không
        if (contact && contact !== "" && contact !== null) {
            // Mở URL ngay lập tức khi người dùng click vào button
            cc.sys.openURL(contact);
        } else {
            this.FastNotify(contact ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
        }
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
        if (void 0 !== cc.CORE.USER.verify && void 0 !== cc.CORE.USER.phone) {
            if (cc.CORE.USER.verify && cc.CORE.USER.phone !== null) {
                this.user_phone.string = "+" + cc.CORE.UTIL.maskPhoneNumber(cc.CORE.USER.phone);
                this.FormVerify.active = false;
                this.FormVerified.active = true;
            } else {
                this.FormVerify.active = true;
                this.FormVerified.active = false;
            }
        } else {
            this.FormVerify.active = true;
            this.FormVerified.active = false;
        }
    }
});
