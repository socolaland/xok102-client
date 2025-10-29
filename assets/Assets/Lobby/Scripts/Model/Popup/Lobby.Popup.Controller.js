const AssetManager = require("AssetManager");

const SignIn = require('Lobby.Popup.SignIn.Controller');
const SignUp = require('Lobby.Popup.SignUp.Controller');
const SignOut = require('Lobby.Popup.SignOut.Controller');
const Transfer = require('Lobby.Popup.Transfer.Controller');
const VerifyPhone = require('Lobby.Popup.Verify_Phone.Controller');
const Profile = require('Lobby.Popup.Profile.Controller');
const ChangeAvatar = require('Lobby.Popup.ChangeAvatar.Controller');
const ForgotPwd = require('Lobby.Popup.ForgotPwd.Controller');
const HistoryBet = require('Lobby.Popup.History_Bet.Controller');
const HistoryFinan = require('Lobby.Popup.History_Finan.Controller');
const Inbox = require('Lobby.Popup.Inbox.Controller');
const Setting = require('Lobby.Popup.Setting.Controller');
const Contact = require('Lobby.Popup.Contact.Controller');
const ChangePwd = require('Lobby.Popup.ChangePwd.Controller');
const Payment = require('Lobby.Popup.Payment.Controller');
const HistoryTransfer = require('Lobby.Popup.History_Transfer.Controller');
const HistoryTip = require('Lobby.Popup.History_Tip.Controller');
const GameApi = require('Lobby.Popup.GameApi.Controller');
const GameApiDirect = require('Lobby.Popup.GameApi.Direct.Controller');
const GameApiTransferWallet = require('Lobby.Popup.GameApi.TransferWallet.Controller'); 
const NewMember = require('Lobby.Popup.New_Member.Controller');

cc.Class({
    extends: cc.Component,

    properties: {
        SignIn: SignIn,
        SignUp: SignUp,
        SignOut: SignOut,
        Transfer: Transfer,
        VerifyPhone: VerifyPhone,
        Profile: Profile,
        ChangeAvatar: ChangeAvatar,
        ForgotPwd: ForgotPwd,
        HistoryBet: HistoryBet,
        HistoryFinan: HistoryFinan,
        Inbox: Inbox,
        Setting: Setting,
        Contact: Contact,
        ChangePwd: ChangePwd,
        Payment: Payment,
        HistoryTransfer: HistoryTransfer,
        HistoryTip: HistoryTip,
        GameApi: GameApi,
        GameApiDirect: GameApiDirect,
        GameApiTransferWallet: GameApiTransferWallet,
        Event: {
            type: cc.Prefab,
            default: null,
        },
        NewMember: NewMember,
    },

    init(obj) {
        this.CORE = obj;
        this.SignIn.init(this);
        this.SignUp.init(this);
        this.Transfer.init(this);
        this.VerifyPhone.init(this);
        this.Profile.init(this);
        this.ChangeAvatar.init(this);
        this.ForgotPwd.init(this);
        this.HistoryBet.init(this);
        this.HistoryFinan.init(this);
        this.Inbox.init(this);
        this.Setting.init(this);
        this.Contact.init(this);
        this.ChangePwd.init(this);
        this.Payment.init(this);
        this.HistoryTransfer.init(this);
        this.HistoryTip.init(this);
        this.GameApi.init(this);
        this.GameApiDirect.init(this);
        this.NewMember.init(this);
        this.GameApiTransferWallet.init(this);
    },
    onLoad() {
    },
    show(popupName, customData = null) {
        const popup = (customData) ? customData : popupName;
        switch (popup) {
            case "signin":
                this.SignIn.toggle();
                break;
            case "signup":
                this.SignUp.toggle();
                break;
            case "signout":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.SignOut.toggle();
                break;
            case "forgot_pwd":
                this.ForgotPwd.toggle();
                break;
            case "transfer":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                return cc.CORE.GAME_SCENCE.FastNotify("Chức năng chỉ dành cho đại lý!", "error", 1, 1, true);
                this.Transfer.toggle();
                break;
            case "verify_phone":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.VerifyPhone.toggle();
                break;
            case "profile":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.Profile.toggle();
                break;
            case "change_avatar":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.ChangeAvatar.toggle();
                break;
            case "history_bet":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.HistoryBet.toggle();
                break;
            case "history_finan":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.HistoryFinan.toggle();
                break;
            case "inbox":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.Inbox.toggle();
                break;
            case "setting":
                this.Setting.toggle();
                break;
            case "contact":
                this.Contact.toggle();
                break;
            case "change_password":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.ChangePwd.toggle();
                break;
            case "payment":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.Payment.toggle();
                break;
            case "history_transfer":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.HistoryTransfer.toggle();
                break;
            case "history_tip":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.HistoryTip.toggle();
                break;
            case "game_api":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.GameApi.toggle();
                break;
            case "game_api_direct":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.GameApiDirect.toggle();
                break;
            case "game_api_transfer_wallet":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.GameApiTransferWallet.toggle();
                break;
            case "event":
                if (!cc.CORE.IS_LOGIN) return this.show("signin");
                this.Event_toggle();
                break;
            case "new_member":
                this.NewMember.toggle();
                break;
            default:
                break;
        }
    },
    onClickContact: function (event, customEventData = "TELEGRAM_GROUP") {
        const type = customEventData;
        const contact = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[type];
        // Kiểm tra xem contact có hợp lệ không
        if (contact && contact !== "" && contact !== null) {
            // Mở URL ngay lập tức khi người dùng click vào button
            cc.sys.openURL(contact);
        } else {
            this.FastNotify(contact ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
        }
    },
    Event_toggle: function () {
        // load prefab event
        cc.CORE.UTIL.showLoading(1);

        AssetManager.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Event/Lobby.Popup.Event", cc.Prefab)
            .then(prefab => {
                let node = cc.instantiate(prefab);
                node.active = false;
                node.name = "Lobby.Popup.Event";
                const nodeComp = node.getComponent('Lobby.Popup.Event.Controller');
                this.Event = nodeComp;
                nodeComp.init(this);
                this.node.addChild(node);
                cc.CORE.UTIL.togglePopup(node, !node.active, {
                    time: 0.3,
                    callback: () => {
                    }
                });
                cc.CORE.UTIL.showLoading(0);
            })
            .catch(err => console.error("❌ Error loading prefab:", err));
    },
    update(dt) {
    }
});
