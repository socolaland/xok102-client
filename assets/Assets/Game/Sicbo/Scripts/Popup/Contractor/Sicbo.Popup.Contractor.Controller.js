cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefabItem: cc.Prefab
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
        this.STATUS_ALLOW = ["active", "pending"];
    },
    onEnable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
        this.getListContractor();
        this.content.removeAllChildren();
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
    },
    getListContractor: function () {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    contractor: {
                        get_list: { room_code: cc.CORE.GAME_ROOM.ROOM_CODE }
                    }
                }
            }
        });
    },
    onData: function (data) {
        this.content.removeAllChildren();
        let i = 1;
        data.data.forEach(request => {
            if (!this.STATUS_ALLOW.includes(request.status)) return;
            // init
            const nodeInstant = cc.instantiate(this.prefabItem);
            const nodeComp = nodeInstant.getComponent('Sicbo.Popup.ContractorList.Controller.Item');
            nodeComp.init(this, request);
            nodeComp.is_current.active = (request.status == "active") ? true : false;
            nodeComp.top.string = i;
            nodeComp.username.string = request.nickname;
            nodeComp.username.node.color = (request.is_owner && data.is_owner) ? cc.Color.YELLOW: cc.Color.WHITE;
            nodeComp.btn_cancel.active = (!request.is_owner && data.is_owner) ? true: false;
            nodeComp.btn_set.active = (request.status == "pending" && data.is_owner) ? true: false;
            this.content.addChild(nodeInstant);
            i++;
        });
    },
    clickRegister() {
        cc.CORE.GAME_SCENCE.SicboPopup.Contractor_Confirm.toggle("register");
    },
    clickCancel() {
        cc.CORE.GAME_SCENCE.SicboPopup.Contractor_Confirm.toggle("cancel");
    },
    onCancelContractor(data) {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    contractor: {
                        reject: {
                            room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                            request_id: data.id
                        }
                    }
                }
            }
        });
        setTimeout(() => {
            this.getListContractor();
        }, 800);
    },
    onClickSetContractor(data) {
        cc.CORE.GAME_SCENCE.SicboPopup.show("set_contractor", data);
    },
    toggle() {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    update(dt) {
    }
});
