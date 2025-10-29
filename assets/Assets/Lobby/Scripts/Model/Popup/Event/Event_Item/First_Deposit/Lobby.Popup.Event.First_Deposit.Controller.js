const Progress = require('Lobby.Popup.Event.First_Deposit.Progress.Controller');

cc.Class({
  extends: cc.Component,

  properties: {
    Event_Header_Container: {
      type: cc.Node,
      default: null
    },
    Event_Body_Container: {
      type: cc.Node,
      default: null
    },
    Progress: Progress
  },

  // onLoad () {},

  onEnable() {
    this.getData();
  },
  onDisable() {
    this.Progress.cleanProgress();
  },
  init(obj) {
    this.CORE = obj;
    this.Progress.init(this);
    // get data when init
    this.getData();
  },
  header_Body_Select(event, custom) {
    cc.CORE.GAME_SCENCE.PlayClick();
    let name = event.target.name;
    this.Event_Header_Container.children.forEach(Event_Body_Header_Item => {
      const find = Event_Body_Header_Item.name == name;
      if (find) {
        Event_Body_Header_Item.children[0].active = true;
        Event_Body_Header_Item.children[1].active = false;
      } else {
        Event_Body_Header_Item.children[0].active = false;
        Event_Body_Header_Item.children[1].active = true;
      }
    });
    this.Event_Body_Container.children.forEach(Event_Body_Item => {
      const find = Event_Body_Item.name == name;
      (find) ? Event_Body_Item.active = true : Event_Body_Item.active = false;
    });
  },

  // Data 
  getData: function () {
    cc.CORE.NETWORK.APP.Send({
      event: "event",
      data: {
        first_deposit: {
          get_data_progress: true
        }
      }
    });
  },
  onData(data) {
    this.Progress.onData(data);
  },
  // Event
  onClick_Deposit() {
    cc.CORE.GAME_SCENCE.PlayClick();
    cc.CORE.GAME_SCENCE.Popup.Event.toggle();
    cc.CORE.GAME_SCENCE.Popup.show("payment");
  },
  onClick_Claim_Reward() {
    cc.CORE.GAME_SCENCE.PlayClick();
    cc.CORE.NETWORK.APP.Send({
      event: "event",
      data: {
        first_deposit: {
          receive_reward: true
        }
      }
    });
    this.Progress.Btn_Claim_Reward.active = false;
    // this.getData();
  },
  // update (dt) {},
});
