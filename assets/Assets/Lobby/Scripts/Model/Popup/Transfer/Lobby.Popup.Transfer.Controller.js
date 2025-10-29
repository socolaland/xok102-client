const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        inputAmount: cc.EditBox,
        inputUsername: cc.EditBox,
        inputOtp: cc.EditBox,
        inputContent: cc.EditBox,
        btn_check_on: cc.Node,
        btn_check_off: cc.Node,
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
    },
    onDisable() {
        this.clean();
    },
    clean() {
        this.inputAmount.string = "";
        this.inputUsername.string = "";
        this.inputOtp.string = "";
        this.inputContent.string = "";
    },
    // onChangerAmount: function (value = 0) {
    //     // Lấy giá trị nhập vào và chỉ lấy số
    //     let value = event.string;

    //     // Chỉ lấy các ký tự số và định dạng lại với dấu phẩy
    //     value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));

    //     // Cập nhật lại giá trị với dấu phẩy
    //     this.inputAmount.string = value;

    //     // Nếu giá trị là "0", hiển thị rỗng
    //     this.inputAmount.string = value === '0' ? '' : value;
    // },
    onChangerAmount: function (value) {
        // Chỉ lấy các ký tự số và định dạng lại với dấu phẩy
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        // Cập nhật lại giá trị với dấu phẩy
        this.inputAmount.string = value;
        // Nếu giá trị là "0", hiển thị rỗng
        this.inputAmount.string = value === '0' ? '' : value;

        // set value input khi nhập
        (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
    },
    onChangerNickname: function (value = "") {
        if (value.length > 0) {
            HttpRequest.Get(
                `${cc.CORE.CONFIG.SERVER_API}/user/check-valid-nickname?nickname=${value}`,
                {},
                { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
            ).then(result => {
                if (result.error_code == 0) {
                    this.btn_check_on.active = true;
                    this.btn_check_off.active = false;
                } else {
                    this.btn_check_on.active = false;
                    this.btn_check_off.active = true;
                }
            }).catch(e => {
                this.btn_check_on.active = false;
                this.btn_check_off.active = false;
            })
        } else {
            this.btn_check_on.active = false;
            this.btn_check_off.active = false;
        }
    },
    clickTransfer() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.inputUsername.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("ID người nhận không hợp lệ!", "info", 1, 1, true);
        if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1000) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, 1, true);
        if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, true);

        cc.CORE.NETWORK.APP.Send({
            event: "transfer",
            data: {
                amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string),
                username: this.inputUsername.string,
                otp: this.inputOtp.string,
                content: this.inputContent.string
            }
        });
        // this.toggle();
    },
    clickGetOtp() {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.NETWORK.APP.Send({
            event: "security",
            data: {
                get_otp: { action: "transfer_balance" }
            }
        });
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
