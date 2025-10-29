const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        Avatar: cc.Sprite,
        sidebar: cc.Node,
        sidebarBg: cc.Node,
        audioSpriteframe: {
            default: [],
            type: cc.SpriteFrame
        },
        posXshow: 414,
        posXhide: 758
    },
    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
        this.isShowing = false; // đang ẩn hay đang hiện
        this.isAnimating = false; // đang tween không
        this.sidebar.active = true;
        this.sidebarBg.active = false;
    },
    onEnable() {
        this.setAvatar();
    },

    setAvatar: function () {
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

    toggleSidebar(VideoStreamNode) {
        if (this.isAnimating) return; // Ngăn click liên tục

        // if (!this.isShowing) VideoStreamNode.node.active = false;
        if (this.isShowing) this.sidebarBg.active = false;

        this.isAnimating = true;
        this.sidebar.active = true;

        const targetX = this.isShowing ? this.posXhide : this.posXshow;

        cc.tween(this.sidebar)
            .to(0.3, { x: targetX }, { easing: 'sineInOut' })
            .call(() => {
                this.isShowing = !this.isShowing; // chỉ đổi trạng thái sau khi xong
                cc.CORE.GAME_SCENCE.isPopupOpen = this.isShowing;
                this.isAnimating = false;
                if (!this.isShowing) VideoStreamNode.node.active = true;
                if (this.isShowing) this.sidebarBg.active = true;
            })
            .start();
    },

    onClickContractor: function () {
        cc.CORE.GAME_SCENCE.XocdiaPopup.show("contractor");
    },
    onClickTransfer: function () {
        if (cc.CORE.GAME_SCENCE.ROOM.room_type != "private") return cc.CORE.GAME_SCENCE.FastNotify("Tính năng chỉ áp dụng cho phòng riêng!", "info", 1, false);
        cc.CORE.GAME_SCENCE.XocdiaPopup.show("transfer");
    },
    onClickAudio: function (event) {
        // this.CORE.audioStatus = !this.CORE.audioStatus;
        // cc.CORE.SETTING.SOUND = this.CORE.audioStatus;
        // const audio = event.target.getComponent(cc.Sprite);
        // audio.spriteFrame = this.audioSpriteframe[(this.CORE.audioStatus) ? 0 : 1];
        cc.CORE.GAME_SCENCE.PopupLobby.show("setting");
    },
    onClickHistoryBet: function () {
        // cc.CORE.GAME_SCENCE.XocdiaPopup.show("history_bet");
        cc.CORE.GAME_SCENCE.PopupLobby.show("history_bet");
    },
    onClickTutorial: function () {
        cc.CORE.GAME_SCENCE.XocdiaPopup.show("tutorial");
    },

});