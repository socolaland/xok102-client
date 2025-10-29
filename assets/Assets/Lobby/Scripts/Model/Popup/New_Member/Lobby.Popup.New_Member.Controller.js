const LocalStorage = require("LocalStorage");

cc.Class({
  extends: cc.Component,

  properties: {
  },

  // onLoad () {},

  onEnable() {
  },
  init(obj) {
    this.CORE = obj;
  },
  toggle() {
    cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
      time: 0.3,
      // scaleFrom: 0.6,
      // scaleTo: 1,
      // easingIn: 'backOut',
      // easingOut: 'quartInOut',
      // callback: () => {
      //     this.node.active = true;
      // }
    });
  },
  setShow() {
    cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
      time: 0.3,
    });

    // const lastShowTime = LocalStorage.getItem("NEW_MEMBER_POPUP:SHOW_TIME");
    // if (!lastShowTime) {
    //   // Chưa từng hiện -> hiện ngay
    //   cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
    //     time: 0.3,
    //   });
    //   LocalStorage.setItem("NEW_MEMBER_POPUP:SHOW_TIME", Date.now());
    // } else {
    //   let now = Date.now();
    //   let elapsed = now - parseInt(lastShowTime);
    //   if (elapsed >= 12 * 60 * 60 * 1000) {
    //     cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
    //       time: 0.3,
    //     });
    //   } else {
    //     cc.CORE.UTIL.togglePopup(this.node, false, {
    //       time: 0.3,
    //     });
    //   }
    // }
  },
  comingSoon() {
    cc.CORE.GAME_SCENCE.PlayClick();
    cc.CORE.GAME_SCENCE.FastNotify("Sự kiện này sẽ sớm được ra mắt!", "info", 1);
  },
  // update (dt) {},
});
