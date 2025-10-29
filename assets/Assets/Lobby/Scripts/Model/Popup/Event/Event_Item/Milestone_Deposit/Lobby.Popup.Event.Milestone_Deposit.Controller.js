const Progress = require('Lobby.Popup.Event.Milestone_Deposit.Progress.Controller');

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
    Progress: Progress,

    // thể lệ phần mốc nạp và phần thưởng nhận được
    Rule_Reward_Container: {
      type: cc.Label,
      default: []
    },
  },

  // onLoad () {},

  onEnable() {
    this.getData();
  },
  onDisable() {
    // this.Progress.cleanProgress();
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
        milestone_deposit: {
          get_data_progress: true
        }
      }
    });
  },
  onData(data) {
    // set progress
    this.Progress.onData(data);
    // set rule reward
    cc.log(data);
    this.setRuleReward(data);
  },


  setRuleReward(data) {
    if (data?.milestones) {
      data.milestones.forEach(milestone => {
        const milestone_amount = milestone.milestone_amount;
        const rule_reward = this.Rule_Reward_Container.find(child => child.node.name == String(milestone_amount));
        if (rule_reward) {
          rule_reward.string = `${cc.CORE.UTIL.numberWithCommas(milestone.reward_amount)} VND`;
        } else {
          // this.Rule_Reward_Container.addChild(new cc.Label(milestone_amount, "Arial", 20));
        }
      });
    }
  },


  // Event
  onClick_Deposit() {
    cc.CORE.GAME_SCENCE.PlayClick();
    cc.CORE.GAME_SCENCE.Popup.Event.toggle();
    cc.CORE.GAME_SCENCE.Popup.show("payment");
  },
  onClick_Claim_Reward(milestone) {
    cc.CORE.GAME_SCENCE.PlayClick();
    cc.CORE.NETWORK.APP.Send({
      event: "event",
      data: {
        milestone_deposit: {
          receive_reward: {
            milestone_amount: Number(milestone)
          }
        }
      }
    });
    // this.getData();
  },
  // update (dt) {},
});
