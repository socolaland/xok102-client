
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
  },

  // onLoad () {},

  onEnable() {
  },
  onDisable() {
  },
  init(obj) {
    this.CORE = obj;
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
  // update (dt) {},
});
 