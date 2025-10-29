const Bank = require('Lobby.Popup.Payment.Deposit.Bank.Controller');
const QrCode = require('Lobby.Popup.Payment.Deposit.QrCode.Controller');
const Usdt = require('Lobby.Popup.Payment.Deposit.Usdt.Controller');


cc.Class({
    extends: cc.Component,

    properties: {
        headerGateType: cc.Node,
        bodyGateType: cc.Node,
        Bank: Bank,
        QrCode: QrCode,
        Usdt: Usdt,
    },

    init(obj) {
        this.CORE = obj;
        this.config = null;
        this.tabShow = "BANK";
        // cc.log(this.CORE.maintanceNode);
    },
    onLoad() {
        this.Bank.init(this);
        this.QrCode.init(this);
        this.Usdt.init(this);
    },
    onEnable() {
    },
    onSelectheaderGateType: function (event) {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.config == null) return;
        const name = event.target.name;
        this.headerGateType.children.forEach(node => {
            if (node.name == name) {
                node.getChildByName("active").active = true; node.getChildByName("none").active = false;
            } else {
                node.getChildByName("active").active = false; node.getChildByName("none").active = true;
            }
        });
        // show body gate type
        this.bodyGateType.children.forEach(node => {
            if (node.name == name) {
                try {
                    if (this.config[name.toLowerCase()]["auto"]["config"]["status"] == "active") {
                        node.active = true;
                        this.CORE.maintanceNode.active = false;
                    } else {
                        node.active = false;
                        this.CORE.maintanceNode.active = true;
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                node.active = false;
            }
        });
        this.tabShow = name;
    },
    toggle() {
        this.node.active = !this.node.active;
    },
    update(dt) {
    }
});
