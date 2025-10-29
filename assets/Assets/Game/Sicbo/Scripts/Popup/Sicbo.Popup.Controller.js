const LeaveGame = require('Sicbo.Popup.LeaveGame.Controller');
const TipDealer = require('Sicbo.Popup.TipDealer.Controller');
const Contractor = require('Sicbo.Popup.Contractor.Controller');
const Contractor_Confirm = require('Sicbo.Popup.Contractor.Confirm.Controller');
const Transfer = require('Sicbo.Popup.Transfer.Controller');
const History_Bet = require('Sicbo.Popup.History_Bet.Controller');
const Tutorial = require('Sicbo.Popup.Tutorial.Controller');
const Dealer_Confirm_Result = require('Sicbo.Popup.Dealer_Confirm_Result.Controller');
const Request_Join_Room = require('Sicbo.Popup.Request_Join_Room.Controller');
const Customer_Tip = require('Sicbo.Popup.Customer_Tip.Controller');
const Owner_Leave = require('Sicbo.Popup.Owner_Leave.Controller');

cc.Class({
    extends: cc.Component,

    properties: {
        LeaveGame: LeaveGame,
        TipDealer: TipDealer,
        Contractor: Contractor,
        Contractor_Confirm: Contractor_Confirm,
        Transfer: Transfer,
        History_Bet: History_Bet,
        Tutorial: Tutorial,
        Dealer_Confirm_Result: Dealer_Confirm_Result,
        Request_Join_Room: Request_Join_Room,
        Customer_Tip: Customer_Tip,
        Owner_Leave: Owner_Leave,
    },

    init(obj) {
        this.CORE = obj;
        this.LeaveGame.init(this);
        this.TipDealer.init(this);
        this.Contractor.init(this);
        this.Contractor_Confirm.init(this);
        this.Transfer.init(this);
        this.History_Bet.init(this);
        this.Tutorial.init(this);
        this.Dealer_Confirm_Result.init(this);
        this.Request_Join_Room.init(this);
        this.Customer_Tip.init(this);
        this.Owner_Leave.init(this);
    },
    onLoad() {

    },
    show(popupName, data) {
        switch (popupName) {
            case "tip":
                this.TipDealer.toggle();
                break;
            case "leave":
                this.LeaveGame.toggle();
                break;
            case "contractor":
                this.Contractor.toggle();
                break;
            case "contractor_register":
                this.Contractor_Confirm.toggle("register");
                break;
            case "contractor_cancel":
                this.Contractor_Confirm.toggle("cancel");
            case "set_contractor":
                this.Contractor_Confirm.toggle("set_contractor", data);
                return;
            case "transfer":
                this.Transfer.toggle();
                break;
            case "history_bet":
                this.History_Bet.toggle();
                break;
            case "tutorial":
                this.Tutorial.toggle();
                break;
            case "dealer_confirm_result":
                this.Dealer_Confirm_Result.toggle();
                break;
            case "request_join_room":
                this.Request_Join_Room.show(data);
                break;
            case "customer_tip":
                this.Customer_Tip.show(data);
                break;
            case "owner_leave":
                this.Owner_Leave.toggle();
                break;
            default:
                break;
        }
    },
    update(dt) {
    }
});
