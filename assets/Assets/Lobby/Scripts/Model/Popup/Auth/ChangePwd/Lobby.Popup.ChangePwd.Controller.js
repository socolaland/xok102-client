const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        OldPassword: {
            default: null,
            type: cc.EditBox,
        },
        NewPassword: {
            default: null,
            type: cc.EditBox,
        },
        ReNewPassword: {
            default: null,
            type: cc.EditBox,
        },
        inputOtp: cc.EditBox,
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        this.clear();
    },
    onDisable() {
    },
    clear: function () {
        this.OldPassword.string = this.NewPassword.string = this.ReNewPassword.string = this.inputOtp.string = "";
    },
    onChangerClick: function () {
        cc.CORE.GAME_SCENCE.PlayClick();

        if (this.OldPassword.string.length < 5 ||
            this.OldPassword.string.length > 30 ||
            this.NewPassword.string.length < 5 ||
            this.NewPassword.string.length > 30 ||
            this.ReNewPassword.string.length < 5 ||
            this.ReNewPassword.string.length > 30
        ) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu từ 5 tới 30 ký tự!", "error", 1, 1, true);


        if (this.OldPassword.string == this.NewPassword.string) {
            return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu mới không trùng với mật khẩu cũ!", "error", 1, 1, true);
        }
        if (this.NewPassword.string != this.ReNewPassword.string) {
            return cc.CORE.GAME_SCENCE.FastNotify("Nhập lại mật khẩu mới không khớp!", "error", 1, 1, true);
        }

        if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, true);

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/auth/change-password`,
            {},
            {
                "password": this.OldPassword.string,
                "new_password": this.NewPassword.string,
                "otp": this.inputOtp.string
            },
            {
                "Authorization": `Bearer ${LocalStorage.getItem("access_token")}`,
            }
        ).then(result => {
            if (result.error_code == 0) {
                this.toggle();
                cc.CORE.GAME_SCENCE.FastNotify("Đổi mật khẩu thành công!", "success", 1, 1, true);

                const data = result.data;
                const accessToken = data.access_token;
                const refreshToken = data.refresh_token;
                LocalStorage.setItem("access_token", accessToken);
                LocalStorage.setItem("refresh_token", refreshToken);
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    clickGetOtp() {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.NETWORK.APP.Send({
            event: "security",
            data: {
                get_otp: { action: "change_password" }
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
