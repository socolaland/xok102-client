const LocalStorage = require("LocalStorage");
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
        // this.initCaptcha();
        if (cc.CORE.GAME_SCENCE.ROOM.room_type == "private") {
            const ref = (cc.CORE.GAME_SCENCE.ROOM.is_ended) ? "": " đăng ký";
            this.text.string = `Bạn có chắc chắn muốn${ref}\nthoát khỏi phòng không?`; 
        } else {
            this.text.string = "Bạn có chắc chắn muốn\nrời khỏi phòng không?"; 
        }
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
    },
    clickLeave() {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    leave: {
                        room_code: cc.CORE.GAME_ROOM.ROOM_CODE
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
