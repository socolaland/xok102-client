const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

const Deposit = require("Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller");
const Withdraw = require("Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller");

cc.Class({
  extends: cc.Component,

  properties: {
    headerPaymentType: cc.Node,
    bodyPaymentType: cc.Node,
    Deposit: Deposit,
    Withdraw: Withdraw,
    loadingNode: cc.Node,

    // text node
    balance: cc.Label,
    real_receive: cc.Label,
    rate_change: cc.Label,
  },

  init(obj) {
    this.CORE = obj;
    this.tabShow = "deposit";
    this.product_type = null;
    this.game_code = null;
    this.play_url = null;
  },
  onLoad() {
    this.Deposit.init(this);
    this.Withdraw.init(this);
  },
  onEnable() {
    this.getBalance();
  },
  onDisable() {
    this.reset();
  },
  toggle: function () {
    cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
      time: 0.3,
    });
  },
  reset: function () {
    this.balance.string = "0";
    this.real_receive.string = "0";
    this.Deposit.inputAmount.string = "";
    this.Withdraw.inputAmount.string = "";
  },
  onSelectHeaderPaymentType: function (event) {
    cc.CORE.GAME_SCENCE.PlayClick();
    const name = event.target.name;
    this.headerPaymentType.children.forEach((node) => {
      if (node.name == name) {
        node.getChildByName("active").active = true;
        node.getChildByName("none").active = false;
      } else {
        node.getChildByName("active").active = false;
        node.getChildByName("none").active = true;
      }
    });
    this.bodyPaymentType.children.forEach((node) => {
      node.active = node.name == name ? true : false;
    });
    this.tabShow = name.toLowerCase();

    // reset form
    this.reset();
    this.getBalance();
  },
  setDataGameApiTransferWallet: function (event, customData) {
    try {
      const data = customData.split("|");
      const product_type = data[0];
      const game_code = data[1];
      this.product_type = product_type;
      this.game_code = game_code;
    } catch (e) {
      console.log(e);
    }
  },
  getBalance: function () {
    this.loadingNode.active = true;
    HttpRequest.Post(
      `${cc.CORE.CONFIG.SERVER_API}/game-tcg/get-balance`,
      {},
      {
        product_type: this.product_type,
        game_code: this.game_code,
      },
      { Authorization: `Bearer ${LocalStorage.getItem("access_token")}` }
    )
      .then((result) => {
        this.loadingNode.active = false;
        if (result.error_code == 0) {
          if (result?.data?.balance)
            this.balance.string = result.data.balance || 0;
        } else {
          this.balance.string = "0";
          cc.CORE.GAME_SCENCE.FastNotify(
            result.error_message,
            "error",
            1,
            1,
            true
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.loadingNode.active = false;
        this.balance.string = "0";
        cc.CORE.GAME_SCENCE.FastNotify(
          "Có lỗi xảy ra, vui lòng thử lại sau!",
          "error",
          1,
          1,
          true
        );
      });
  },
  onClickDeposit: function () {
    const amount = Number(
      cc.CORE.UTIL.getOnlyNumberInString(this.Deposit.inputAmount.string)
    );
    if (amount < 1000)
      return cc.CORE.GAME_SCENCE.FastNotify(
        "Số tiền tối thiểu là 1000!",
        "info",
        1,
        1,
        true
      );

    // post
    this.loadingNode.active = true;
    HttpRequest.Post(
      `${cc.CORE.CONFIG.SERVER_API}/game-tcg/wallet-transfer`,
      {},
      {
        product_type: this.product_type,
        transfer_type: "deposit",
        amount: amount,
      },
      { Authorization: `Bearer ${LocalStorage.getItem("access_token")}` }
    )
      .then((result) => {
        this.loadingNode.active = false;
        if (result.error_code == 0) {
          cc.CORE.GAME_SCENCE.FastNotify(
            "Nạp vào thành công!",
            "success",
            1,
            1,
            true
          );
          this.getBalance();
        } else {
          cc.CORE.GAME_SCENCE.FastNotify(
            result.error_message,
            "error",
            1,
            1,
            true
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.loadingNode.active = false;
        cc.CORE.GAME_SCENCE.FastNotify(
          "Có lỗi xảy ra, vui lòng thử lại sau!",
          "error",
          1,
          1,
          true
        );
      });
  },
  onClickWithdraw: function () {
    const amount = Number(
      cc.CORE.UTIL.getOnlyNumberInString(this.Withdraw.inputAmount.string)
    );
    if (amount < 1)
      return cc.CORE.GAME_SCENCE.FastNotify(
        "Số tiền tối thiểu là 1!",
        "info",
        1,
        1,
        true
      );

    // post
    this.loadingNode.active = true;
    HttpRequest.Post(
      `${cc.CORE.CONFIG.SERVER_API}/game-tcg/wallet-transfer`,
      {},
      {
        product_type: this.product_type,
        transfer_type: "withdraw",
        amount: amount,
      },
      { Authorization: `Bearer ${LocalStorage.getItem("access_token")}` }
    )
      .then((result) => {
        this.loadingNode.active = false;
        if (result.error_code == 0) {
          cc.CORE.GAME_SCENCE.FastNotify(
            "Rút ra thành công!",
            "success",
            1,
            1,
            true
          );
          this.getBalance();
        } else {
          cc.CORE.GAME_SCENCE.FastNotify(
            result.error_message,
            "error",
            1,
            1,
            true
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.loadingNode.active = false;
        cc.CORE.GAME_SCENCE.FastNotify(
          "Có lỗi xảy ra, vui lòng thử lại sau!",
          "error",
          1,
          1,
          true
        );
      });
  },
  getPlayUrl: function () {
    // post
    this.loadingNode.active = true;
    HttpRequest.Post(
      `${cc.CORE.CONFIG.SERVER_API}/game-tcg/launch-game`,
      {},
      {
        product_type: this.product_type,
        game_code: this.game_code,
        platform: cc.CORE.UTIL.isMobile() ? "mobile" : "desktop",
      },
      { Authorization: `Bearer ${LocalStorage.getItem("access_token")}` }
    )
      .then((result) => {
        this.loadingNode.active = false;
        if (result.error_code == 0) {
          console.log(result.data.play_url);
          cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(result.data.play_url);
          cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
          // if (cc.sys.isNative) {
          //   cc.CORE.GAME_SCENCE.Popup.GameApiDirect.createOverlayIframe();
          // } else {
          //   cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
          // }
        } else {
          cc.CORE.GAME_SCENCE.FastNotify(
            result.error_message,
            "error",
            1,
            1,
            true
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.loadingNode.active = false;
        cc.CORE.GAME_SCENCE.FastNotify(
          "Có lỗi xảy ra, vui lòng thử lại sau!",
          "error",
          1,
          1,
          true
        );
      });
  },
});
