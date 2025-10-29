cc.Class({
    extends: cc.Component,

    properties: {
        Select_Room: cc.Node,
        Enter_Info_Room: cc.Node,

        RoomCode: cc.EditBox,
        RoomPassword: cc.EditBox,
    },

    // onLoad () {},
    init: function (obj) {
        this.CORE = obj;
    },
    onEnable() {
        this.Select_Room.active = true;
        this.Enter_Info_Room.active = false;
    },
    onLoad() {
    },
    openTabEnterInfoRoom: function () {
        this.Select_Room.active = false;
        this.Enter_Info_Room.active = true;
    },
    confirmJoinPublicRoom: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        const room_code = "public_1";
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                xocdia: {
                    join: {
                        room_code,
                        password: null
                    }
                }
            }
        });
        this.toggle();
    },
    confirmJoinPrivateRoom: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        const room_code = this.RoomCode.string || null;
        const room_password = this.RoomPassword.string || null;

        if (!room_code) return cc.CORE.GAME_SCENCE.FastNotify("Mã bàn chơi không hợp lệ!", "error", null, null, true);

        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                xocdia: {
                    join: {
                        room_code,
                        password: room_password
                    }
                }
            }
        });
    },


    toggle: function (event) {
        this.node.active = !this.node.active;
    }
    // update (dt) {},
});
