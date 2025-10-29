cc.Class({
  extends: cc.Component,

  properties: {
    Line_Progress_Fill: {
      type: cc.Node,
      default: null
    },
    Line_Progress_Percent_Label: {
      type: cc.Label,
      default: null
    },
    Status_Join: {
      type: cc.Label,
      default: null
    },
    Expire_Label: {
      type: cc.Label,
      default: null
    },
    Btn_Deposit: {
      type: cc.Node,
      default: null
    },
    Btn_Claim_Reward: {
      type: cc.Node,
      default: null
    },
    Btn_Is_Receive_Reward: {
      type: cc.Node,
      default: null
    },
    Current_Deposit_Label: {
      type: cc.Label,
      default: null
    },
    Reward_Value_Label: {
      type: cc.Label,
      default: null
    },
  },

  // onLoad () {},

  onEnable() { },
  init(obj) {
    this.CORE = obj;
  },
  cleanProgress() {
    this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = 0;
    this.Line_Progress_Percent_Label.string = '0%';
    this.Status_Join.active = false;
    this.Expire_Label.active = false;
    this.Btn_Deposit.active = true;
    this.Btn_Claim_Reward.active = false;
    this.Current_Deposit_Label.string = 'Đã nạp: 0';
    this.Reward_Value_Label.string = 'Thưởng: 0';
  },
  onData(data) {
    this.Current_Deposit_Label.string = `Đã nạp: ${cc.CORE.UTIL.numberWithCommas(data.first_deposit_amount)}`;
    this.Reward_Value_Label.string = `Thưởng: ${cc.CORE.UTIL.numberWithCommas(data.reward_amount)}`;
    this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = data.percent_reached / 100;
    this.Line_Progress_Percent_Label.string = `${parseFloat(data.percent_reached).toFixed(2)}%`;

    if (data.status_join) {
      this.Status_Join.node.active = true;
      this.Status_Join.string = 'Đã tham gia';
      this.Expire_Label.node.active = true;
    } else {
      this.Status_Join.node.active = true;
      this.Status_Join.string = 'Chưa tham gia';
      this.Expire_Label.node.active = false;
    }

    if (data.is_expired) {
      this.Expire_Label.string = 'Hết hạn: Đã hết hạn';
    } else {
      this.Expire_Label.string = 'Hết hạn: ' + cc.CORE.UTIL.getStringDateByTime(data.expired_time);
    }
    // có thể nhận thưởng
    if (data.status_receive_reward) {
      // đã nhận chưa
      if (data.is_receive_reward) {
        this.Btn_Claim_Reward.active = false;
        this.Btn_Deposit.active = false;

        // đã nhận
        this.Btn_Is_Receive_Reward.active = true;
      } else {
        this.Btn_Claim_Reward.active = true;
        this.Btn_Deposit.active = false;
      }
    } else {
      this.Btn_Claim_Reward.active = false;
      this.Btn_Deposit.active = true;
    }
  },
  onClick_Deposit() {
    cc.CORE.GAME_SCENCE.PlayClick();
    this.CORE.onClick_Deposit();
  },
  onClick_Claim_Reward() {
    cc.CORE.GAME_SCENCE.PlayClick();
    this.CORE.onClick_Claim_Reward();
  },
  // update (dt) {},
});
