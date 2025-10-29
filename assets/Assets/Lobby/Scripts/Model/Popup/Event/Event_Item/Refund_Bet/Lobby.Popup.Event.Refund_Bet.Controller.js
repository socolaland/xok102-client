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


    // thống kê tuần
    weekly_game_system: {
      type: cc.Label,
      default: null
    },
    weekly_game_api: {
      type: cc.Label,
      default: null
    },
    weekly_game_lottery: {
      type: cc.Label,
      default: null
    },
    weekly_game_sport: {
      type: cc.Label,
      default: null
    },
    // tổng 
    total_game_system: {
      type: cc.Label,
      default: null
    },
    total_game_api: {
      type: cc.Label,
      default: null
    },
    total_game_lottery: {
      type: cc.Label,
      default: null
    },
    total_game_sport: {
      type: cc.Label,
      default: null
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
        refund_bonus: {
          get_data: true
        }
      }
    });
  },
  onData(data) {
    if (data?.weekly_refund_amount) {
      this.weekly_game_system.string = cc.CORE.UTIL.numberWithCommas(data.weekly_refund_amount.game_system);
      this.weekly_game_api.string = cc.CORE.UTIL.numberWithCommas(data.weekly_refund_amount.game_api);
      this.weekly_game_lottery.string = cc.CORE.UTIL.numberWithCommas(data.weekly_refund_amount.game_lottery);
      this.weekly_game_sport.string = cc.CORE.UTIL.numberWithCommas(data.weekly_refund_amount.game_sport);
    }
    if (data?.total_refund_amount) {
      this.total_game_system.string = cc.CORE.UTIL.numberWithCommas(data.total_refund_amount.game_system);
      this.total_game_api.string = cc.CORE.UTIL.numberWithCommas(data.total_refund_amount.game_api);
      this.total_game_lottery.string = cc.CORE.UTIL.numberWithCommas(data.total_refund_amount.game_lottery);
      this.total_game_sport.string = cc.CORE.UTIL.numberWithCommas(data.total_refund_amount.game_sport);
    }
  },
  // update (dt) {},
});
