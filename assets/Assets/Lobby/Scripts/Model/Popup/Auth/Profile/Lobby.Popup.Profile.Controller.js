const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        balance: cc.Label,
        nickname: cc.Label,
        uid: cc.Label,
        phone: cc.Label,
        avatar: cc.Sprite,
        verify_phone: cc.Label,
        verify_phone_btn: cc.Node,
        created_at: cc.Label,
        updated_at: cc.Label,  
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        // this.initCaptcha();
    },
    clickRegNickname() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.nickname.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(this.nickname.string)) {
            return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, true);
        }

        cc.CORE.NETWORK.APP.Send({
            event: "user",
            data: {
                set_nickname: this.nickname.string
            }
        });
    },
    onClickChangePassword() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        this.toggle();
        cc.CORE.GAME_SCENCE.Popup.show("change_password");
    },
    onClickVerifyPhone() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        this.toggle();
        cc.CORE.GAME_SCENCE.Popup.show("verify_phone");
    },
    onClickChangeAvatar() {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.show("change_avatar");
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
        if (cc.CORE.IS_LOGIN) {
            this.balance.string = cc.CORE.UTIL.numberWithCommas(cc.CORE.USER?.balance) || 0;
            this.nickname.string = cc.CORE.USER?.nickname.toUpperCase() || "Chưa cập nhật";
            this.uid.string = "UID: 2037" + cc.CORE.USER?.id || "";
            this.created_at.string = cc.CORE.UTIL.getStringDateByTime(cc.CORE.USER?.createdAt) || "";
            this.updated_at.string = cc.CORE.UTIL.getStringDateByTime(cc.CORE.USER?.updatedAt) || "";

            if (cc.CORE.USER?.verify) {
                this.verify_phone.string = "Đã xác minh";
                this.verify_phone.node.color = cc.color().fromHEX("#00FF00");
                this.verify_phone_btn.active = false;
            } else {
                this.verify_phone.string = "Chưa xác minh";
                this.verify_phone.node.color = cc.color().fromHEX("#FF0000");
                this.verify_phone_btn.active = true;
            }
            if (cc.CORE.USER?.phone !== null) {
                this.phone.string = "+" + cc.CORE.UTIL.maskPhoneNumber(cc.CORE.USER?.phone);
            } else {
                this.phone.string = "Chưa cập nhật";
            }
            // this.avatar.spriteFrame = cc.CORE.USER?.avatar || "";

            // Load and set avatar
            if (cc.CORE.USER?.avatar) {
                AssetManager.setAvatarToSprite(this.avatar, cc.CORE.USER?.avatar)
            .then(spriteFrame => {
                // console.log("Player avatar " + cc.CORE.USER?.avatar + " loaded and set successfully!");
            })
            .catch(error => {
                console.error("Failed to set player avatar:", error);
                    // Xử lý lỗi cụ thể ở đây, ví dụ hiển thị ảnh mặc định
                });
            }

        }
    }
});
