const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        Avatar: cc.Sprite,
        Username: cc.Label,
        Balance: cc.Label,
    },

    init(obj) {
    },
    onLoad: function () {
    },
    onData: function (data) {
        if (data) {
            // if (void 0 !== data.username) {
            //     this.Username.string = data.username.toUpperCase();
            // }

            if (void 0 !== data.nickname && data.nickname != null) {
                this.Username.string = data.nickname.toUpperCase();
            } else {
                if (void 0 !== data.username) {
                    this.Username.string = data.username.toUpperCase();
                }
            }
            if (void 0 !== data.balance) {
                if (data.balance.toString().length >= 9) {
                    this.Balance.string = cc.CORE.UTIL.abbreviateNumber(data.balance, 2);
                } else {
                    this.Balance.string = cc.CORE.UTIL.numberWithCommas(data.balance);
                }
            }
        }
    },
    update(dt) {
        if (cc.CORE.IS_LOGIN) {
            // Load and set avatar
            if (cc.CORE.USER?.avatar) {
                AssetManager.setAvatarToSprite(this.Avatar, cc.CORE.USER?.avatar)
                    .then(spriteFrame => {
                        // console.log("Player avatar " + cc.CORE.USER?.avatar + " loaded and set successfully!");
                    })
                    .catch(error => {
                        console.error("Failed to set player avatar:", error);
                        // Xử lý lỗi cụ thể ở đây, ví dụ hiển thị ảnh mặc định
                    });
            }
        }
    },
});
