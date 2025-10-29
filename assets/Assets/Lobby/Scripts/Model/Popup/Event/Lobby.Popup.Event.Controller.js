const Event_First_Deposit = require('Lobby.Popup.Event.First_Deposit.Controller');
const Event_Milestone_Deposit = require('Lobby.Popup.Event.Milestone_Deposit.Controller');
const Event_Refund_Bet = require('Lobby.Popup.Event.Refund_Bet.Controller');    
const Event_New_Member = require('Lobby.Popup.Event.New_Member.Controller');

cc.Class({
    extends: cc.Component,

    properties: {
        Event_List_Container: {
            type: cc.Node,
            default: null
        },
        Event_Body_Container: {
            type: cc.Node,
            default: null
        },
        Event_First_Deposit: Event_First_Deposit,
        Event_Milestone_Deposit: Event_Milestone_Deposit,
        Event_Refund_Bet: Event_Refund_Bet,
        Event_New_Member: Event_New_Member
    },

    // onLoad () {},

    onEnable() {
        this.Event_List_Container.active = true;
        this.Event_Body_Container.active = false;
    },
    init(obj) {
        this.CORE = obj;
        this.Event_First_Deposit.init(this);
        this.Event_Milestone_Deposit.init(this);
        this.Event_Refund_Bet.init(this);
        this.Event_New_Member.init(this);
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3,
            scaleFrom: 0.6,
            scaleTo: 1,
            easingIn: 'backOut',
            easingOut: 'quartInOut',
            callback: () => {
                this.Event_List_Container.active = true;
                this.Event_Body_Container.active = false;
            }
        });
    },
    comingSoon() {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.GAME_SCENCE.FastNotify("Sự kiện này sẽ sớm được ra mắt!", "info", 1);
    },
    showEventBody(event, name) {
        if (!name) return;
        cc.CORE.GAME_SCENCE.PlayClick();
        this.Event_List_Container.active = false;
        this.Event_Body_Container.children.forEach(Event_Body => {
            const find = Event_Body.name == name;
            (find) ? Event_Body.active = true : Event_Body.active = false;
        });
        this.Event_Body_Container.active = true;
    },
    showEventList() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.Event_List_Container.active = true;
        this.Event_Body_Container.active = false;
    },
    onData(data) {
        if (data?.first_deposit) {
            this.Event_First_Deposit.onData(data.first_deposit);
        }
        if (data?.milestone_deposit) {
            this.Event_Milestone_Deposit.onData(data.milestone_deposit);
        }
        if (data?.refund_bonus) {
            this.Event_Refund_Bet.onData(data.refund_bonus);
        }
    },
    // update (dt) {},
});
