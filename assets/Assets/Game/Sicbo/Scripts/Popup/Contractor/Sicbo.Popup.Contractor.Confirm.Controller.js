cc.Class({
    extends: cc.Component,

    properties: {
        label_txt: cc.Label,
        btn_confirm: cc.Node,
        btn_cancel: cc.Node
    },

    init(obj) {
        this.CORE = obj;
        this.type = null;
        this.data = null;
    },
    onLoad() {
    },
    onEnable() {
    },
    clickConfirm() {
        cc.CORE.GAME_SCENCE.PlayClick();

        if (!this.type) return;

        if (this.type == "register") {
            cc.CORE.NETWORK.APP.Send({
                event: "game",
                data: {
                    sicbo: {
                        contractor: {
                            register: {
                                room_code: cc.CORE.GAME_ROOM.ROOM_CODE
                            }
                        }
                    }
                }
            });
        }
        if (this.type == "cancel") {
            cc.CORE.NETWORK.APP.Send({
                event: "game",
                data: {
                    sicbo: {
                        contractor: {
                            cancel: {
                                room_code: cc.CORE.GAME_ROOM.ROOM_CODE
                            }
                        }
                    }
                }
            });
        }
        if (this.type == "set_contractor") {
            if (!this.data) return;
            cc.CORE.NETWORK.APP.Send({
                event: "game",
                data: {
                    sicbo: {
                        contractor: {
                            set: {
                                room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                                request_id: this.data.id
                            }
                        }
                    }
                }
            });
        }
        this.toggle();
        setTimeout(() => {
            this.CORE.Contractor.getListContractor();
        }, 800);

    },
    toggle(type, data) {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
        this.type = type;
        this.data = data;
        if (!this.type) return;

        if (this.type == "register") {
            this.label_txt.string = "Bạn muốn đăng ký thầu vị?"
        }
        if (this.type == "cancel") {
            this.label_txt.string = "Bạn muốn thoát thầu vị?"
        }
        if (this.type == "set_contractor") {
            this.label_txt.string = `Chỉ định ${data.nickname} là thầu vị?`
        }
    },
    update(dt) {
    }
});
