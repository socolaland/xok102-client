cc.Class({
  extends: cc.Component,

  properties: {
    inputAmount: cc.EditBox,
  },

  init(obj) {
    this.CORE = obj;
  },
  onEnable() {
    // this.getBalance();
    this.CORE.rate_change.string = "1000 = 1 điểm";
    // console.log(this.CORE);
  },
  onConvertReceive: function () {
    const amount = Number(cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string));
    const realReceive = Math.floor(amount / 1000);
    // this.CORE.real_receive.string = cc.CORE.UTIL.numberWithCommas(realReceive);
    this.CORE.real_receive.string = realReceive.toString();
  },
  onChangerAmount: function (value = 0) {
    this.onConvertReceive();
    value = cc.CORE.UTIL.numberWithCommas(
      cc.CORE.UTIL.getOnlyNumberInString(value)
    );
    this.inputAmount.string = value == 0 ? "" : value;
    // set value input khi nhập
    cc.sys.isBrowser &&
      cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);

    this.onConvertReceive();
  },
  onCleanAmount: function () {
    cc.CORE.GAME_SCENCE.PlayClick();
    this.inputAmount.string = "";
    this.onConvertReceive();
  },
  onClickAmountSuggest: function (event) {
    cc.CORE.GAME_SCENCE.PlayClick();
    const amount = event.target.name;
    this.onChangerAmount(amount);
  },
  onClickAmountAll: function () {
    cc.CORE.GAME_SCENCE.PlayClick();
    this.onChangerAmount(cc.CORE.USER.balance.toString());
  },
});
