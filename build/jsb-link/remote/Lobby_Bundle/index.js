window.__require = function t(e, o, n) {
function i(c, r) {
if (!o[c]) {
if (!e[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!e[s]) {
var l = "function" == typeof __require && __require;
if (!r && l) return l(s, !0);
if (a) return a(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var u = o[c] = {
exports: {}
};
e[c][0].call(u.exports, function(t) {
return i(e[c][1][t] || t);
}, u, u.exports, t, e, o, n);
}
return o[c].exports;
}
for (var a = "function" == typeof __require && __require, c = 0; c < n.length; c++) i(n[c]);
return i;
}({
"Lobby.Audio.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "0f7b3NYyVdDG5Vlaq4SRzOB", "Lobby.Audio.Controller");
cc.Class({
extends: cc.Component,
properties: {
bgMusic: {
default: null,
type: cc.AudioSource
},
click: {
default: null,
type: cc.AudioSource
},
popup_effect: {
default: null,
type: cc.AudioSource
}
},
start: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Banner.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "68834egM1JCAYMlDuf/nBUX", "Lobby.Banner.Controller");
cc.Class({
extends: cc.Component,
properties: {
pageView: cc.PageView,
bannerContent: cc.Node,
bannerItem: cc.Prefab,
paginationItem: cc.Prefab,
paginationContent: cc.Node,
slideDuration: 2
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {
this.pageIndex = 0;
this.initPagination();
this.setupAutoSlide();
if (this.bannerContent.parent) {
this.bannerContent.width = this.bannerContent.parent.width;
this.bannerContent.height = this.bannerContent.parent.height;
}
this.bannerContent.on(cc.Node.EventType.TOUCH_START, this.onBannerTouchStart, this);
this.bannerContent.on(cc.Node.EventType.TOUCH_MOVE, this.onBannerTouchMove, this);
this.bannerContent.on(cc.Node.EventType.TOUCH_END, this.onBannerTouchEnd, this);
this.bannerContent.on(cc.Node.EventType.TOUCH_CANCEL, this.onBannerTouchEnd, this);
},
initPagination: function() {
this.totalPage = this.bannerContent.children.length;
this.paginationContent.removeAllChildren();
for (var t = 0; t < this.totalPage; t++) {
var e = cc.instantiate(this.paginationItem), o = t === this.pageIndex;
e.color = cc.color().fromHEX(o ? "#FF0000" : "#FFFFFF");
e.opacity = o ? 158 : 255;
this.paginationContent.addChild(e);
}
},
updatePagination: function() {
var t = this;
this.paginationContent.children.forEach(function(e, o) {
var n = o === t.pageIndex;
e.color = cc.color().fromHEX(n ? "#FF0000" : "#FFFFFF");
e.opacity = n ? 158 : 255;
});
},
setupAutoSlide: function() {
this.unschedule(this.slideNext);
this.schedule(this.slideNext, this.slideDuration);
},
setSlide: function() {
var t = this;
try {
var e = this, o = cc.CORE.GAME_CONFIG.BANNER;
if (void 0 !== o && o.length > 0) {
this.bannerContent.removeAllChildren();
this.bannerContent.x = 0;
var n = [].concat(o, [ o[0] ]);
n.forEach(function(o, i) {
var a = cc.instantiate(t.bannerItem), c = a.getComponent("Lobby.Banner.Image.Item.Controler");
c.init(t, o);
cc.CORE.UTIL.LoadImgFromUrl(c.image, o.image, null, function() {
try {
var t = e.bannerContent.parent.width, o = e.bannerContent.parent.height;
a.width = t;
a.height = o;
a.x = i * t;
a.y = 0;
a.on(cc.Node.EventType.TOUCH_START, e.onBannerTouchStart, e);
a.on(cc.Node.EventType.TOUCH_MOVE, e.onBannerTouchMove, e);
a.on(cc.Node.EventType.TOUCH_END, e.onBannerTouchEnd, e);
a.on(cc.Node.EventType.TOUCH_CANCEL, e.onBannerTouchEnd, e);
e.bannerContent.addChild(a);
if (e.bannerContent.children.length === n.length) {
e.pageIndex = 0;
e.slideToPage(0, !0);
e.initPagination();
e.setupAutoSlide && e.setupAutoSlide();
}
} catch (t) {}
});
});
}
} catch (t) {
console.log(t);
}
},
slideNext: function() {
var t = this;
if (this.bannerContent && 0 !== this.bannerContent.children.length) {
var e = this.pageIndex + 1;
if (e >= this.bannerContent.children.length - 1) {
this.slideToPage(e, !1);
this.scheduleOnce(function() {
t.bannerContent.x = 0;
t.pageIndex = 0;
t.updatePagination();
}, .5);
} else this.slideToPage(e);
}
},
slideToPage: function(t, e) {
void 0 === e && (e = !1);
var o = -t * this.bannerContent.parent.width;
e ? this.bannerContent.x = o : cc.tween(this.bannerContent).to(.5, {
x: o
}, {
easing: "smooth"
}).start();
this.pageIndex = t;
this.updatePagination && this.updatePagination();
},
onBannerTouchStart: function(t) {
this._dragStartX = t.getLocationX();
this._startBannerX = this.bannerContent.x;
this.unschedule(this.slideNext);
},
onBannerTouchMove: function(t) {
var e = t.getLocationX() - this._dragStartX, o = -this.bannerContent.parent.width * (this.bannerContent.children.length - 1), n = this._startBannerX + e;
n = Math.max(o, Math.min(0, n));
this.bannerContent.x = n;
},
onBannerTouchEnd: function() {
var t = this, e = this.bannerContent.parent.width, o = this.bannerContent.x - -this.pageIndex * e;
Math.abs(o) > e / 4 && (o < 0 && this.pageIndex < this.bannerContent.children.length - 1 ? this.pageIndex++ : o > 0 && this.pageIndex > 0 && this.pageIndex--);
if (this.pageIndex >= this.bannerContent.children.length - 1) {
this.slideToPage(this.pageIndex, !1);
this.scheduleOnce(function() {
t.bannerContent.x = 0;
t.pageIndex = 0;
t.updatePagination();
}, .5);
} else this.slideToPage(this.pageIndex);
this.setupAutoSlide && this.setupAutoSlide();
}
});
cc._RF.pop();
}, {} ],
"Lobby.Banner.Image.Item.Controler": [ function(t, e) {
"use strict";
cc._RF.push(e, "aa64fm4G8VDtI3psQ8XFnED", "Lobby.Banner.Image.Item.Controler");
cc.Class({
extends: cc.Component,
properties: {
image: cc.Sprite
},
start: function() {},
init: function(t, e) {
this.CORE = t;
this.item = e;
},
onClickItem: function() {
cc.CORE.GAME_SCENCE.PlayClick();
null !== this.item.link && void 0 !== this.item.link && "" !== this.item.link && cc.sys.openURL(this.item.link);
}
});
cc._RF.pop();
}, {} ],
"Lobby.Banner.Pagination.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "173de/S7phPjpoM4EMWr4o7", "Lobby.Banner.Pagination.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onClick: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "8906cDsbsRGhIZ3PBAon4Wy", "Lobby.Controller");
function o() {
return (o = Object.assign ? Object.assign.bind() : function(t) {
for (var e = 1; e < arguments.length; e++) {
var o = arguments[e];
for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (t[n] = o[n]);
}
return t;
}).apply(this, arguments);
}
var n = t("LocalStorage"), i = t("AssetManager"), a = t("Lobby.Audio.Controller"), c = t("Lobby.Header.Controller"), r = t("Lobby.News.Controller"), s = t("Lobby.Menu_Game.Controller"), l = t("Lobby.Banner.Controller");
cc.Class({
extends: cc.Component,
properties: {
Audio: a,
Header: c,
MenuGame: s,
News: r,
Banner: l,
BodyMain: cc.Node,
miniNotifyPrefab: {
default: null,
type: cc.Prefab
},
prefabNode: {
default: null,
type: cc.Node
},
btn_contact: {
default: null,
type: cc.Node
},
MainWebview: cc.Node
},
start: function() {
cc.CORE.AUDIO.playMusic(this.Audio.bgMusic);
this.News.setFixedNews();
this.Banner.setSlide();
cc.CORE.TASK_REGISTRY.intervalGetUserInfo = setInterval(function() {
cc.CORE.NETWORK.APP.UTIL.GetUserInfo();
}, 5e3);
},
init: function() {
cc.CORE.GAME_SCENCE = this;
},
onEnable: function() {
cc.CORE.NETWORK.APP.UTIL.UpdateScene("LOBBY");
cc.CORE.NETWORK.APP.UTIL.GetUserInfo();
cc.CORE.NETWORK.APP.UTIL.GetCountNewInbox();
cc.CORE.GAME_ROOM.clean();
this.is_in_game_room = !1;
this.checkInGameRoom();
},
onLoad: function() {
cc.CORE.GAME_SCENCE = this;
cc.CORE.NETWORK.APP.IS_CONNECTED || cc.CORE.NETWORK.APP.Connect();
this.MenuGame.init(this);
this.Banner.init(this);
this.News.init(this);
this.InitPopupPrefab();
this.InitLoadingPrefab();
this.btn_contact.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.btn_contact.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.btn_contact.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.btn_contact.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
this.isDragging = !1;
this.touchOffset = cc.v2(0, 0);
this.isShowPopupNewMember = !1;
},
FixScreenNative: function() {
this.Header.node.setPosition(cc.v2(0, this.Header.node.position.y - 90));
this.Banner.node.setPosition(cc.v2(0, this.Banner.node.position.y - 90));
this.BodyMain.setPosition(cc.v2(0, this.BodyMain.position.y - 90));
},
checkInGameRoom: function() {
var t = n.getItem("IN_GAME_ROOM");
if (t) {
this.is_in_game_room = !0;
var e = JSON.parse(t);
cc.CORE.GAME_ROOM.GAME_CODE = e.game_code;
cc.CORE.GAME_ROOM.ROOM_CODE = e.room_code;
cc.CORE.GAME_ROOM.ROOM_PASSSWORD = e.room_password;
}
},
onData: function(t) {
if (void 0 !== t.event) switch (t.event) {
case "init_config":
this.onDataInitConfig(t.data);
break;

case "authentication":
this.onDataAuth(t.data);
break;

case "notification":
this.onDataNotify(t.data);
break;

case "user":
void 0 !== t.data.set_nickname && cc.PopupRegNickname.hidePopup();
this.onDataUser(t.data.user);
break;

case "game":
this.onDataGame(t.data);
break;

case "inbox":
void 0 !== t.data.new_inbox ? this.Header.onDataNewInbox(t.data.new_inbox) : this.Popup.Inbox.onData(t.data);
break;

case "history_bet":
this.Popup.HistoryBet.onData(t.data);
break;

case "event":
this.Popup.Event.onData(t.data);
}
},
onDataInitConfig: function(t) {
cc.CORE.GAME_CONFIG = o({}, cc.CORE.GAME_CONFIG, t);
this.News.setFixedNews();
this.Banner.setSlide();
},
onDataAuth: function(t) {
if (void 0 !== t.status) if (t.status) {
if (void 0 !== t.user) {
this.Header.onDataAuth(t.user);
cc.CORE.IS_LOGIN = !0;
cc.CORE.USER = t.user;
this.Header.setHeader();
cc.CORE.USER.nickname && null != cc.CORE.USER.nickname || this.showPopupRegNickname();
}
this.FastNotify(t.message || "Đăng nhập thành công!", "info", 1);
cc.CORE.NETWORK.APP.UTIL.GetCountNewInbox();
"dealer" == t.user.account_type && (cc.CORE.NETWORK.DEALER.IS_CONNECTED || cc.CORE.NETWORK.DEALER.Connect());
cc.CORE.NETWORK.APP.UTIL.UpdateClientIp();
} else this.FastNotify(t.message, "error");
},
onDataUser: function(t) {
cc.CORE.USER = o({}, cc.CORE.USER, t);
this.Header.onDataAuth(t);
},
onDataNotify: function(t) {
if (void 0 !== t.notify_data && void 0 !== t.notify_type) {
var e = void 0 !== t.notify_data.time ? t.notify_data.time : 1;
this.FastNotify(t.notify_data.message, t.notify_data.type, e);
}
},
onDataGame: function(t) {
if (void 0 !== t.xocdia) {
var e = t.xocdia.data;
if (void 0 !== e.join && e.join.join && e.join.room_code) {
cc.CORE.GAME_ROOM.GAME_CODE = "XOCDIA";
cc.CORE.GAME_ROOM.ROOM_CODE = e.join.room_code;
cc.CORE.GAME_ROOM.ROOM_PASSSWORD = e.join.room_password;
n.setItem("IN_GAME_ROOM", JSON.stringify({
game_code: cc.CORE.GAME_ROOM.GAME_CODE,
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
room_password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD
}));
this.MenuGame.closeDialog_Xocdia_Select_Room();
this.MenuGame.openGame(null, cc.CORE.GAME_ROOM.GAME_CODE);
}
if (void 0 !== e.join && !e.join.join) {
n.removeItem("IN_GAME_ROOM");
cc.CORE.UTIL.showLoading(0);
}
}
if (void 0 !== t.sicbo) {
var o = t.sicbo.data;
if (void 0 !== o.join && o.join.join && o.join.room_code) {
cc.CORE.GAME_ROOM.GAME_CODE = "SICBO";
cc.CORE.GAME_ROOM.ROOM_CODE = o.join.room_code;
cc.CORE.GAME_ROOM.ROOM_PASSSWORD = o.join.room_password;
n.setItem("IN_GAME_ROOM", JSON.stringify({
game_code: cc.CORE.GAME_ROOM.GAME_CODE,
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
room_password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD
}));
this.MenuGame.openGame(null, cc.CORE.GAME_ROOM.GAME_CODE);
}
if (void 0 !== o.join && !o.join.join) {
n.removeItem("IN_GAME_ROOM");
cc.CORE.UTIL.showLoading(0);
}
}
},
InitPopupPrefab: function() {
var t = this;
i.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Lobby.Popup", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
o.name = "Lobby.Popup";
var n = o.getComponent("Lobby.Popup.Controller");
t.Popup = n;
n.init(t);
t.prefabNode.addChild(o);
var i = t.prefabNode.getChildByName("Loading.Overlay");
i && cc.CORE.UTIL.setNodeZOrder.setToFront(i);
}).catch(function(t) {
return console.log("❌ Error loading prefab:", t);
});
},
InitLoadingPrefab: function() {
var t = this;
cc.CORE.UTIL.isLoadingShowing = !1;
i.loadFromBundle("Lobby_Bundle", "Prefabs/Loading/Loading.Overlay", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
o.name = "Loading.Overlay";
t.prefabNode.addChild(o);
var n = o.getChildByName("Loading_State");
cc.CORE.UTIL.showLoading = function(t, e) {
void 0 === e && (e = !1);
try {
cc.CORE.UTIL.isLoadingShowing = t;
o.active = t;
if (e && n) n.active = !0; else {
n.active = !1;
n.getChildByName("text_percent").getComponent("cc.Label").string = "0%";
}
} catch (t) {
cc.CORE.UTIL.isLoadingShowing = !1;
cc.log(t);
}
};
cc.CORE.UTIL.setLoadingPercent = function(t) {
try {
if (n) {
n.active = !0;
n.getChildByName("text_percent").getComponent("cc.Label").string = t + "%";
}
} catch (t) {
cc.log(t);
}
};
}).catch(function(t) {
return console.log("❌ Error loading prefab:", t);
});
},
showPopupRegNickname: function() {
var t = this;
i.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Auth/RegNickname/Lobby.Popup.RegNickname", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
o.name = "Lobby.Popup.RegNickname";
t.prefabNode.addChild(o);
var n = o.getComponent("Lobby.Popup.RegNickname.Controller");
cc.PopupRegNickname = n;
}).catch(function(t) {
return console.log("❌ Error loading prefab:", t);
});
},
showPopup: function(t, e) {
var o;
null != this && null != (o = this.Popup) && o.show && this.Popup.show(e);
},
showMaintance: function() {
this.FastNotify("Tính năng sẽ sớm ra mắt!", "info", 1);
},
showToggleHistory: function() {
try {
var t = cc.find("Canvas/MainGame/Header_Container/User_Container"), e = cc.find("Canvas/MainGame/Header_Container/User_Container/Menu_Action/box_history_action");
if (t && e) {
t.zIndex = 999999999;
e.active = !e.active;
}
} catch (t) {
cc.log(t);
}
},
toggleNodeWhenClick: function(t) {
var e = t.target;
e && (e.active = !e.active);
},
FastNotify: function(t, e, o, n, i) {
void 0 === t && (t = "");
void 0 === e && (e = "success");
void 0 === o && (o = 3);
void 0 === n && (n = .5);
void 0 === i && (i = !0);
if (!cc.CORE.UTIL.isLoadingShowing) {
i && this.prefabNode.children.map(function(t) {
try {
"Mini_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
var a = cc.instantiate(this.miniNotifyPrefab);
a.getComponent("Lobby.Fast_Notify.Controller").init({
text: t,
type: e,
showTime: o,
animationTime: n
});
this.prefabNode.addChild(a);
}
},
PlayClick: function() {
cc.CORE.AUDIO.playSound(this.Audio.click);
},
PlayMusic: function() {
cc.CORE.AUDIO.playMusic(this.Audio.bgMusic);
},
onClickContact: function(t, e) {
void 0 === e && (e = "TELEGRAM_GROUP");
cc.CORE.GAME_SCENCE.Popup.Contact.toggle();
},
update: function() {
this.Header.setHeader();
if (this.is_in_game_room) {
if (void 0 !== cc.CORE.UTIL.showLoading && "function" == typeof cc.CORE.UTIL.showLoading && cc.CORE.IS_LOGIN) {
this.is_in_game_room = !1;
cc.CORE.UTIL.showLoading(1);
setTimeout(function() {
var t;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: (t = {}, t[cc.CORE.GAME_ROOM.GAME_CODE.toLowerCase()] = {
join: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD
}
}, t)
});
}, 1e3);
setTimeout(function() {
cc.CORE.UTIL.showLoading(0);
}, 1e4);
}
} else if (void 0 !== cc.CORE.GAME_SCENCE.Popup && void 0 !== cc.CORE.GAME_SCENCE.Popup.NewMember && cc.CORE.IS_LOGIN && !this.isShowPopupNewMember) {
this.isShowPopupNewMember = !0;
cc.CORE.GAME_SCENCE.Popup.NewMember.setShow();
}
},
onTouchStart: function(t) {
this.isDragging = !0;
var e = t.getLocation(), o = this.btn_contact.convertToWorldSpaceAR(cc.v2(0, 0));
this.touchOffset = cc.v2(e.x - o.x, e.y - o.y);
this.btn_contact.opacity = 180;
},
onTouchMove: function(t) {
if (this.isDragging) {
var e = t.getLocation(), o = cc.v2(e.x - this.touchOffset.x, e.y - this.touchOffset.y), n = this.btn_contact.parent.convertToNodeSpaceAR(o);
this.btn_contact.setPosition(n);
}
},
onTouchEnd: function() {
if (this.isDragging) {
this.isDragging = !1;
this.btn_contact.opacity = 255;
}
},
onClickDestroyWebview: function() {
cc.CORE.SETTING.MUSIC && cc.CORE.AUDIO.playMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic);
cc.CORE.GAME_SCENCE.PlayClick();
this.MainWebview.active = !1;
try {
var t = this.MainWebview.children[1].children[0].getComponent(cc.WebView);
t.url = "";
t.stopLoading && t.stopLoading();
} catch (t) {
console.log(t);
}
}
});
cc._RF.pop();
}, {
AssetManager: void 0,
"Lobby.Audio.Controller": "Lobby.Audio.Controller",
"Lobby.Banner.Controller": "Lobby.Banner.Controller",
"Lobby.Header.Controller": "Lobby.Header.Controller",
"Lobby.Menu_Game.Controller": "Lobby.Menu_Game.Controller",
"Lobby.News.Controller": "Lobby.News.Controller",
LocalStorage: void 0
} ],
"Lobby.Dialog.Xocdia_Select_Room.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "8efcfJSSGlNoqt6Dr898RWt", "Lobby.Dialog.Xocdia_Select_Room.Controller");
cc.Class({
extends: cc.Component,
properties: {
Select_Room: cc.Node,
Enter_Info_Room: cc.Node,
RoomCode: cc.EditBox,
RoomPassword: cc.EditBox
},
init: function(t) {
this.CORE = t;
},
onEnable: function() {
this.Select_Room.active = !0;
this.Enter_Info_Room.active = !1;
},
onLoad: function() {},
openTabEnterInfoRoom: function() {
this.Select_Room.active = !1;
this.Enter_Info_Room.active = !0;
},
confirmJoinPublicRoom: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
join: {
room_code: "public_1",
password: null
}
}
}
});
this.toggle();
},
confirmJoinPrivateRoom: function() {
cc.CORE.GAME_SCENCE.PlayClick();
var t = this.RoomCode.string || null, e = this.RoomPassword.string || null;
if (!t) return cc.CORE.GAME_SCENCE.FastNotify("Mã bàn chơi không hợp lệ!", "error", null, null, !0);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
join: {
room_code: t,
password: e
}
}
}
});
},
toggle: function() {
this.node.active = !this.node.active;
}
});
cc._RF.pop();
}, {} ],
"Lobby.Fast_Notify.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "830b7fnoE1MOo98gBSbdbkK", "Lobby.Fast_Notify.Controller");
cc.Class({
extends: cc.Component,
properties: {
type: {
default: [],
type: cc.Node
},
label: cc.Label,
animationTime: 1,
showTime: 3
},
init: function(t) {
var e = {
win: cc.Color.WHITE,
success: cc.Color.WHITE,
error: cc.Color.RED,
warning: cc.Color.YELLOW,
info: cc.Color.WHITE
};
this.label.string = t.text;
this.type.map(function(e) {
e.name == t.type ? e.active = !0 : e.active = !1;
});
this.showTime = t.showTime;
this.animationTime = t.animationTime;
this.label.node.color = e[t.type];
},
onLoad: function() {
this.startNotification();
},
startNotification: function() {
var t = this;
this.node.scale = 0;
var e = cc.scaleTo(.3, 1).easing(cc.easeBackOut()), o = cc.delayTime(this.showTime || 2), n = cc.scaleTo(.3, 0).easing(cc.easeBackIn()), i = cc.callFunc(function() {
if (cc.isValid(t.node)) try {
t.node.destroy();
} catch (t) {
console.log(t);
}
}), a = cc.sequence(e, o, n, i);
this.node.runAction(a);
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Header.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "cbd44r+UNNDt6n+Iw6aE95r", "Lobby.Header.Controller");
var o = t("Lobby.Header_User.Controller");
cc.Class({
extends: cc.Component,
properties: {
Node_Header_Guest: cc.Node,
Node_Header_User: cc.Node,
Header_User: o,
Header_NewInbox: cc.Node
},
init: function() {},
onLoad: function() {},
onDataAuth: function(t) {
this.Header_User.onData(t);
},
onDataNewInbox: function(t) {
this.Header_NewInbox.active = t > 0;
},
setHeader: function() {
if (cc.CORE.IS_LOGIN) {
this.Node_Header_Guest.active = !1;
this.Node_Header_User.active = !0;
} else {
this.Node_Header_Guest.active = !0;
this.Node_Header_User.active = !1;
this.Header_NewInbox.active = !1;
}
}
});
cc._RF.pop();
}, {
"Lobby.Header_User.Controller": "Lobby.Header_User.Controller"
} ],
"Lobby.Header_User.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "7cd26rP0xNJ7oaKLhngc7bZ", "Lobby.Header_User.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
Avatar: cc.Sprite,
Username: cc.Label,
Balance: cc.Label
},
init: function() {},
onLoad: function() {},
onData: function(t) {
if (t) {
void 0 !== t.nickname && null != t.nickname ? this.Username.string = t.nickname.toUpperCase() : void 0 !== t.username && (this.Username.string = t.username.toUpperCase());
void 0 !== t.balance && (t.balance.toString().length >= 9 ? this.Balance.string = cc.CORE.UTIL.abbreviateNumber(t.balance, 2) : this.Balance.string = cc.CORE.UTIL.numberWithCommas(t.balance));
}
},
update: function() {
if (cc.CORE.IS_LOGIN) {
var t;
if (null != (t = cc.CORE.USER) && t.avatar) {
var e;
o.setAvatarToSprite(this.Avatar, null == (e = cc.CORE.USER) ? void 0 : e.avatar).then(function() {}).catch(function(t) {
console.error("Failed to set player avatar:", t);
});
}
}
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Menu_Game.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "8809avR0SlCPp8kc4Ku9/vX", "Lobby.Menu_Game.Controller");
var o = t("HttpRequest"), n = t("LocalStorage"), i = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
XocdiaSelectRoomPrefab: cc.Prefab,
maskView: cc.Node
},
init: function(t) {
this.CORE = t;
},
onResize: function() {
try {
var t = cc.view.getVisibleSize().height, e = this.maskView.getContentSize();
this.maskView.setContentSize(e.width, t - 600 - 0);
} catch (t) {
cc.log(t);
}
},
onEnable: function() {
window.addEventListener("resize", this.onResize.bind(this));
this.onResize();
},
showDialog_Xocdia_Select_Room: function() {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
var t = cc.instantiate(this.XocdiaSelectRoomPrefab);
t.getComponent("Lobby.Dialog.Xocdia_Select_Room.Controller").init(this);
this.CORE.prefabNode.addChild(t);
},
closeDialog_Xocdia_Select_Room: function() {
try {
this.CORE.prefabNode.getChildByName("Lobby.Dialog.Xocdia_Select_Room").getComponent("Lobby.Dialog.Xocdia_Select_Room.Controller").node.destroy();
} catch (t) {}
},
onMaintanace: function() {
return cc.CORE.GAME_SCENCE.FastNotify("Trò chơi đang trong quá trình phát triển!", "info", 1);
},
regEventJoinGame: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
switch (e) {
case "SICBO":
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
join: {
room_code: "public_1",
password: null
}
}
}
});
}
},
openGame: function(e, o) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
var n = t("GameLoad.Controller").GetGameOpen(o);
cc.log(n);
if (null !== n.resource_bundle) {
cc.CORE.UTIL.showLoading(1);
if (n.resource_bundle.length > 0) i.loadMultipleBundlesWithAssetProgress(n.resource_bundle, function(t) {
cc.CORE.UTIL.setLoadingPercent(Number(t));
}).then(function() {
console.log("🎉 Load xong tất cả asset trong các bundle!");
void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo && clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
cc.director.loadScene(n.resource_name);
}); else if (1 == n.resource_bundle.length) {
var a = 0;
cc.assetManager.loadBundle(n.resource_bundle, function(t, e) {
var o = Math.round(100 * t / e);
o > a && (a = o);
}, function(t) {
if (t) cc.log(t); else if (n.resource_type) {
var e = 0;
cc.director.preloadScene(n.resource_name, function(t, o) {
var n = Math.round(100 * t / o);
n > e && (e = n);
}, function(t) {
if (t) cc.log(t); else {
cc.CORE.UTIL.showLoading(0);
void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo && clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
cc.director.loadScene(n.resource_name);
}
});
}
});
}
}
},
lauchGameApi: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
var i = e;
if (!i) return cc.CORE.GAME_SCENCE.FastNotify("Trò chơi không hợp lệ!", "error", 1, 1, !0);
var a = i.split("|");
if (2 !== a.length) return cc.CORE.GAME_SCENCE.FastNotify("Trò chơi không hợp lệ!", "error", 1, 1, !0);
var c = a[0], r = a[1];
cc.CORE.UTIL.showLoading(1);
var s = {
game_code: r,
product_type: c
};
o.Post(cc.CORE.CONFIG.SERVER_API + "/game-api/launch-game", {}, s, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(t) {
if (0 == t.error_code) {
cc.log("result", t);
if (void 0 !== t.data && void 0 !== t.data.code && 200 == t.data.code) if ("" !== t.data.content) o.Post(cc.CORE.CONFIG.SERVER_API + "/game-api/host-game", {}, {
data: t.data.content
}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(t) {
cc.log("result", t);
if (0 == t.error_code) {
cc.log("result.url", t.url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(t.url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
} else cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
}); else if (void 0 !== t.data.url) {
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(t.data.url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
} else {
cc.log("result", t.data);
cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
} else {
cc.log("result", t);
cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
}
} else cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
cc.CORE.UTIL.showLoading(0);
}).catch(function(t) {
console.log(t);
cc.CORE.UTIL.showLoading(0);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
setTitleGameApi: function(t, e) {
void 0 === e && (e = "");
cc.CORE.GAME_SCENCE.Popup.GameApi.title.string = e.toUpperCase();
},
showGameApiList_Slot: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(e, "SLOT");
cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
},
showGameApiList_Casino: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(e, "LIVE_CASINO,LIVE_CASINO_PREMIUM");
cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
},
showGameApiList_Sport: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(e, "SPORT_BOOK");
cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
},
showGameApiList_Lottery: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(e, "LOTTERY");
cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
},
showGameApiList_Fishing: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(e, "FISHING");
cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
},
showGameApiList_Other: function(t, e) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(e, "OTHER");
cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
},
showPopupGameApiTransferWallet: function(t, e) {
cc.CORE.GAME_SCENCE.Popup.GameApiTransferWallet.setDataGameApiTransferWallet(t, e);
cc.CORE.GAME_SCENCE.Popup.show("game_api_transfer_wallet");
}
});
cc._RF.pop();
}, {
AssetManager: void 0,
"GameLoad.Controller": void 0,
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Menu_Tab.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "b0ae6MpzpNDW5+BODiEvllT", "Lobby.Menu_Tab.Controller");
cc.Class({
extends: cc.Component,
properties: {
tab_select_container: {
default: null,
type: cc.Node
},
scrollViewContent: {
default: null,
type: cc.ScrollView
}
},
onLoad: function() {
var t = this;
this.category_name = [ "Tab_Hot", "Tab_Live_Casino", "Tab_Lottery", "Tab_Sport", "Tab_SLot", "Tab_Fish" ];
this.category_offset = [ 0, 635, 1928.7229199845694, 2599.4223490395125, 3275.984964665731, 5393.610708400109 ];
this.category_offset_click_tab = [ 0, 820.3489337150303, 2190.078034103539, 3003.089499569084, 3825.3371746806934, 6083.176044819049 ];
this.tab_select_container.children.forEach(function(e, o) {
e.on(cc.Node.EventType.TOUCH_END, function() {
return t.activeTab({
target: {
name: t.category_name[o]
}
}, o);
}, t);
});
this.scrollViewContent.node.on("scrolling", function() {
for (var e = t.scrollViewContent.content.y, o = 0; o < t.category_offset.length; o++) if (e < t.category_offset[o + 1] || o === t.category_offset.length - 1) {
t.changerTab({
target: {
name: t.category_name[o]
}
});
break;
}
});
},
changerTab: function(t, e) {
void 0 === e && (e = null);
var o = t.target.name;
this.tab_select_container.children.forEach(function(t) {
if (t.name == o) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
t.getChildByName("arrow").active = !0;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
t.getChildByName("arrow").active = !1;
}
});
null !== e && this.scrollToTab(e, !0);
},
activeTab: function(t) {
this.scroll_with_manual = !1;
var e = t.target.name, o = null;
this.tab_select_container.children.forEach(function(t, n) {
if (t.name == e) {
o = n;
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
t.getChildByName("arrow").active = !0;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
t.getChildByName("arrow").active = !1;
}
});
null !== o && this.scrollToTab(o, !1);
},
scrollToTab: function(t, e) {
void 0 === e && (e = !1);
var o = e ? this.category_offset[t] : this.category_offset_click_tab[t];
this.scrollViewContent.scrollToOffset(cc.v2(0, o), .5);
},
clickGameScrollToTab: function(t, e, o) {
void 0 === o && (o = !1);
var n = o ? this.category_offset[Number(e)] : this.category_offset_click_tab[Number(e)];
this.scrollViewContent.scrollToOffset(cc.v2(0, n), .5);
}
});
cc._RF.pop();
}, {} ],
"Lobby.News.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "66abeUieLNIlYTqap0key1d", "Lobby.News.Controller");
t("Helper");
cc.Class({
extends: cc.Component,
properties: {
prefabItem: cc.Prefab,
speed: 90
},
init: function(t) {
this.CORE = t;
this.totalWidth = 0;
this.fixedNewsMessage = [];
},
update: function(t) {
this.node.position = cc.v2(this.node.position.x - this.speed * t, 0);
if (this.node.children.length > 0) {
var e = this.node.children[this.node.children.length - 1];
e.x + this.node.x < -e.width - 350 && this.reset();
}
},
onEnable: function() {},
setFixedNews: function() {
this.setNews();
void 0 !== cc.CORE.GAME_CONFIG.NEWS && this.NewsAddArray(cc.CORE.GAME_CONFIG.NEWS);
},
setNews: function() {
this.node.active = !0;
this.node.position = cc.v2(390, 0);
},
reset: function() {
try {
this.node.destroyAllChildren();
this.node.position = cc.v2(0, 0);
this.setFixedNews();
} catch (t) {}
},
onLoad: function() {
var t = this;
setInterval(function() {
t.reset();
}, 18e4);
},
NewsAddItem: function(t) {
var e = cc.instantiate(this.prefabItem);
(e = e.getComponent(cc.RichText)).string = t;
this.node.addChild(e.node);
this.node.active || this.setNews();
},
NewsAddArray: function(t) {
var e = this;
t.forEach(function(t) {
e.NewsAddItem(t);
});
}
});
cc._RF.pop();
}, {
Helper: void 0
} ],
"Lobby.Popup.ChangeAvatar.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "67f15SlGQ5BTKw6wo33jbeG", "Lobby.Popup.ChangeAvatar.Controller");
cc.Class({
extends: cc.Component,
properties: {
content: {
default: null,
type: cc.Node
},
avatarItemPrefab: {
default: null,
type: cc.Prefab
}
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {
this.content.removeAllChildren();
this.loadAvatarList();
},
onDisable: function() {
this.content.removeAllChildren();
},
onChangeAvatar: function(t) {
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.NETWORK.APP.Send({
event: "user",
data: {
set_avatar: t
}
});
},
loadAvatarList: function() {
var t = this;
cc.assetManager.loadBundle("Common_Bundle", function(e, o) {
e ? console.error("Lỗi khi tải bundle:", e) : o.loadDir("Images/Avatar", cc.SpriteFrame, function(e, o) {
if (e) console.error("Lỗi khi tải tất cả avatar từ thư mục:", e); else {
o.sort(function(t, e) {
return parseInt(t.name) - parseInt(e.name);
});
o.forEach(function(e) {
var o = e.name, n = cc.instantiate(t.avatarItemPrefab);
t.content.addChild(n);
var i = n.getComponent(cc.Sprite);
i ? i.spriteFrame = e : console.warn("Prefab avatarItemPrefab không có component cc.Sprite!");
n.name = "" + o;
var a = n.getComponent("Lobby.Popup.ChangeAvatar.Item.Controller");
a.init(t);
a && a.setAvatarId ? a.setAvatarId(o) : console.warn("Không tìm thấy script Lobby.Popup.ChangeAvatar.Item.Controller hoặc hàm setAvatarId trên Prefab!");
});
}
});
});
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.ChangeAvatar.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "303adZJ31xPKbln4wEXlqWp", "Lobby.Popup.ChangeAvatar.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
avatar: {
default: null,
type: cc.Sprite
}
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {},
setAvatarId: function() {},
onChangerClick: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.CORE.onChangeAvatar(e);
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.ChangePwd.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "a5fa9rQWO9KLrEPdin5lA2I", "Lobby.Popup.ChangePwd.Controller");
var o = t("HttpRequest"), n = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
OldPassword: {
default: null,
type: cc.EditBox
},
NewPassword: {
default: null,
type: cc.EditBox
},
ReNewPassword: {
default: null,
type: cc.EditBox
},
inputOtp: cc.EditBox
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {
this.clear();
},
onDisable: function() {},
clear: function() {
this.OldPassword.string = this.NewPassword.string = this.ReNewPassword.string = this.inputOtp.string = "";
},
onChangerClick: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (this.OldPassword.string.length < 5 || this.OldPassword.string.length > 30 || this.NewPassword.string.length < 5 || this.NewPassword.string.length > 30 || this.ReNewPassword.string.length < 5 || this.ReNewPassword.string.length > 30) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu từ 5 tới 30 ký tự!", "error", 1, 1, !0);
if (this.OldPassword.string == this.NewPassword.string) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu mới không trùng với mật khẩu cũ!", "error", 1, 1, !0);
if (this.NewPassword.string != this.ReNewPassword.string) return cc.CORE.GAME_SCENCE.FastNotify("Nhập lại mật khẩu mới không khớp!", "error", 1, 1, !0);
if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, !0);
o.Post(cc.CORE.CONFIG.SERVER_API + "/auth/change-password", {}, {
password: this.OldPassword.string,
new_password: this.NewPassword.string,
otp: this.inputOtp.string
}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
t.toggle();
cc.CORE.GAME_SCENCE.FastNotify("Đổi mật khẩu thành công!", "success", 1, 1, !0);
var o = e.data, i = o.access_token, a = o.refresh_token;
n.setItem("access_token", i);
n.setItem("refresh_token", a);
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
clickGetOtp: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.NETWORK.APP.Send({
event: "security",
data: {
get_otp: {
action: "change_password"
}
}
});
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Contact.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "a18645qXVNJnJotjVWKj0j5", "Lobby.Popup.Contact.Controller");
cc.Class({
extends: cc.Component,
properties: {},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
onClick: function(t, e) {
cc.CORE.GAME_SCENCE.PlayClick();
var o = e, n = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[o];
cc.log(n, o);
if (n && "" !== n && null !== n) cc.sys.openURL(n); else {
cc.log("Không lấy được địa chỉ!");
cc.CORE.GAME_SCENCE.FastNotify(n ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
}
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "3702aKTn7VAW5SCPmF2Lo73", "Lobby.Popup.Controller");
var o = t("AssetManager"), n = t("Lobby.Popup.SignIn.Controller"), i = t("Lobby.Popup.SignUp.Controller"), a = t("Lobby.Popup.SignOut.Controller"), c = t("Lobby.Popup.Transfer.Controller"), r = t("Lobby.Popup.Verify_Phone.Controller"), s = t("Lobby.Popup.Profile.Controller"), l = t("Lobby.Popup.ChangeAvatar.Controller"), u = t("Lobby.Popup.ForgotPwd.Controller"), C = t("Lobby.Popup.History_Bet.Controller"), h = t("Lobby.Popup.History_Finan.Controller"), p = t("Lobby.Popup.Inbox.Controller"), _ = t("Lobby.Popup.Setting.Controller"), d = t("Lobby.Popup.Contact.Controller"), E = t("Lobby.Popup.ChangePwd.Controller"), f = t("Lobby.Popup.Payment.Controller"), g = t("Lobby.Popup.History_Transfer.Controller"), b = t("Lobby.Popup.History_Tip.Controller"), m = t("Lobby.Popup.GameApi.Controller"), y = t("Lobby.Popup.GameApi.Direct.Controller"), R = t("Lobby.Popup.GameApi.TransferWallet.Controller"), v = t("Lobby.Popup.New_Member.Controller");
cc.Class({
extends: cc.Component,
properties: {
SignIn: n,
SignUp: i,
SignOut: a,
Transfer: c,
VerifyPhone: r,
Profile: s,
ChangeAvatar: l,
ForgotPwd: u,
HistoryBet: C,
HistoryFinan: h,
Inbox: p,
Setting: _,
Contact: d,
ChangePwd: E,
Payment: f,
HistoryTransfer: g,
HistoryTip: b,
GameApi: m,
GameApiDirect: y,
GameApiTransferWallet: R,
Event: {
type: cc.Prefab,
default: null
},
NewMember: v
},
init: function(t) {
this.CORE = t;
this.SignIn.init(this);
this.SignUp.init(this);
this.Transfer.init(this);
this.VerifyPhone.init(this);
this.Profile.init(this);
this.ChangeAvatar.init(this);
this.ForgotPwd.init(this);
this.HistoryBet.init(this);
this.HistoryFinan.init(this);
this.Inbox.init(this);
this.Setting.init(this);
this.Contact.init(this);
this.ChangePwd.init(this);
this.Payment.init(this);
this.HistoryTransfer.init(this);
this.HistoryTip.init(this);
this.GameApi.init(this);
this.GameApiDirect.init(this);
this.NewMember.init(this);
this.GameApiTransferWallet.init(this);
},
onLoad: function() {},
show: function(t, e) {
void 0 === e && (e = null);
switch (e || t) {
case "signin":
this.SignIn.toggle();
break;

case "signup":
this.SignUp.toggle();
break;

case "signout":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.SignOut.toggle();
break;

case "forgot_pwd":
this.ForgotPwd.toggle();
break;

case "transfer":
return cc.CORE.IS_LOGIN ? cc.CORE.GAME_SCENCE.FastNotify("Chức năng chỉ dành cho đại lý!", "error", 1, 1, !0) : this.show("signin");

case "verify_phone":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.VerifyPhone.toggle();
break;

case "profile":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.Profile.toggle();
break;

case "change_avatar":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.ChangeAvatar.toggle();
break;

case "history_bet":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.HistoryBet.toggle();
break;

case "history_finan":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.HistoryFinan.toggle();
break;

case "inbox":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.Inbox.toggle();
break;

case "setting":
this.Setting.toggle();
break;

case "contact":
this.Contact.toggle();
break;

case "change_password":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.ChangePwd.toggle();
break;

case "payment":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.Payment.toggle();
break;

case "history_transfer":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.HistoryTransfer.toggle();
break;

case "history_tip":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.HistoryTip.toggle();
break;

case "game_api":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.GameApi.toggle();
break;

case "game_api_direct":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.GameApiDirect.toggle();
break;

case "game_api_transfer_wallet":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.GameApiTransferWallet.toggle();
break;

case "event":
if (!cc.CORE.IS_LOGIN) return this.show("signin");
this.Event_toggle();
break;

case "new_member":
this.NewMember.toggle();
}
},
onClickContact: function(t, e) {
void 0 === e && (e = "TELEGRAM_GROUP");
var o = e, n = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[o];
n && "" !== n && null !== n ? cc.sys.openURL(n) : this.FastNotify(n ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
},
Event_toggle: function() {
var t = this;
cc.CORE.UTIL.showLoading(1);
o.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Event/Lobby.Popup.Event", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
o.active = !1;
o.name = "Lobby.Popup.Event";
var n = o.getComponent("Lobby.Popup.Event.Controller");
t.Event = n;
n.init(t);
t.node.addChild(o);
cc.CORE.UTIL.togglePopup(o, !o.active, {
time: .3,
callback: function() {}
});
cc.CORE.UTIL.showLoading(0);
}).catch(function(t) {
return console.error("❌ Error loading prefab:", t);
});
},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0,
"Lobby.Popup.ChangeAvatar.Controller": "Lobby.Popup.ChangeAvatar.Controller",
"Lobby.Popup.ChangePwd.Controller": "Lobby.Popup.ChangePwd.Controller",
"Lobby.Popup.Contact.Controller": "Lobby.Popup.Contact.Controller",
"Lobby.Popup.ForgotPwd.Controller": "Lobby.Popup.ForgotPwd.Controller",
"Lobby.Popup.GameApi.Controller": "Lobby.Popup.GameApi.Controller",
"Lobby.Popup.GameApi.Direct.Controller": "Lobby.Popup.GameApi.Direct.Controller",
"Lobby.Popup.GameApi.TransferWallet.Controller": "Lobby.Popup.GameApi.TransferWallet.Controller",
"Lobby.Popup.History_Bet.Controller": "Lobby.Popup.History_Bet.Controller",
"Lobby.Popup.History_Finan.Controller": "Lobby.Popup.History_Finan.Controller",
"Lobby.Popup.History_Tip.Controller": "Lobby.Popup.History_Tip.Controller",
"Lobby.Popup.History_Transfer.Controller": "Lobby.Popup.History_Transfer.Controller",
"Lobby.Popup.Inbox.Controller": "Lobby.Popup.Inbox.Controller",
"Lobby.Popup.New_Member.Controller": "Lobby.Popup.New_Member.Controller",
"Lobby.Popup.Payment.Controller": "Lobby.Popup.Payment.Controller",
"Lobby.Popup.Profile.Controller": "Lobby.Popup.Profile.Controller",
"Lobby.Popup.Setting.Controller": "Lobby.Popup.Setting.Controller",
"Lobby.Popup.SignIn.Controller": "Lobby.Popup.SignIn.Controller",
"Lobby.Popup.SignOut.Controller": "Lobby.Popup.SignOut.Controller",
"Lobby.Popup.SignUp.Controller": "Lobby.Popup.SignUp.Controller",
"Lobby.Popup.Transfer.Controller": "Lobby.Popup.Transfer.Controller",
"Lobby.Popup.Verify_Phone.Controller": "Lobby.Popup.Verify_Phone.Controller"
} ],
"Lobby.Popup.Event.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "c44d9pl1jRHBJ59lEWOYQgV", "Lobby.Popup.Event.Controller");
var o = t("Lobby.Popup.Event.First_Deposit.Controller"), n = t("Lobby.Popup.Event.Milestone_Deposit.Controller"), i = t("Lobby.Popup.Event.Refund_Bet.Controller"), a = t("Lobby.Popup.Event.New_Member.Controller");
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
Event_First_Deposit: o,
Event_Milestone_Deposit: n,
Event_Refund_Bet: i,
Event_New_Member: a
},
onEnable: function() {
this.Event_List_Container.active = !0;
this.Event_Body_Container.active = !1;
},
init: function(t) {
this.CORE = t;
this.Event_First_Deposit.init(this);
this.Event_Milestone_Deposit.init(this);
this.Event_Refund_Bet.init(this);
this.Event_New_Member.init(this);
},
toggle: function() {
var t = this;
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3,
scaleFrom: .6,
scaleTo: 1,
easingIn: "backOut",
easingOut: "quartInOut",
callback: function() {
t.Event_List_Container.active = !0;
t.Event_Body_Container.active = !1;
}
});
},
comingSoon: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.GAME_SCENCE.FastNotify("Sự kiện này sẽ sớm được ra mắt!", "info", 1);
},
showEventBody: function(t, e) {
if (e) {
cc.CORE.GAME_SCENCE.PlayClick();
this.Event_List_Container.active = !1;
this.Event_Body_Container.children.forEach(function(t) {
var o = t.name == e;
t.active = !!o;
});
this.Event_Body_Container.active = !0;
}
},
showEventList: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.Event_List_Container.active = !0;
this.Event_Body_Container.active = !1;
},
onData: function(t) {
null != t && t.first_deposit && this.Event_First_Deposit.onData(t.first_deposit);
null != t && t.milestone_deposit && this.Event_Milestone_Deposit.onData(t.milestone_deposit);
null != t && t.refund_bonus && this.Event_Refund_Bet.onData(t.refund_bonus);
}
});
cc._RF.pop();
}, {
"Lobby.Popup.Event.First_Deposit.Controller": "Lobby.Popup.Event.First_Deposit.Controller",
"Lobby.Popup.Event.Milestone_Deposit.Controller": "Lobby.Popup.Event.Milestone_Deposit.Controller",
"Lobby.Popup.Event.New_Member.Controller": "Lobby.Popup.Event.New_Member.Controller",
"Lobby.Popup.Event.Refund_Bet.Controller": "Lobby.Popup.Event.Refund_Bet.Controller"
} ],
"Lobby.Popup.Event.First_Deposit.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "1025bHCoQ5M47VnKFnLIcSz", "Lobby.Popup.Event.First_Deposit.Controller");
var o = t("Lobby.Popup.Event.First_Deposit.Progress.Controller");
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
Progress: o
},
onEnable: function() {
this.getData();
},
onDisable: function() {
this.Progress.cleanProgress();
},
init: function(t) {
this.CORE = t;
this.Progress.init(this);
this.getData();
},
header_Body_Select: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.Event_Header_Container.children.forEach(function(t) {
if (t.name == e) {
t.children[0].active = !0;
t.children[1].active = !1;
} else {
t.children[0].active = !1;
t.children[1].active = !0;
}
});
this.Event_Body_Container.children.forEach(function(t) {
var o = t.name == e;
t.active = !!o;
});
},
getData: function() {
cc.CORE.NETWORK.APP.Send({
event: "event",
data: {
first_deposit: {
get_data_progress: !0
}
}
});
},
onData: function(t) {
this.Progress.onData(t);
},
onClick_Deposit: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.GAME_SCENCE.Popup.Event.toggle();
cc.CORE.GAME_SCENCE.Popup.show("payment");
},
onClick_Claim_Reward: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.NETWORK.APP.Send({
event: "event",
data: {
first_deposit: {
receive_reward: !0
}
}
});
this.Progress.Btn_Claim_Reward.active = !1;
}
});
cc._RF.pop();
}, {
"Lobby.Popup.Event.First_Deposit.Progress.Controller": "Lobby.Popup.Event.First_Deposit.Progress.Controller"
} ],
"Lobby.Popup.Event.First_Deposit.Progress.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "6af0ag/1ohAvJ/n4pyP514d", "Lobby.Popup.Event.First_Deposit.Progress.Controller");
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
}
},
onEnable: function() {},
init: function(t) {
this.CORE = t;
},
cleanProgress: function() {
this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = 0;
this.Line_Progress_Percent_Label.string = "0%";
this.Status_Join.active = !1;
this.Expire_Label.active = !1;
this.Btn_Deposit.active = !0;
this.Btn_Claim_Reward.active = !1;
this.Current_Deposit_Label.string = "Đã nạp: 0";
this.Reward_Value_Label.string = "Thưởng: 0";
},
onData: function(t) {
this.Current_Deposit_Label.string = "Đã nạp: " + cc.CORE.UTIL.numberWithCommas(t.first_deposit_amount);
this.Reward_Value_Label.string = "Thưởng: " + cc.CORE.UTIL.numberWithCommas(t.reward_amount);
this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = t.percent_reached / 100;
this.Line_Progress_Percent_Label.string = parseFloat(t.percent_reached).toFixed(2) + "%";
if (t.status_join) {
this.Status_Join.node.active = !0;
this.Status_Join.string = "Đã tham gia";
this.Expire_Label.node.active = !0;
} else {
this.Status_Join.node.active = !0;
this.Status_Join.string = "Chưa tham gia";
this.Expire_Label.node.active = !1;
}
t.is_expired ? this.Expire_Label.string = "Hết hạn: Đã hết hạn" : this.Expire_Label.string = "Hết hạn: " + cc.CORE.UTIL.getStringDateByTime(t.expired_time);
if (t.status_receive_reward) if (t.is_receive_reward) {
this.Btn_Claim_Reward.active = !1;
this.Btn_Deposit.active = !1;
this.Btn_Is_Receive_Reward.active = !0;
} else {
this.Btn_Claim_Reward.active = !0;
this.Btn_Deposit.active = !1;
} else {
this.Btn_Claim_Reward.active = !1;
this.Btn_Deposit.active = !0;
}
},
onClick_Deposit: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClick_Deposit();
},
onClick_Claim_Reward: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClick_Claim_Reward();
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Event.Milestone_Deposit.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "f8438TxUYpPDYGbb6wVG3rw", "Lobby.Popup.Event.Milestone_Deposit.Controller");
var o = t("Lobby.Popup.Event.Milestone_Deposit.Progress.Controller");
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
Progress: o,
Rule_Reward_Container: {
type: cc.Label,
default: []
}
},
onEnable: function() {
this.getData();
},
onDisable: function() {},
init: function(t) {
this.CORE = t;
this.Progress.init(this);
this.getData();
},
header_Body_Select: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.Event_Header_Container.children.forEach(function(t) {
if (t.name == e) {
t.children[0].active = !0;
t.children[1].active = !1;
} else {
t.children[0].active = !1;
t.children[1].active = !0;
}
});
this.Event_Body_Container.children.forEach(function(t) {
var o = t.name == e;
t.active = !!o;
});
},
getData: function() {
cc.CORE.NETWORK.APP.Send({
event: "event",
data: {
milestone_deposit: {
get_data_progress: !0
}
}
});
},
onData: function(t) {
this.Progress.onData(t);
cc.log(t);
this.setRuleReward(t);
},
setRuleReward: function(t) {
var e = this;
null != t && t.milestones && t.milestones.forEach(function(t) {
var o = t.milestone_amount, n = e.Rule_Reward_Container.find(function(t) {
return t.node.name == String(o);
});
n && (n.string = cc.CORE.UTIL.numberWithCommas(t.reward_amount) + " VND");
});
},
onClick_Deposit: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.GAME_SCENCE.Popup.Event.toggle();
cc.CORE.GAME_SCENCE.Popup.show("payment");
},
onClick_Claim_Reward: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.NETWORK.APP.Send({
event: "event",
data: {
milestone_deposit: {
receive_reward: {
milestone_amount: Number(t)
}
}
}
});
}
});
cc._RF.pop();
}, {
"Lobby.Popup.Event.Milestone_Deposit.Progress.Controller": "Lobby.Popup.Event.Milestone_Deposit.Progress.Controller"
} ],
"Lobby.Popup.Event.Milestone_Deposit.Progress.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "43bf8MYtxlG8rCDwaPtZv44", "Lobby.Popup.Event.Milestone_Deposit.Progress.Controller");
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
Total_Deposit_Amount_Label: {
type: cc.Label,
default: null
},
Current_Milestone_Label: {
type: cc.Label,
default: null
},
Current_Milestone_Reward_Label: {
type: cc.Label,
default: null
},
Chest_Container: {
type: cc.Node,
default: null
},
Rule_Reward_Container: {
type: cc.Label,
default: []
},
Status_Reward_Container: {
type: cc.Node,
default: null
},
Btn_Claim_Reward_Container: {
type: cc.Node,
default: null
}
},
onEnable: function() {},
init: function(t) {
this.CORE = t;
this.total_betting_amount = 0;
},
cleanProgress: function() {
this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = 0;
this.Line_Progress_Percent_Label.string = "0%";
this.Status_Join.active = !1;
this.Btn_Deposit.active = !0;
this.Btn_Claim_Reward.active = !1;
this.Total_Deposit_Amount_Label.string = "Đã nạp: 0";
this.Reward_Value_Label.string = "Thưởng: 0";
},
getMilestoneByName: function(t, e) {
if (!Array.isArray(t)) return null;
for (var o = 0; o < t.length; o++) if (t[o].milestone_amount == e) return t[o];
return null;
},
onData: function(t) {
this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = t.percent_reached / 100;
this.Line_Progress_Percent_Label.string = t.percent_reached.toFixed(2) + "%";
this.total_betting_amount = t.total_betting_amount;
this.Total_Deposit_Amount_Label.string = "Đã nạp: " + cc.CORE.UTIL.abbreviateNumber_2(t.total_deposit_amount);
this.Current_Milestone_Label.string = "Mốc hiện tại: " + cc.CORE.UTIL.abbreviateNumber_2(t.current_milestone);
0 == t.current_milestone ? this.Current_Milestone_Reward_Label.string = "Thưởng: " + cc.CORE.UTIL.abbreviateNumber_2(0) : this.Current_Milestone_Reward_Label.string = "Thưởng: " + cc.CORE.UTIL.numberWithCommas(this.getMilestoneByName(t.milestones, t.current_milestone).reward_amount);
this.renderChests(t);
this.SetStatusReward(t);
this.setRuleReward(t);
},
setRuleReward: function(t) {
var e = this;
null != t && t.milestones && t.milestones.forEach(function(t) {
var o = t.milestone_amount, n = e.Rule_Reward_Container.find(function(t) {
return t.node.name == String(o);
});
n && (n.string = cc.CORE.UTIL.numberWithCommas(t.reward_amount) + " VND");
});
},
SetStatusReward: function(t) {
var e = this;
null != t && t.milestones && t.milestones.forEach(function(o) {
var n = t.total_deposit_amount >= o.milestone_amount, i = t.total_betting_amount >= o.required_betting_amount, a = n && i;
if (o.is_received) {
e.Btn_Claim_Reward_Container.getChildByName(String(o.milestone_amount)).active = !1;
e.Status_Reward_Container.getChildByName(String(o.milestone_amount)).getComponent(cc.Label).node.active = !0;
e.Status_Reward_Container.getChildByName(String(o.milestone_amount)).getComponent(cc.Label).string = "Đã nhận thưởng";
e.Status_Reward_Container.getChildByName(String(o.milestone_amount)).getComponent(cc.Label).node.color = new cc.Color().fromHEX("#29FF00");
} else if (a) {
var c = e.Btn_Claim_Reward_Container.getChildByName(String(o.milestone_amount)), r = e.Status_Reward_Container.getChildByName(String(o.milestone_amount)).getComponent(cc.Label);
if (c) {
c.active = !0;
r.string = "";
r.node.active = !1;
} else {
cc.log("Không tìm thấy nút claim cho milestone " + o.milestone_amount);
r.string = "NHẬN THƯỞNG";
}
} else {
var s = e.Btn_Claim_Reward_Container.getChildByName(String(o.milestone_amount)), l = e.Status_Reward_Container.getChildByName(String(o.milestone_amount)).getComponent(cc.Label);
if (s) {
s.active = !1;
l.string = "Chưa đủ điều kiện";
l.node.color = new cc.Color().fromHEX("#FFCC00");
l.node.active = !0;
}
}
});
},
renderChests: function(t) {
var e = this;
if (t.milestones && Array.isArray(t.milestones)) {
var o = t.current_milestone;
t.milestones.forEach(function(t, n) {
var i = e.Chest_Container.children[n];
if (i) {
var a = i.getChildByName("chest-off"), c = i.getChildByName("chest-open"), r = i.children[0];
if (a && c) if (t.is_received) {
a.active = !1;
c.active = !0;
r && (r.active = t.milestone_amount === o);
} else if (t.milestone_amount <= o) {
a.active = !0;
c.active = !1;
e.addClaimableEffect(a);
r && (r.active = t.milestone_amount === o);
} else {
a.active = !0;
c.active = !1;
e.removeClaimableEffect(a);
r && (r.active = !1);
}
}
});
}
},
addClaimableEffect: function(t) {
if (t) {
t.opacity = 255;
var e = cc.sequence(cc.fadeTo(.5, 180), cc.fadeTo(.5, 255));
t.runAction(cc.repeatForever(e));
}
},
removeClaimableEffect: function(t) {
t && t.stopAllActions();
},
setChest: function(t) {
if (null != t && t.is_received) {
this.Chest_Container.children[1].active = !1;
this.Chest_Container.children[2].active = !0;
} else {
this.Chest_Container.children[2].active = !1;
this.Chest_Container.children[1].active = !0;
}
},
onClick_Deposit: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClick_Deposit();
},
onClick_Claim_Reward: function(t) {
var e = t.target.name;
this.CORE.onClick_Claim_Reward(e);
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Event.New_Member.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "7e6e5D1/PNBdpGscMcL8vqq", "Lobby.Popup.Event.New_Member.Controller");
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
}
},
onEnable: function() {},
onDisable: function() {},
init: function(t) {
this.CORE = t;
},
header_Body_Select: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.Event_Header_Container.children.forEach(function(t) {
if (t.name == e) {
t.children[0].active = !0;
t.children[1].active = !1;
} else {
t.children[0].active = !1;
t.children[1].active = !0;
}
});
this.Event_Body_Container.children.forEach(function(t) {
var o = t.name == e;
t.active = !!o;
});
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Event.Refund_Bet.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "b62b4ysck9FqpbXgULm5Xe/", "Lobby.Popup.Event.Refund_Bet.Controller");
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
}
},
onEnable: function() {
this.getData();
},
onDisable: function() {},
init: function(t) {
this.CORE = t;
this.getData();
},
header_Body_Select: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.Event_Header_Container.children.forEach(function(t) {
if (t.name == e) {
t.children[0].active = !0;
t.children[1].active = !1;
} else {
t.children[0].active = !1;
t.children[1].active = !0;
}
});
this.Event_Body_Container.children.forEach(function(t) {
var o = t.name == e;
t.active = !!o;
});
},
getData: function() {
cc.CORE.NETWORK.APP.Send({
event: "event",
data: {
refund_bonus: {
get_data: !0
}
}
});
},
onData: function(t) {
if (null != t && t.weekly_refund_amount) {
this.weekly_game_system.string = cc.CORE.UTIL.numberWithCommas(t.weekly_refund_amount.game_system);
this.weekly_game_api.string = cc.CORE.UTIL.numberWithCommas(t.weekly_refund_amount.game_api);
this.weekly_game_lottery.string = cc.CORE.UTIL.numberWithCommas(t.weekly_refund_amount.game_lottery);
this.weekly_game_sport.string = cc.CORE.UTIL.numberWithCommas(t.weekly_refund_amount.game_sport);
}
if (null != t && t.total_refund_amount) {
this.total_game_system.string = cc.CORE.UTIL.numberWithCommas(t.total_refund_amount.game_system);
this.total_game_api.string = cc.CORE.UTIL.numberWithCommas(t.total_refund_amount.game_api);
this.total_game_lottery.string = cc.CORE.UTIL.numberWithCommas(t.total_refund_amount.game_lottery);
this.total_game_sport.string = cc.CORE.UTIL.numberWithCommas(t.total_refund_amount.game_sport);
}
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.ForgotPwd.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "807berKKYVF9KDdLT633wDY", "Lobby.Popup.ForgotPwd.Controller");
var o = t("HttpRequest");
cc.Class({
extends: cc.Component,
properties: {
username: cc.EditBox,
NewPassword: {
default: null,
type: cc.EditBox
},
ReNewPassword: {
default: null,
type: cc.EditBox
},
inputOtp: cc.EditBox,
captcha: cc.EditBox,
captchaSprite: cc.Sprite
},
init: function() {
this.CORE = this;
this.captcha_code = null;
},
onLoad: function() {},
onEnable: function() {
this.initCaptcha();
},
clickGetOtp: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
o.Post(cc.CORE.CONFIG.SERVER_API + "/auth/get-otp-forgot-password", {}, {
username: this.username.string,
action: "forgot_password"
}).then(function(t) {
0 == t.error_code ? cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "success", 1, 1, !0) : cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
onChangerClick: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
if (this.NewPassword.string.length < 5 || this.NewPassword.string.length > 30 || this.ReNewPassword.string.length < 5 || this.ReNewPassword.string.length > 30) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu từ 5 tới 30 ký tự!", "error", 1, 1, !0);
if (this.NewPassword.string != this.ReNewPassword.string) return cc.CORE.GAME_SCENCE.FastNotify("Nhập lại mật khẩu mới không khớp!", "error", 1, 1, !0);
if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, !0);
if (this.captcha.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mã xác nhận không hợp lệ!", "error", 1, 1, !0);
if (this.captcha.string != this.captcha_code) return cc.CORE.GAME_SCENCE.FastNotify("Mã captcha không hợp lệ!", "error", 1, 1, !0);
o.Post(cc.CORE.CONFIG.SERVER_API + "/auth/recover-password", {}, {
username: this.username.string,
password: this.NewPassword.string,
otp: this.inputOtp.string
}).then(function(e) {
if (0 == e.error_code) {
t.toggle();
cc.CORE.GAME_SCENCE.FastNotify("Đổi mật khẩu thành công!", "success", 1, 1, !0);
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
initCaptcha: function() {
var t = this;
o.Post(cc.CORE.CONFIG.SERVER_API + "/captcha", {}, {}).then(function(e) {
if (0 == e.error_code) {
var o = e.data;
t.captcha_code = o.code;
var n = new Image();
n.src = o.captcha;
n.onload = function() {
var e = new cc.Texture2D();
e.initWithElement(n);
e.handleLoadedTexture();
var o = new cc.SpriteFrame(e);
t.captchaSprite.spriteFrame = o;
};
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0
} ],
"Lobby.Popup.GameApi.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "6e5959dAU5CmLAJE8N61RIx", "Lobby.Popup.GameApi.Controller");
function o() {
o = function() {
return t;
};
var t = {}, e = Object.prototype, n = e.hasOwnProperty, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", r = i.toStringTag || "@@toStringTag";
function s(t, e, o) {
return Object.defineProperty(t, e, {
value: o,
enumerable: !0,
configurable: !0,
writable: !0
}), t[e];
}
try {
s({}, "");
} catch (t) {
s = function(t, e, o) {
return t[e] = o;
};
}
function l(t, e, o, n) {
var i = e && e.prototype instanceof h ? e : h, a = Object.create(i.prototype), c = new O(n || []);
return a._invoke = function(t, e, o) {
var n = "suspendedStart";
return function(i, a) {
if ("executing" === n) throw new Error("Generator is already running");
if ("completed" === n) {
if ("throw" === i) throw a;
return {
value: void 0,
done: !0
};
}
for (o.method = i, o.arg = a; ;) {
var c = o.delegate;
if (c) {
var r = y(c, o);
if (r) {
if (r === C) continue;
return r;
}
}
if ("next" === o.method) o.sent = o._sent = o.arg; else if ("throw" === o.method) {
if ("suspendedStart" === n) throw n = "completed", o.arg;
o.dispatchException(o.arg);
} else "return" === o.method && o.abrupt("return", o.arg);
n = "executing";
var s = u(t, e, o);
if ("normal" === s.type) {
if (n = o.done ? "completed" : "suspendedYield", s.arg === C) continue;
return {
value: s.arg,
done: o.done
};
}
"throw" === s.type && (n = "completed", o.method = "throw", o.arg = s.arg);
}
};
}(t, o, c), a;
}
function u(t, e, o) {
try {
return {
type: "normal",
arg: t.call(e, o)
};
} catch (t) {
return {
type: "throw",
arg: t
};
}
}
t.wrap = l;
var C = {};
function h() {}
function p() {}
function _() {}
var d = {};
s(d, a, function() {
return this;
});
var E = Object.getPrototypeOf, f = E && E(E(N([])));
f && f !== e && n.call(f, a) && (d = f);
var g = _.prototype = h.prototype = Object.create(d);
function b(t) {
[ "next", "throw", "return" ].forEach(function(e) {
s(t, e, function(t) {
return this._invoke(e, t);
});
});
}
function m(t, e) {
function o(i, a, c, r) {
var s = u(t[i], t, a);
if ("throw" !== s.type) {
var l = s.arg, C = l.value;
return C && "object" == typeof C && n.call(C, "__await") ? e.resolve(C.__await).then(function(t) {
o("next", t, c, r);
}, function(t) {
o("throw", t, c, r);
}) : e.resolve(C).then(function(t) {
l.value = t, c(l);
}, function(t) {
return o("throw", t, c, r);
});
}
r(s.arg);
}
var i;
this._invoke = function(t, n) {
function a() {
return new e(function(e, i) {
o(t, n, e, i);
});
}
return i = i ? i.then(a, a) : a();
};
}
function y(t, e) {
var o = t.iterator[e.method];
if (void 0 === o) {
if (e.delegate = null, "throw" === e.method) {
if (t.iterator.return && (e.method = "return", e.arg = void 0, y(t, e), "throw" === e.method)) return C;
e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method");
}
return C;
}
var n = u(o, t.iterator, e.arg);
if ("throw" === n.type) return e.method = "throw", e.arg = n.arg, e.delegate = null, 
C;
var i = n.arg;
return i ? i.done ? (e[t.resultName] = i.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", 
e.arg = void 0), e.delegate = null, C) : i : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), 
e.delegate = null, C);
}
function R(t) {
var e = {
tryLoc: t[0]
};
1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), 
this.tryEntries.push(e);
}
function v(t) {
var e = t.completion || {};
e.type = "normal", delete e.arg, t.completion = e;
}
function O(t) {
this.tryEntries = [ {
tryLoc: "root"
} ], t.forEach(R, this), this.reset(!0);
}
function N(t) {
if (t) {
var e = t[a];
if (e) return e.call(t);
if ("function" == typeof t.next) return t;
if (!isNaN(t.length)) {
var o = -1, i = function e() {
for (;++o < t.length; ) if (n.call(t, o)) return e.value = t[o], e.done = !1, e;
return e.value = void 0, e.done = !0, e;
};
return i.next = i;
}
}
return {
next: L
};
}
function L() {
return {
value: void 0,
done: !0
};
}
return p.prototype = _, s(g, "constructor", _), s(_, "constructor", p), p.displayName = s(_, r, "GeneratorFunction"), 
t.isGeneratorFunction = function(t) {
var e = "function" == typeof t && t.constructor;
return !!e && (e === p || "GeneratorFunction" === (e.displayName || e.name));
}, t.mark = function(t) {
return Object.setPrototypeOf ? Object.setPrototypeOf(t, _) : (t.__proto__ = _, s(t, r, "GeneratorFunction")), 
t.prototype = Object.create(g), t;
}, t.awrap = function(t) {
return {
__await: t
};
}, b(m.prototype), s(m.prototype, c, function() {
return this;
}), t.AsyncIterator = m, t.async = function(e, o, n, i, a) {
void 0 === a && (a = Promise);
var c = new m(l(e, o, n, i), a);
return t.isGeneratorFunction(o) ? c : c.next().then(function(t) {
return t.done ? t.value : c.next();
});
}, b(g), s(g, r, "Generator"), s(g, a, function() {
return this;
}), s(g, "toString", function() {
return "[object Generator]";
}), t.keys = function(t) {
var e = [];
for (var o in t) e.push(o);
return e.reverse(), function o() {
for (;e.length; ) {
var n = e.pop();
if (n in t) return o.value = n, o.done = !1, o;
}
return o.done = !0, o;
};
}, t.values = N, O.prototype = {
constructor: O,
reset: function(t) {
if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, 
this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(v), 
!t) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0);
},
stop: function() {
this.done = !0;
var t = this.tryEntries[0].completion;
if ("throw" === t.type) throw t.arg;
return this.rval;
},
dispatchException: function(t) {
if (this.done) throw t;
var e = this;
function o(o, n) {
return c.type = "throw", c.arg = t, e.next = o, n && (e.method = "next", e.arg = void 0), 
!!n;
}
for (var i = this.tryEntries.length - 1; i >= 0; --i) {
var a = this.tryEntries[i], c = a.completion;
if ("root" === a.tryLoc) return o("end");
if (a.tryLoc <= this.prev) {
var r = n.call(a, "catchLoc"), s = n.call(a, "finallyLoc");
if (r && s) {
if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
if (this.prev < a.finallyLoc) return o(a.finallyLoc);
} else if (r) {
if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
} else {
if (!s) throw new Error("try statement without catch or finally");
if (this.prev < a.finallyLoc) return o(a.finallyLoc);
}
}
}
},
abrupt: function(t, e) {
for (var o = this.tryEntries.length - 1; o >= 0; --o) {
var i = this.tryEntries[o];
if (i.tryLoc <= this.prev && n.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
var a = i;
break;
}
}
a && ("break" === t || "continue" === t) && a.tryLoc <= e && e <= a.finallyLoc && (a = null);
var c = a ? a.completion : {};
return c.type = t, c.arg = e, a ? (this.method = "next", this.next = a.finallyLoc, 
C) : this.complete(c);
},
complete: function(t, e) {
if ("throw" === t.type) throw t.arg;
return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, 
this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), 
C;
},
finish: function(t) {
for (var e = this.tryEntries.length - 1; e >= 0; --e) {
var o = this.tryEntries[e];
if (o.finallyLoc === t) return this.complete(o.completion, o.afterLoc), v(o), C;
}
},
catch: function(t) {
for (var e = this.tryEntries.length - 1; e >= 0; --e) {
var o = this.tryEntries[e];
if (o.tryLoc === t) {
var n = o.completion;
if ("throw" === n.type) {
var i = n.arg;
v(o);
}
return i;
}
}
throw new Error("illegal catch attempt");
},
delegateYield: function(t, e, o) {
return this.delegate = {
iterator: N(t),
resultName: e,
nextLoc: o
}, "next" === this.method && (this.arg = void 0), C;
}
}, t;
}
function n(t, e, o, n, i, a, c) {
try {
var r = t[a](c), s = r.value;
} catch (t) {
o(t);
return;
}
r.done ? e(s) : Promise.resolve(s).then(n, i);
}
function i(t) {
return function() {
var e = this, o = arguments;
return new Promise(function(i, a) {
var c = t.apply(e, o);
function r(t) {
n(c, i, a, r, s, "next", t);
}
function s(t) {
n(c, i, a, r, s, "throw", t);
}
r(void 0);
});
};
}
var a = t("AssetManager"), c = t("HttpRequest"), r = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
title: cc.Label,
scrollView: cc.ScrollView,
listContent: cc.Node,
ItemPrefab: cc.Prefab,
pagination: cc.Node,
searchInput: cc.EditBox,
searchBtn: cc.Node,
btnLiked: cc.Node,
empty_data: cc.Node,
loadingOverlay: cc.Node,
loadListOverlay: cc.Node
},
init: function() {
var t = this;
this.CORE = this;
this.liked = !1;
this.search = null;
this.product_type = null;
this.category = null;
a.loadFromBundle("Common_Bundle", "Prefabs/Pagination", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
t.pagination.addChild(o);
t.pagination = o.getComponent("Pagination");
t.pagination.init(t);
}).catch(function(t) {
return console.log("❌ Error loading:", t);
});
},
onEnable: function() {
this.clean();
this.btnLiked.color = new cc.Color().fromHEX("#FFFFFF");
this.liked = !1;
},
onDisable: function() {
this.clean();
this.loadListOverlay.active = !1;
},
clean: function() {
this.listContent.removeAllChildren();
this.searchInput.string = "";
this.liked = !1;
},
setCall: function(t, e) {
void 0 === t && (t = null);
void 0 === e && (e = null);
this.product_type = t;
this.category = e;
},
onLoad: function() {},
onClickItem: function(t) {
cc.log(t);
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
this.liked = !1;
},
onSearch: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.getGameApiList();
},
onClickLiked: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.liked = !this.liked;
this.liked ? this.btnLiked.color = new cc.Color().fromHEX("#FFEB00") : this.btnLiked.color = new cc.Color().fromHEX("#FFFFFF");
this.liked ? this.getFavoriteList() : this.getGameApiList();
},
postFavorite: function(t, e) {
cc.CORE.GAME_SCENCE.PlayClick();
var o = {
game_code: t.game_code,
product_type: t.product_type
};
e ? c.Post(cc.CORE.CONFIG.SERVER_API + "/game-api/add-favorite", {}, o, {
Authorization: "Bearer " + r.getItem("access_token")
}).then(function(t) {
0 == t.error_code || cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
}) : c.Post(cc.CORE.CONFIG.SERVER_API + "/game-api/remove-favorite", {}, o, {
Authorization: "Bearer " + r.getItem("access_token")
}).then(function(t) {
0 == t.error_code || cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
});
},
getFavoriteList: function() {
var t = this;
this.listContent.removeAllChildren();
this.loadListOverlay.active = !0;
this.empty_data.active = !1;
c.Get(cc.CORE.CONFIG.SERVER_API + "/game-api/favorite-list?product_type=" + this.product_type + "&game_type=" + this.category, {}, {
Authorization: "Bearer " + r.getItem("access_token")
}).then(function(e) {
t.listContent.removeAllChildren();
t.empty_data.active = 0 == e.data.length;
if (0 == e.error_code) {
Promise.all(e.data.map(function() {
var e = i(o().mark(function e(n) {
var i, a;
return o().wrap(function(e) {
for (;;) switch (e.prev = e.next) {
case 0:
i = cc.instantiate(t.ItemPrefab);
(a = i.getComponent("Lobby.Popup.GameApi.Item.Controller")).init(t, n);
e.next = 5;
return a.setIcon(cc.CORE.CONFIG.SERVER_API + "/game-api/fetch-icon-game?url=" + encodeURIComponent(n.game_icon));

case 5:
a.setGameName(cc.CORE.UTIL.cutText(n.game_name, 10));
if (n.is_favorite) {
a.is_favorite = !0;
a.setLiked(!0);
}
t.listContent.addChild(i);

case 8:
case "end":
return e.stop();
}
}, e);
}));
return function(t) {
return e.apply(this, arguments);
};
}()));
void 0 !== e.data.total && void 0 !== e.data.page && void 0 !== e.data.limit && t.pagination.onSet(e.data.page, e.data.limit, e.data.total);
t.pagination.node.active = !1;
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
t.loadListOverlay.active = !1;
}).catch(function(e) {
t.loadListOverlay.active = !1;
console.log(e);
return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, !0);
});
},
getGameApiList: function(t, e) {
var n = this;
void 0 === t && (t = 1);
void 0 === e && (e = 21);
var a = "", s = "";
"" !== this.searchInput.string && (a = "&game_name=" + this.searchInput.string);
this.liked && (s = "&liked=true");
this.loadListOverlay.active = !0;
this.empty_data.active = !1;
c.Get(cc.CORE.CONFIG.SERVER_API + "/game-api/game-list?product_type=" + this.product_type + "&game_type=" + this.category + "&page=" + t + "&limit=" + e + a + s, {}, {
Authorization: "Bearer " + r.getItem("access_token")
}).then(function(t) {
n.listContent.removeAllChildren();
if (0 == t.error_code) {
n.empty_data.active = 0 == t.data.result.length;
Promise.all(t.data.result.map(function() {
var t = i(o().mark(function t(e) {
var i, a;
return o().wrap(function(t) {
for (;;) switch (t.prev = t.next) {
case 0:
i = cc.instantiate(n.ItemPrefab);
a = i.getComponent("Lobby.Popup.GameApi.Item.Controller");
t.next = 4;
return a.init(n, e);

case 4:
t.next = 6;
return a.setIcon(cc.CORE.CONFIG.SERVER_API + "/game-api/fetch-icon-game?url=" + encodeURIComponent(e.game_icon));

case 6:
a.setGameName(cc.CORE.UTIL.cutText(e.game_name, 10));
"ACTIVATED" != e.status && a.setMaintain(!0);
if (e.is_favorite) {
a.is_favorite = !0;
a.setLiked(!0);
}
n.listContent.addChild(i);

case 10:
case "end":
return t.stop();
}
}, t);
}));
return function(e) {
return t.apply(this, arguments);
};
}()));
void 0 !== t.data.total && void 0 !== t.data.page && void 0 !== t.data.limit && n.pagination.onSet(t.data.page, t.data.limit, t.data.total);
} else cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
n.loadListOverlay.active = !1;
}).catch(function(t) {
n.loadListOverlay.active = !1;
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
lauchGame: function(t) {
var e = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
this.loadingOverlay.active = !0;
var o = {
game_code: t.game_code,
product_type: t.product_type
};
c.Post(cc.CORE.CONFIG.SERVER_API + "/game-api/launch-game", {}, o, {
Authorization: "Bearer " + r.getItem("access_token")
}).then(function(t) {
if (0 == t.error_code) {
cc.log("result", t);
if (void 0 !== t.data && void 0 !== t.data.code && 200 == t.data.code) if ("" !== t.data.content) c.Post(cc.CORE.CONFIG.SERVER_API + "/game-api/host-game", {}, {
data: t.data.content
}, {
Authorization: "Bearer " + r.getItem("access_token")
}).then(function(t) {
cc.log("result", t);
if (0 == t.error_code) {
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(t.url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
} else cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
}); else if (void 0 !== t.data.url) {
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(t.data.url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
} else {
cc.log("result", t.data);
cc.CORE.GAME_SCENCE.FastNotify("Trò chơi đang được bảo trì!", "error", 1, 1, !0);
} else {
cc.log("result", t);
cc.CORE.GAME_SCENCE.FastNotify("Trò chơi đang được bảo trì!", "error", 1, 1, !0);
}
} else cc.CORE.GAME_SCENCE.FastNotify(t.error_message, "error", 1, 1, !0);
e.loadingOverlay.active = !1;
}).catch(function(t) {
e.loadingOverlay.active = !1;
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
getDataPage: function(t, e) {
void 0 === e && (e = 21);
this.scrollView.scrollToTop(.5, !0);
this.getGameApiList(t, e);
},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0,
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.GameApi.Direct.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "26badbqh6BI7JA4jzArP4t5", "Lobby.Popup.GameApi.Direct.Controller");
t("LocalStorage"), t("HttpRequest");
var o = t("GameApiOverlayIframe");
cc.Class({
extends: cc.Component,
properties: {},
init: function() {
this.CORE = this;
this.play_url = null;
this.GameApiOverlayIframe = o;
},
onLoad: function() {},
onEnable: function() {},
setPlayUrl: function(t) {
console.log(t);
this.play_url = t;
},
clickDirectUrl: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (!this.play_url) return cc.CORE.GAME_SCENCE.FastNotify("Không có URL để chuyển hướng!", "error", 1, 1, !0);
this.toggle();
cc.sys.openURL(this.play_url);
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
createOverlayIframe: function() {
cc.CORE.SETTING.MUSIC && cc.CORE.AUDIO.stopMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic);
try {
cc.CORE.GAME_SCENCE.MainWebview.active = !0;
cc.CORE.GAME_SCENCE.MainWebview.children[1].children[0].getComponent(cc.WebView).url = this.play_url;
} catch (t) {
console.log(t);
}
},
update: function() {}
});
cc._RF.pop();
}, {
GameApiOverlayIframe: void 0,
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.GameApi.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "47dcfcJOSdEW6ju9laHJ6Lq", "Lobby.Popup.GameApi.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
icon: cc.Sprite,
game_name: cc.Label,
is_maintenance: cc.Node,
btnLiked: cc.Node
},
onLoad: function() {},
init: function(t, e) {
this.CORE = t;
this.data = e;
this.is_favorite = !1;
},
setIcon: function(t) {
void 0 === t && (t = "");
t && cc.CORE.UTIL.LoadImgFromUrl(this.icon, t);
},
setGameName: function(t) {
void 0 === t && (t = "");
t && (this.game_name.string = t);
},
setMaintain: function(t) {
void 0 === t && (t = !1);
this.is_maintenance.active = !!t;
},
setLiked: function(t) {
void 0 === t && (t = !1);
this.btnLiked.opacity = t ? 255 : 149.685;
},
onClickItem: function() {
this.CORE.lauchGame(this.data);
},
onClickFavorite: function() {
this.is_favorite = !this.is_favorite;
this.setLiked(this.is_favorite);
this.CORE.postFavorite(this.data, this.is_favorite);
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "c422ej+LbNBVo5QJLViIdqx", "Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox
},
init: function(t) {
this.CORE = t;
},
onEnable: function() {
this.CORE.rate_change.string = "1000 = 1 điểm";
},
onConvertReceive: function() {
var t = Number(cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)), e = Math.floor(t / 1e3);
this.CORE.real_receive.string = e.toString();
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
this.onConvertReceive();
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
this.onConvertReceive();
},
onCleanAmount: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.inputAmount.string = "";
this.onConvertReceive();
},
onClickAmountSuggest: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.onChangerAmount(e);
},
onClickAmountAll: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.onChangerAmount(cc.CORE.USER.balance.toString());
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "b33b4g711FCJJj1A4sIEZRP", "Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox
},
init: function(t) {
this.CORE = t;
},
onEnable: function() {
this.CORE.rate_change.string = "1 điểm = 1000";
},
onConvertReceive: function() {
var t = (1e3 * Number(cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string))).toFixed(2);
this.CORE.real_receive.string = cc.CORE.UTIL.numberWithCommas(t);
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
this.onConvertReceive();
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
this.onConvertReceive();
},
onCleanAmount: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.inputAmount.string = "";
this.onConvertReceive();
},
onClickAmountSuggest: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.onChangerAmount(e);
},
onClickAmountAll: function() {
cc.CORE.GAME_SCENCE.PlayClick();
var t = Number(this.CORE.balance.string), e = Math.floor(t);
this.onChangerAmount(String(e));
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.GameApi.TransferWallet.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "6f59dZ4PddMKovF5Lbw8G8T", "Lobby.Popup.GameApi.TransferWallet.Controller");
var o = t("HttpRequest"), n = t("LocalStorage"), i = t("Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller"), a = t("Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller");
cc.Class({
extends: cc.Component,
properties: {
headerPaymentType: cc.Node,
bodyPaymentType: cc.Node,
Deposit: i,
Withdraw: a,
loadingNode: cc.Node,
balance: cc.Label,
real_receive: cc.Label,
rate_change: cc.Label
},
init: function(t) {
this.CORE = t;
this.tabShow = "deposit";
this.product_type = null;
this.game_code = null;
this.play_url = null;
},
onLoad: function() {
this.Deposit.init(this);
this.Withdraw.init(this);
},
onEnable: function() {
this.getBalance();
},
onDisable: function() {
this.reset();
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
reset: function() {
this.balance.string = "0";
this.real_receive.string = "0";
this.Deposit.inputAmount.string = "";
this.Withdraw.inputAmount.string = "";
},
onSelectHeaderPaymentType: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.headerPaymentType.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.bodyPaymentType.children.forEach(function(t) {
t.active = t.name == e;
});
this.tabShow = e.toLowerCase();
this.reset();
this.getBalance();
},
setDataGameApiTransferWallet: function(t, e) {
try {
var o = e.split("|"), n = o[0], i = o[1];
this.product_type = n;
this.game_code = i;
} catch (t) {
console.log(t);
}
},
getBalance: function() {
var t = this;
this.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/game-tcg/get-balance", {}, {
product_type: this.product_type,
game_code: this.game_code
}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
t.loadingNode.active = !1;
if (0 == e.error_code) {
var o;
null != e && null != (o = e.data) && o.balance && (t.balance.string = e.data.balance || 0);
} else {
t.balance.string = "0";
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}
}).catch(function(e) {
console.log(e);
t.loadingNode.active = !1;
t.balance.string = "0";
cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
},
onClickDeposit: function() {
var t = this, e = Number(cc.CORE.UTIL.getOnlyNumberInString(this.Deposit.inputAmount.string));
if (e < 1e3) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, 1, !0);
this.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/game-tcg/wallet-transfer", {}, {
product_type: this.product_type,
transfer_type: "deposit",
amount: e
}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
t.loadingNode.active = !1;
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify("Nạp vào thành công!", "success", 1, 1, !0);
t.getBalance();
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(e) {
console.log(e);
t.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
},
onClickWithdraw: function() {
var t = this, e = Number(cc.CORE.UTIL.getOnlyNumberInString(this.Withdraw.inputAmount.string));
if (e < 1) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1!", "info", 1, 1, !0);
this.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/game-tcg/wallet-transfer", {}, {
product_type: this.product_type,
transfer_type: "withdraw",
amount: e
}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
t.loadingNode.active = !1;
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify("Rút ra thành công!", "success", 1, 1, !0);
t.getBalance();
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(e) {
console.log(e);
t.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
},
getPlayUrl: function() {
var t = this;
this.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/game-tcg/launch-game", {}, {
product_type: this.product_type,
game_code: this.game_code,
platform: cc.CORE.UTIL.isMobile() ? "mobile" : "desktop"
}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
t.loadingNode.active = !1;
if (0 == e.error_code) {
console.log(e.data.play_url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(e.data.play_url);
cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(e) {
console.log(e);
t.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
"Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller": "Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller",
"Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller": "Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller",
LocalStorage: void 0
} ],
"Lobby.Popup.History_Bet.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "233a0QYuJ5BDpibcm6G21X5", "Lobby.Popup.History_Bet.Controller");
function o() {
return (o = Object.assign ? Object.assign.bind() : function(t) {
for (var e = 1; e < arguments.length; e++) {
var o = arguments[e];
for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (t[n] = o[n]);
}
return t;
}).apply(this, arguments);
}
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
header: cc.Node,
label_game: cc.Label,
moreSelect: cc.Node,
moreSelect_item: cc.Node,
XocDia_ItemByDatePrefab: cc.Prefab,
XocDia_ItemBySessionPrefab: cc.Prefab,
XocDia_ItemBySessionBetPrefab: cc.Prefab,
Sicbo_ItemByDatePrefab: cc.Prefab,
Sicbo_ItemBySessionPrefab: cc.Prefab,
Sicbo_ItemBySessionBetPrefab: cc.Prefab,
bodyViewByDate: cc.Node,
bodyViewBySession: cc.Node,
bodyViewBySessionBet: cc.Node,
listBydateContent: cc.Node,
listBySessionContent: cc.Node,
listBySessionBetContent: cc.Node,
byDate_total_bet: cc.Label,
byDate_total_refurn: cc.Label,
byDate_total_fee: cc.Label,
byDate_total_profit: cc.Label,
bySession_total_bet: cc.Label,
bySession_total_refurn: cc.Label,
bySession_total_fee: cc.Label,
bySession_total_profit: cc.Label,
bySessionBet_total_bet: cc.Label,
bySessionBet_total_refurn: cc.Label,
bySessionBet_total_fee: cc.Label,
bySessionBet_total_profit: cc.Label,
btnBack: cc.Node,
sprite_status: {
default: [],
type: cc.SpriteFrame
}
},
init: function(t) {
this.CORE = t;
this.gameCategoryEnum = {
XOC_DIA: "xocdia",
SICBO: "sicbo",
LOTTERY: "lottery"
};
this.tabShow = this.gameCategoryEnum.XOC_DIA;
this.state_time = "days";
this.state_show = "view_by_date";
this.byRoomCode = {};
},
onLoad: function() {},
onShowGameSelect: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
this.toggleMoreSelect(t, null);
},
toggleMoreSelect: function(t, e) {
this.moreSelect.active = !this.moreSelect.active;
if (e) {
switch (e) {
case this.gameCategoryEnum.XOC_DIA:
this.tabShow = this.gameCategoryEnum.XOC_DIA;
this.label_game.string = "Xóc Đĩa Live";
break;

case this.gameCategoryEnum.SICBO:
this.tabShow = this.gameCategoryEnum.SICBO;
this.label_game.string = "Tài Xỉu Live";
break;

case this.gameCategoryEnum.LOTTERY:
this.tabShow = this.gameCategoryEnum.LOTTERY;
this.label_game.string = "Xổ Số Live";
}
this.moreSelect_item.children.forEach(function(t) {
t.name == e ? t.getChildByName("active").active = !0 : t.getChildByName("active").active = !1;
});
}
this.getData();
},
onEnable: function() {
void 0 !== cc.CORE.GAME_ROOM.ROOM_CODE && (this.byRoomCode = {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
});
this.getData();
this.state_show = "view_by_date";
this.bodyViewByDate.active = !0;
this.bodyViewBySession.active = !1;
this.bodyViewBySessionBet.active = !1;
},
getData: function() {
var t = {};
"days" == this.state_time && (t = cc.CORE.UTIL.getDateRange("today"));
"weeks" == this.state_time && (t = cc.CORE.UTIL.getDateRange("this_week"));
"months" == this.state_time && (t = cc.CORE.UTIL.getDateRange("this_month"));
"years" == this.state_time && (t = cc.CORE.UTIL.getDateRange("this_year"));
var e = {
event: "history_bet",
data: {
get_list: o({
game: this.tabShow,
time: t,
state_time: this.state_time
}, this.byRoomCode)
}
};
cc.CORE.NETWORK.APP.Send(e);
},
onRefresh: function() {
this.getData();
this.bodyViewByDate.active = !0;
this.bodyViewBySession.active = !1;
this.bodyViewBySessionBet.active = !1;
this.listBydateContent.removeAllChildren();
this.listBySessionContent.removeAllChildren();
this.listBySessionBetContent.removeAllChildren();
},
onSelectHeader: function(t) {
this.state_show = "view_by_date";
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.header.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.state_time = e;
this.getData();
this.bodyViewByDate.active = !0;
this.bodyViewBySession.active = !1;
this.bodyViewBySessionBet.active = !1;
this.listBydateContent.removeAllChildren();
this.listBySessionContent.removeAllChildren();
this.listBySessionBetContent.removeAllChildren();
},
onClickBack: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if ("view_by_session" == this.state_show) {
this.state_show = "view_by_date";
this.bodyViewByDate.active = !0;
this.bodyViewBySession.active = !1;
this.bodyViewBySessionBet.active = !1;
}
if ("view_by_session_bet" == this.state_show) {
this.state_show = "view_by_session";
this.bodyViewByDate.active = !1;
this.bodyViewBySession.active = !0;
this.bodyViewBySessionBet.active = !1;
}
},
onData: function(t) {
var e = this;
this.listBydateContent.removeAllChildren();
this.listBySessionContent.removeAllChildren();
this.listBySessionBetContent.removeAllChildren();
if (null != t.get_history_bet) {
var o, n;
if (null != t && null != (o = t.get_history_bet) && o.xocdia) {
var i = t.get_history_bet.xocdia;
if (null != i.data) {
var a = i.data;
a = Object.entries(a).reverse().reduce(function(t, e) {
var o = e[0], n = e[1];
t[o] = n;
return t;
}, {});
this.state_show = "view_by_date";
Object.entries(a).forEach(function(t) {
var o = t[0], n = t[1], i = n, a = n.sum, c = cc.instantiate(e.XocDia_ItemByDatePrefab), r = c.getComponent("Lobby.Popup.History_Bet.Xocdia.ByDate.Item.Controller");
r.init(e, i);
r.fee.string = cc.CORE.UTIL.abbreviateNumber(a.total_fee, 2);
r.time.string = cc.CORE.UTIL.getDayOfWeek(o) + " - " + o;
r.total_bet.string = cc.CORE.UTIL.abbreviateNumber(a.total_bet, 2);
r.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(a.total_refurn, 2);
var s = a.total_win_real - a.total_lose, l = 0 == s, u = s > 0;
r.total_win.string = (u ? "+" : l ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(s), 2);
r.total_win.node.color = u ? cc.color().fromHEX("#00FF00") : cc.color().fromHEX("#FF0000");
r.status.getComponent(cc.Sprite).spriteFrame = u ? e.sprite_status[0] : l ? e.sprite_status[2] : e.sprite_status[1];
e.listBydateContent.addChild(c);
if ("days" == e.state_time) {
e.state_show = "view_by_session";
e.onClickViewSessionByDate(i);
}
});
}
if (void 0 !== i.sum) {
var c = i.sum;
void 0 !== c.total_bet && (this.byDate_total_bet.string = cc.CORE.UTIL.abbreviateNumber(c.total_bet, 2));
void 0 !== c.total_refurn && (this.byDate_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(c.total_refurn, 2));
void 0 !== c.total_fee && (this.byDate_total_fee.string = cc.CORE.UTIL.abbreviateNumber(c.total_fee, 2));
if (void 0 !== c.total_win_real && void 0 !== c.total_lose) {
var r = c.total_win_real - c.total_lose > 0 ? "#00FF00" : c.total_win_real - c.total_lose == 0 ? "#FFFFFF" : "#FF0000";
this.byDate_total_profit.string = (c.total_win_real - c.total_lose > 0 ? "+" : c.total_win_real - c.total_lose == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(c.total_win_real - c.total_lose), 2);
this.byDate_total_profit.node.color = cc.color().fromHEX(r);
}
}
}
if (null != t && null != (n = t.get_history_bet) && n.sicbo) {
var s = t.get_history_bet.sicbo;
if (null != s.data) {
var l = s.data;
l = Object.entries(l).reverse().reduce(function(t, e) {
var o = e[0], n = e[1];
t[o] = n;
return t;
}, {});
this.state_show = "view_by_date";
Object.entries(l).forEach(function(t) {
var o = t[0], n = t[1], i = n, a = n.sum, c = cc.instantiate(e.Sicbo_ItemByDatePrefab), r = c.getComponent("Lobby.Popup.History_Bet.Sicbo.ByDate.Item.Controller");
r.init(e, i);
r.fee.string = cc.CORE.UTIL.abbreviateNumber(a.total_fee, 2);
r.time.string = cc.CORE.UTIL.getDayOfWeek(o) + " - " + o;
r.total_bet.string = cc.CORE.UTIL.abbreviateNumber(a.total_bet, 2);
r.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(a.total_refurn, 2);
var s = a.total_win_real - a.total_lose, l = 0 == s, u = s > 0;
r.total_win.string = (u ? "+" : l ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(s), 2);
r.total_win.node.color = u ? cc.color().fromHEX("#00FF00") : cc.color().fromHEX("#FF0000");
r.status.getComponent(cc.Sprite).spriteFrame = u ? e.sprite_status[0] : l ? e.sprite_status[2] : e.sprite_status[1];
e.listBydateContent.addChild(c);
if ("days" == e.state_time) {
e.state_show = "view_by_session";
e.onClickViewSessionByDate(i);
}
});
}
if (void 0 !== s.sum) {
var u = s.sum;
void 0 !== u.total_bet && (this.byDate_total_bet.string = cc.CORE.UTIL.abbreviateNumber(u.total_bet, 2));
void 0 !== u.total_refurn && (this.byDate_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(u.total_refurn, 2));
void 0 !== u.total_fee && (this.byDate_total_fee.string = cc.CORE.UTIL.abbreviateNumber(u.total_fee, 2));
if (void 0 !== u.total_win_real && void 0 !== u.total_lose) {
var C = u.total_win_real - u.total_lose > 0 ? "#00FF00" : u.total_win_real - u.total_lose == 0 ? "#FFFFFF" : "#FF0000";
this.byDate_total_profit.string = (u.total_win_real - u.total_lose > 0 ? "+" : u.total_win_real - u.total_lose == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(u.total_win_real - u.total_lose), 2);
this.byDate_total_profit.node.color = cc.color().fromHEX(C);
}
}
}
}
},
onClickViewSessionByDate: function(t) {
var e = this;
this.listBySessionContent.removeAllChildren();
this.bodyViewByDate.active = !1;
this.bodyViewBySession.active = !0;
this.bodyViewBySessionBet.active = !1;
switch (this.tabShow) {
case this.gameCategoryEnum.XOC_DIA:
if (null != t.bet) {
var o = t.bet.reverse();
this.state_show = "view_by_session";
Object.entries(o).forEach(function(t) {
t[0];
var o, n = t[1], i = n.sum, a = n, c = cc.instantiate(e.XocDia_ItemBySessionPrefab), r = c.getComponent("Lobby.Popup.History_Bet.Xocdia.BySession.Item.Controller");
r.init(e, a);
r.session.string = "Phiên: #" + n.session + " - Bàn chơi: " + n.data_bet[0].room_code;
r.time.string = cc.CORE.UTIL.getStringDateByTime(n.session_data.session_time);
r.total_bet.string = cc.CORE.UTIL.abbreviateNumber(i.total_bet, 2);
r.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(i.total_refurn, 2);
r.fee.string = cc.CORE.UTIL.abbreviateNumber(i.total_fee, 2);
o = i.total_win_real - i.total_lose;
r.total_win.string = (o > 0 ? "+" : 0 == o ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(o), 2);
r.total_win.node.color = o > 0 ? cc.color().fromHEX("#00FF00") : 0 == o ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");
r.status.getComponent(cc.Sprite).spriteFrame = o > 0 ? e.sprite_status[0] : 0 == o ? e.sprite_status[2] : e.sprite_status[1];
void 0 !== n.session_data.session_result && r.setResultDot(n.session_data.session_result);
e.listBySessionContent.addChild(c);
});
}
if (void 0 !== t.sum) {
var n = t.sum;
void 0 !== n.total_bet && (this.bySession_total_bet.string = cc.CORE.UTIL.abbreviateNumber(n.total_bet, 2));
void 0 !== n.total_refurn && (this.bySession_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(n.total_refurn, 2));
void 0 !== n.total_fee && (this.bySession_total_fee.string = cc.CORE.UTIL.abbreviateNumber(n.total_fee, 2));
if (void 0 !== n.total_win_real && void 0 !== n.total_lose) {
var i = n.total_win_real - n.total_lose > 0 ? "#00FF00" : n.total_win_real - n.total_lose == 0 ? "#FFFFFF" : "#FF0000";
this.bySession_total_profit.string = (n.total_win_real - n.total_lose > 0 ? "+" : n.total_win_real - n.total_lose == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(n.total_win_real - n.total_lose), 2);
this.bySession_total_profit.node.color = cc.color().fromHEX(i);
}
}
break;

case this.gameCategoryEnum.SICBO:
if (null != t.bet) {
var a = t.bet.reverse();
this.state_show = "view_by_session";
Object.entries(a).forEach(function(t) {
t[0];
var o, n = t[1], i = n.sum, a = n, c = cc.instantiate(e.Sicbo_ItemBySessionPrefab), r = c.getComponent("Lobby.Popup.History_Bet.Sicbo.BySession.Item.Controller");
r.init(e, a);
r.session.string = "Phiên: #" + n.session + " - Bàn chơi: " + n.data_bet[0].room_code;
r.time.string = cc.CORE.UTIL.getStringDateByTime(n.session_data.session_time);
r.total_bet.string = cc.CORE.UTIL.abbreviateNumber(i.total_bet, 2);
r.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(i.total_refurn, 2);
r.fee.string = cc.CORE.UTIL.abbreviateNumber(i.total_fee, 2);
o = i.total_win_real - i.total_lose;
r.total_win.string = (o > 0 ? "+" : 0 == o ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(o), 2);
r.total_win.node.color = o > 0 ? cc.color().fromHEX("#00FF00") : 0 == o ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");
r.status.getComponent(cc.Sprite).spriteFrame = o > 0 ? e.sprite_status[0] : 0 == o ? e.sprite_status[2] : e.sprite_status[1];
void 0 !== n.session_data.session_result && r.setResultDot(n.session_data.session_result);
e.listBySessionContent.addChild(c);
});
}
if (void 0 !== t.sum) {
var c = t.sum;
void 0 !== c.total_bet && (this.bySession_total_bet.string = cc.CORE.UTIL.abbreviateNumber(c.total_bet, 2));
void 0 !== c.total_refurn && (this.bySession_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(c.total_refurn, 2));
void 0 !== c.total_fee && (this.bySession_total_fee.string = cc.CORE.UTIL.abbreviateNumber(c.total_fee, 2));
if (void 0 !== c.total_win_real && void 0 !== c.total_lose) {
var r = c.total_win_real - c.total_lose > 0 ? "#00FF00" : c.total_win_real - c.total_lose == 0 ? "#FFFFFF" : "#FF0000";
this.bySession_total_profit.string = (c.total_win_real - c.total_lose > 0 ? "+" : c.total_win_real - c.total_lose == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(c.total_win_real - c.total_lose), 2);
this.bySession_total_profit.node.color = cc.color().fromHEX(r);
}
}
}
},
onClickViewSessionBySession: function(t) {
var e = this;
cc.log(t);
this.listBySessionBetContent.removeAllChildren();
this.bodyViewByDate.active = !1;
this.bodyViewBySession.active = !1;
this.bodyViewBySessionBet.active = !0;
this.state_show = "view_by_session_bet";
switch (this.tabShow) {
case this.gameCategoryEnum.XOC_DIA:
this.BET_DOOR_ENUM = {
even: "CHẴN",
odd: "LẺ",
even_low: "CHẴN 10:9",
odd_low: "LẺ 10:9",
even_high: "CHẴN 9:10",
odd_high: "LẺ 9:10",
red3: "3 ĐỎ",
red4: "4 ĐỎ",
white3: "3 TRẮNG",
white4: "4 TRẮNG"
};
if (null != t.data_bet) {
var o = t.data_bet, n = {};
o.forEach(function(t) {
var e = t.bet_door;
n[e] || (n[e] = {
fee: 0,
total_bet: 0,
total_refurn: 0,
total_win: 0,
total_lose: 0,
total_win_real: 0
});
n[e].fee += t.fee;
n[e].total_bet += t.total_bet;
n[e].total_refurn += t.total_refurn;
n[e].total_win += t.total_win;
n[e].total_lose += t.total_lose;
n[e].total_win_real += t.total_win_real;
});
Object.entries(n).forEach(function(o) {
var n = o[0], i = o[1], a = cc.instantiate(e.Sicbo_ItemBySessionBetPrefab), c = a.getComponent("Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller");
c.init(e);
c.session.string = "Phiên: #" + t.session + " - Bàn chơi: " + t.data_bet[0].room_code;
c.time.string = cc.CORE.UTIL.getStringDateByTime(t.session_data.session_time);
void 0 !== t.session_data.session_result && c.setResultDot(t.session_data.session_result);
c.bet_door.string = e.BET_DOOR_ENUM[n];
c.bet_door1.string = e.BET_DOOR_ENUM[n];
c.fee.string = cc.CORE.UTIL.abbreviateNumber(i.fee, 2);
c.total_bet.string = cc.CORE.UTIL.abbreviateNumber(i.total_bet, 2);
c.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(i.total_refurn, 2);
var r = 0;
i.total_win > 0 ? r = i.total_win_real : 0 == i.total_win && (r = -i.total_lose);
c.total_win.string = (r > 0 ? "+" : 0 == r ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(r), 2);
c.total_win.node.color = r > 0 ? cc.color().fromHEX("#00FF00") : 0 == r ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");
c.status.getComponent(cc.Sprite).spriteFrame = r > 0 ? e.sprite_status[0] : 0 == r ? e.sprite_status[2] : e.sprite_status[1];
e.listBySessionBetContent.addChild(a);
});
}
if (void 0 !== t.sum) {
var i = t.sum;
void 0 !== i.total_bet && (this.bySessionBet_total_bet.string = cc.CORE.UTIL.abbreviateNumber(i.total_bet, 2));
void 0 !== i.total_refurn && (this.bySessionBet_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(i.total_refurn, 2));
void 0 !== i.total_fee && (this.bySessionBet_total_fee.string = cc.CORE.UTIL.abbreviateNumber(i.total_fee, 2));
if (void 0 !== i.total_win_real && void 0 !== i.total_lose) {
var a = i.total_win_real - i.total_lose > 0 ? "#00FF00" : i.total_win_real - i.total_lose == 0 ? "#FFFFFF" : "#FF0000";
this.bySessionBet_total_profit.string = (i.total_win_real - i.total_lose > 0 ? "+" : i.total_win_real - i.total_lose == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(i.total_win_real - i.total_lose), 2);
this.bySessionBet_total_profit.node.color = cc.color().fromHEX(a);
}
}
break;

case this.gameCategoryEnum.SICBO:
this.BET_DOOR_ENUM = {
small: "XỈU",
big: "TÀI",
sum_4: "TỔNG 4",
sum_5: "TỔNG 5",
sum_6: "TỔNG 6",
sum_7: "TỔNG 7",
sum_8: "TỔNG 8",
sum_9: "TỔNG 9",
sum_10: "TỔNG 10",
sum_11: "TỔNG 11",
sum_12: "TỔNG 12",
sum_13: "TỔNG 13",
sum_14: "TỔNG 14",
sum_15: "TỔNG 15",
sum_16: "TỔNG 16",
sum_17: "TỔNG 17",
triple_any: "BỘ BA BẤT KỲ",
triple_1: "BỘ BA 1",
triple_2: "BỘ BA 2",
triple_3: "BỘ BA 3",
triple_4: "BỘ BA 4",
triple_5: "BỘ BA 5",
triple_6: "BỘ BA 6",
double_1: "BỘ ĐÔI 1",
double_2: "BỘ ĐÔI 2",
double_3: "BỘ ĐÔI 3",
double_4: "BỘ ĐÔI 4",
double_5: "BỘ ĐÔI 5",
double_6: "BỘ ĐÔI 6",
single_1: "MẶT 1",
single_2: "MẶT 2",
single_3: "MẶT 3",
single_4: "MẶT 4",
single_5: "MẶT 5",
single_6: "MẶT 6",
pair_1_2: "CẶP 1-2",
pair_1_3: "CẶP 1-3",
pair_1_4: "CẶP 1-4",
pair_1_5: "CẶP 1-5",
pair_1_6: "CẶP 1-6",
pair_2_3: "CẶP 2-3",
pair_2_4: "CẶP 2-4",
pair_2_5: "CẶP 2-5",
pair_2_6: "CẶP 2-6",
pair_3_4: "CẶP 3-4",
pair_3_5: "CẶP 3-5",
pair_3_6: "CẶP 3-6",
pair_4_5: "CẶP 4-5",
pair_4_6: "CẶP 4-6",
pair_5_6: "CẶP 5-6"
};
if (null != t.data_bet) {
var c = t.data_bet, r = {};
c.forEach(function(t) {
var e = t.bet_door;
r[e] || (r[e] = {
fee: 0,
total_bet: 0,
total_refurn: 0,
total_win: 0,
total_lose: 0,
total_win_real: 0
});
r[e].fee += t.fee;
r[e].total_bet += t.total_bet;
r[e].total_refurn += t.total_refurn;
r[e].total_win += t.total_win;
r[e].total_lose += t.total_lose;
r[e].total_win_real += t.total_win_real;
});
Object.entries(r).forEach(function(o) {
var n = o[0], i = o[1], a = cc.instantiate(e.Sicbo_ItemBySessionBetPrefab), c = a.getComponent("Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller");
c.init(e);
c.session.string = "Phiên: #" + t.session + " - Bàn chơi: " + t.data_bet[0].room_code;
c.time.string = cc.CORE.UTIL.getStringDateByTime(t.session_data.session_time);
void 0 !== t.session_data.session_result && c.setResultDot(t.session_data.session_result);
c.bet_door.string = e.BET_DOOR_ENUM[n];
c.bet_door1.string = e.BET_DOOR_ENUM[n];
c.fee.string = cc.CORE.UTIL.abbreviateNumber(i.fee, 2);
c.total_bet.string = cc.CORE.UTIL.abbreviateNumber(i.total_bet, 2);
c.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(i.total_refurn, 2);
var r = 0;
i.total_win > 0 ? r = i.total_win_real : 0 == i.total_win && (r = -i.total_lose);
c.total_win.string = (r > 0 ? "+" : 0 == r ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(r), 2);
c.total_win.node.color = r > 0 ? cc.color().fromHEX("#00FF00") : 0 == r ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");
c.status.getComponent(cc.Sprite).spriteFrame = r > 0 ? e.sprite_status[0] : 0 == r ? e.sprite_status[2] : e.sprite_status[1];
e.listBySessionBetContent.addChild(a);
});
}
if (void 0 !== t.sum) {
var s = t.sum;
void 0 !== s.total_bet && (this.bySessionBet_total_bet.string = cc.CORE.UTIL.abbreviateNumber(s.total_bet, 2));
void 0 !== s.total_refurn && (this.bySessionBet_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(s.total_refurn, 2));
void 0 !== s.total_fee && (this.bySessionBet_total_fee.string = cc.CORE.UTIL.abbreviateNumber(s.total_fee, 2));
if (void 0 !== s.total_win_real && void 0 !== s.total_lose) {
var l = s.total_win_real - s.total_lose > 0 ? "#00FF00" : s.total_win_real - s.total_lose == 0 ? "#FFFFFF" : "#FF0000";
this.bySessionBet_total_profit.string = (s.total_win_real - s.total_lose > 0 ? "+" : s.total_win_real - s.total_lose == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(s.total_win_real - s.total_lose), 2);
this.bySessionBet_total_profit.node.color = cc.color().fromHEX(l);
}
}
}
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {
"days" == this.state_time && "view_by_session" == this.state_show ? this.btnBack.active = !1 : this.btnBack.active = "view_by_date" != this.state_show;
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Popup.History_Bet.Sicbo.ByDate.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "3296eKDx/ZJ0IQJKmQPnswN", "Lobby.Popup.History_Bet.Sicbo.ByDate.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label
},
init: function(t, e) {
this.CORE = t;
this.data = e;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
toggle: function() {},
onClickBet: function() {},
onClickViewDetail: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickViewSessionByDate(this.data);
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.History_Bet.Sicbo.BySession.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d0445khEydBtpYLvmt2yo0A", "Lobby.Popup.History_Bet.Sicbo.BySession.Item.Controller");
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
session: cc.Label,
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label,
dot_sprite: {
default: [],
type: cc.SpriteFrame
},
result_dot: {
default: [],
type: cc.Node
},
result_dot2: {
default: [],
type: cc.Node
}
},
init: function(t, e) {
this.CORE = t;
this.data = e;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
setResultDot: function(t) {
var e = this;
t.sort(function(t, e) {
return t - e;
});
this.result_dot.map(function(o, n) {
o.getComponent(cc.Sprite).spriteFrame = e.dot_sprite[t[n]];
});
},
toggle: function() {},
onClickBet: function() {},
onClickViewDetail: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickViewSessionBySession(this.data);
},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "c83acnEB+FC4qnBgBgpuixx", "Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller");
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
session: cc.Label,
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
bet_door: cc.Label,
bet_door1: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label,
dot_sprite: {
default: [],
type: cc.SpriteFrame
},
result_dot: {
default: [],
type: cc.Node
}
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
setResultDot: function(t) {
var e = this;
t.sort(function(t, e) {
return t - e;
});
this.result_dot.map(function(o, n) {
o.getComponent(cc.Sprite).spriteFrame = e.dot_sprite[t[n]];
});
},
toggle: function() {},
onClickBet: function() {},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Popup.History_Bet.Xocdia.ByDate.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "33967BCzm5Cyqrzqy1l5Dqk", "Lobby.Popup.History_Bet.Xocdia.ByDate.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label
},
init: function(t, e) {
this.CORE = t;
this.data = e;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
toggle: function() {},
onClickBet: function() {},
onClickViewDetail: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickViewSessionByDate(this.data);
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.History_Bet.Xocdia.BySession.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "1cc4f2XWSNGxq2uYz3n+Uvu", "Lobby.Popup.History_Bet.Xocdia.BySession.Item.Controller");
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
session: cc.Label,
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label,
dot_sprite: {
default: [],
type: cc.SpriteFrame
},
result_dot: {
default: [],
type: cc.Node
},
result_dot2: {
default: [],
type: cc.Node
}
},
init: function(t, e) {
this.CORE = t;
this.data = e;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
setResultDot: function(t) {
var e = this;
this.result_dot.map(function(o, n) {
o.getComponent(cc.Sprite).spriteFrame = t[n] ? e.dot_sprite[0] : e.dot_sprite[1];
});
this.result_dot2.map(function(o, n) {
o.getComponent(cc.Sprite).spriteFrame = t[n] ? e.dot_sprite[0] : e.dot_sprite[1];
});
},
toggle: function() {},
onClickBet: function() {},
onClickViewDetail: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickViewSessionBySession(this.data);
},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Popup.History_Bet.Xocdia.BySessionBet.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "90c51bznyFNZ49Ibt0x0Ope", "Lobby.Popup.History_Bet.Xocdia.BySessionBet.Item.Controller");
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
session: cc.Label,
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
bet_door: cc.Label,
bet_door1: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label,
dot_sprite: {
default: [],
type: cc.SpriteFrame
},
result_dot: {
default: [],
type: cc.Node
}
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
setResultDot: function(t) {
var e = this;
this.result_dot.map(function(o, n) {
o.getComponent(cc.Sprite).spriteFrame = t[n] ? e.dot_sprite[0] : e.dot_sprite[1];
});
},
toggle: function() {},
onClickBet: function() {},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Popup.History_Finan.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "5ef1bOUmJlKgLCVYcyeJB9x", "Lobby.Popup.History_Finan.Controller");
var o, n = t("AssetManager"), i = t("HttpRequest"), a = t("LocalStorage");
cc.Class(((o = {
extends: cc.Component,
properties: {
listContent: cc.Node,
ItemPrefab: cc.Prefab,
pagination: cc.Node
},
init: function() {
var t = this;
this.CORE = this;
this.STATUS_TEXT_ENUM = {
pending: "Đang cập nhật",
success: "Hoàn tất",
error: "Thất bại",
processing: "Đang xử lý",
timeout: "Hết hạn",
error_exception: "Lỗi hệ thống"
};
this.STATUS_COLOR_ENUM = {
pending: "#00FF3D",
success: "#00FF3D",
error: "#FF0000",
processing: "#FFB800",
timeout: "#FF0000",
error_exception: "#FF0000"
};
n.loadFromBundle("Common_Bundle", "Prefabs/Pagination", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
t.pagination.addChild(o);
t.pagination = o.getComponent("Pagination");
t.pagination.init(t);
}).catch(function(t) {
return console.log("❌ Error loading:", t);
});
},
onLoad: function() {}
}).onLoad = function() {}, o.onEnable = function() {
this.getDataPage(1);
}, o.getDataPage = function(t, e) {
var o = this;
void 0 === e && (e = 5);
i.Get(cc.CORE.CONFIG.SERVER_API + "/payment/finance-list", {
page: t,
limit: e,
fields: "id, gate_name,regAmount,recAmount,actAmount,status,createdAt,bank_code,feeAmount,feePercent,gate_type,transaction_id,transaction_type"
}, {
Authorization: "Bearer " + a.getItem("access_token")
}).then(function(t) {
0 == t.error_code && o.onData(t.data);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
}, o.onRefresh = function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.getDataPage(1);
}, o.onData = function(t) {
var e = this;
this.listContent.removeAllChildren();
null != t.result && t.result.forEach(function(t) {
var o = cc.instantiate(e.ItemPrefab), n = o.getComponent("Lobby.Popup.History_Finan.Item.Controller");
n.init(e, t);
n.time.string = "Thời gian: " + cc.CORE.UTIL.getStringDateByTimeNoYear(t.createdAt);
var i = "";
"deposit" == t.transaction_type && (i = "Nạp " + t.gate_name.toUpperCase());
"withdraw" == t.transaction_type && (i = "Rút " + t.gate_name.toUpperCase());
n.gate_name.string = i;
var a = e.STATUS_TEXT_ENUM[t.status], c = e.STATUS_COLOR_ENUM[t.status];
n.status.string = a;
n.status.node.color = cc.color().fromHEX(c);
n.setStatusIcon(t.status);
n.amount.string = cc.CORE.UTIL.numberWithCommas(t.regAmount);
n.fee.string = "Phí: " + cc.CORE.UTIL.numberWithCommas(t.feeAmount) + " - (" + t.feePercent + "%)";
e.listContent.addChild(o);
});
if (void 0 !== t.total && void 0 !== t.page && void 0 !== t.limit) {
var o = t;
this.pagination.onSet(o.page, o.limit, o.total);
}
}, o.onClickItem = function(t) {
cc.log(t);
}, o.toggle = function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
}, o.update = function() {}, o));
cc._RF.pop();
}, {
AssetManager: void 0,
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.History_Finan.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "f2b6fAbsPFJFpEJMGoAC7Bl", "Lobby.Popup.History_Finan.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
gate_name: cc.Label,
time: cc.Label,
amount: cc.Label,
fee: cc.RichText,
status: cc.Label,
status_icons: {
default: [],
type: cc.Node
}
},
init: function(t) {
this.CORE = t;
this.data = null;
},
setStatusIcon: function(t) {
this.status_icons.forEach(function(e) {
e.active = e.name == t;
});
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
onClickItem: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickItem(this.data);
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
onClickBet: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.History_Tip.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "34401UH1/JMIKbSQKn6HNsw", "Lobby.Popup.History_Tip.Controller");
var o, n = t("AssetManager"), i = t("HttpRequest"), a = t("LocalStorage");
cc.Class(((o = {
extends: cc.Component,
properties: {
listContent: cc.Node,
ItemPrefab: cc.Prefab,
pagination: cc.Node
},
init: function() {
var t = this;
this.CORE = this;
this.STATUS_TEXT_ENUM = {
pending: "Đang cập nhật",
success: "Hoàn tất",
error: "Thất bại",
processing: "Đang xử lý",
timeout: "Hết hạn",
error_exception: "Lỗi hệ thống"
};
this.STATUS_COLOR_ENUM = {
pending: "#00FF3D",
success: "#00FF3D",
error: "#FF0000",
processing: "#FFB800",
timeout: "#FF0000",
error_exception: "#FF0000"
};
this.GAME_NAME_ENUM = {
xocdia: "Xóc Đĩa",
taixiu: "Tài Xỉu",
bongda: "Bóng Đá",
xoso: "Xổ Số"
};
n.loadFromBundle("Common_Bundle", "Prefabs/Pagination", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
t.pagination.addChild(o);
t.pagination = o.getComponent("Pagination");
t.pagination.init(t);
}).catch(function(t) {
return console.log("❌ Error loading:", t);
});
},
onLoad: function() {}
}).onLoad = function() {}, o.onEnable = function() {
this.getDataPage(1);
}, o.getDataPage = function(t, e) {
var o = this;
void 0 === e && (e = 5);
i.Get(cc.CORE.CONFIG.SERVER_API + "/tip/tip-list", {
page: t,
limit: e
}, {
Authorization: "Bearer " + a.getItem("access_token")
}).then(function(t) {
0 == t.error_code && o.onData(t.data);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
}, o.onRefresh = function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.getDataPage(1);
}, o.onData = function(t) {
var e = this;
this.listContent.removeAllChildren();
null != t.result && t.result.forEach(function(t) {
var o = cc.instantiate(e.ItemPrefab), n = o.getComponent("Lobby.Popup.History_Tip.Item.Controller");
n.init(e, t);
n.time.string = cc.CORE.UTIL.getStringDateByTimeNoYear(t.createdAt);
n.game.string = e.GAME_NAME_ENUM[t.game_name];
n.room.string = t.room_code;
n.session.string = "#" + t.session;
n.amount.string = cc.CORE.UTIL.numberWithCommas(t.amount, 2);
e.listContent.addChild(o);
});
if (void 0 !== t.total && void 0 !== t.page && void 0 !== t.limit) {
var o = t;
this.pagination.onSet(o.page, o.limit, o.total);
}
}, o.onClickItem = function(t) {
cc.log(t);
}, o.toggle = function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
}, o.update = function() {}, o));
cc._RF.pop();
}, {
AssetManager: void 0,
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.History_Tip.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "3bc49gC14RP8IN4ndSYhSps", "Lobby.Popup.History_Tip.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
time: cc.Label,
amount: cc.Label,
game: cc.Label,
room: cc.Label,
session: cc.Label
},
init: function(t) {
this.CORE = t;
this.data = null;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
onClickItem: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickItem(this.data);
},
toggle: function() {},
onClickBet: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.History_Transfer.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "cdf18LgKEZD5rrEqGHBBnJF", "Lobby.Popup.History_Transfer.Controller");
var o, n = t("AssetManager"), i = t("HttpRequest"), a = t("LocalStorage");
cc.Class(((o = {
extends: cc.Component,
properties: {
listContent: cc.Node,
ItemPrefab: cc.Prefab,
pagination: cc.Node
},
init: function() {
var t = this;
this.CORE = this;
this.STATUS_TEXT_ENUM = {
pending: "Đang cập nhật",
success: "Hoàn tất",
error: "Thất bại",
processing: "Đang xử lý",
timeout: "Hết hạn",
error_exception: "Lỗi hệ thống"
};
this.STATUS_COLOR_ENUM = {
pending: "#00FF3D",
success: "#00FF3D",
error: "#FF0000",
processing: "#FFB800",
timeout: "#FF0000",
error_exception: "#FF0000"
};
n.loadFromBundle("Common_Bundle", "Prefabs/Pagination", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
t.pagination.addChild(o);
t.pagination = o.getComponent("Pagination");
t.pagination.init(t);
}).catch(function(t) {
return console.log("❌ Error loading:", t);
});
},
onLoad: function() {}
}).onLoad = function() {}, o.onEnable = function() {
this.getDataPage(1);
}, o.getDataPage = function(t, e) {
var o = this;
void 0 === e && (e = 5);
i.Get(cc.CORE.CONFIG.SERVER_API + "/transfer/transfer-list", {
page: t,
limit: e
}, {
Authorization: "Bearer " + a.getItem("access_token")
}).then(function(t) {
0 == t.error_code && o.onData(t.data);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
}, o.onRefresh = function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.getDataPage(1);
}, o.onData = function(t) {
var e = this;
this.listContent.removeAllChildren();
null != t.result && t.result.forEach(function(t) {
var o = cc.instantiate(e.ItemPrefab), n = o.getComponent("Lobby.Popup.History_Transfer.Item.Controller");
n.init(e, t);
n.time.string = "Thời gian: " + cc.CORE.UTIL.getStringDateByTime(t.createdAt);
n.username.string = t.receiver_nickname;
var i = e.STATUS_TEXT_ENUM[t.status], a = e.STATUS_COLOR_ENUM[t.status];
n.status.string = i;
n.status.node.color = cc.color().fromHEX(a);
n.setStatusIcon(t.status);
n.amount.string = cc.CORE.UTIL.numberWithCommas(t.amount);
e.listContent.addChild(o);
});
if (void 0 !== t.total && void 0 !== t.page && void 0 !== t.limit) {
var o = t;
this.pagination.onSet(o.page, o.limit, o.total);
}
}, o.onClickItem = function(t) {
cc.log(t);
}, o.toggle = function() {
this.node.active = !this.node.active;
}, o.update = function() {}, o));
cc._RF.pop();
}, {
AssetManager: void 0,
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.History_Transfer.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "69e55hQm/tHIK5BoxFsdfwN", "Lobby.Popup.History_Transfer.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
time: cc.Label,
amount: cc.Label,
status: cc.Label,
status_icons: {
default: [],
type: cc.Node
}
},
init: function(t) {
this.CORE = t;
this.data = null;
},
setStatusIcon: function(t) {
this.status_icons.forEach(function(e) {
e.active = e.name == t;
});
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {},
onClickItem: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickItem(this.data);
},
toggle: function() {},
onClickBet: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Inbox.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "91215HVf2VMwannUm0Us3UE", "Lobby.Popup.Inbox.Controller");
function o(t, e) {
var o = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (o) return (o = o.call(t)).next.bind(o);
if (Array.isArray(t) || (o = n(t)) || e && t && "number" == typeof t.length) {
o && (t = o);
var i = 0;
return function() {
return i >= t.length ? {
done: !0
} : {
done: !1,
value: t[i++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function n(t, e) {
if (t) {
if ("string" == typeof t) return i(t, e);
var o = Object.prototype.toString.call(t).slice(8, -1);
"Object" === o && t.constructor && (o = t.constructor.name);
return "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? i(t, e) : void 0;
}
}
function i(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var o = 0, n = new Array(e); o < e; o++) n[o] = t[o];
return n;
}
cc.Class({
extends: cc.Component,
properties: {
header: cc.Node,
listInboxNode: cc.Node,
listInboxContent: cc.Node,
listInboxContentItem: cc.Prefab,
showInboxNode: cc.Node,
showInboxTitle: cc.RichText,
showInboxTime: cc.Label,
showInboxFrom: cc.Label,
showInboxContent: cc.RichText,
emptyInbox: cc.Node
},
init: function(t) {
this.CORE = t;
this.tabShow = "news";
},
onLoad: function() {},
onEnable: function() {
this.emptyInbox.active = !0;
this.listInboxContent.removeAllChildren();
this.listInboxNode.active = !0;
this.showInboxNode.active = !1;
this.getData("news");
},
getData: function(t, e) {
void 0 === t && (t = "news");
void 0 === e && (e = 30);
this.listInboxContent.removeAllChildren();
this.listInboxNode.active = !0;
this.showInboxNode.active = !1;
this.emptyInbox.active = !0;
var o = {
event: "inbox",
data: {
get_list: {
type: t,
limit: e
}
}
};
cc.CORE.NETWORK.APP.Send(o);
},
wrapText: function(t) {
for (var e, n = [], i = "", a = !1, c = o(t.split(" ")); !(e = c()).done; ) {
var r = e.value;
if ((i + (i ? " " : "") + r).length <= 40) i += (i ? " " : "") + r; else {
if (i) {
n.push(i);
a = !0;
}
i = r;
}
}
i && n.push(i);
return {
text: n.join("\n"),
isWrapped: a
};
},
onData: function(t) {
var e = this;
if (void 0 !== t.get_list) {
var o = t.get_list;
this.emptyInbox.active = !(o.length > 0);
o.forEach(function(t) {
var o, n, i = cc.instantiate(e.listInboxContentItem), a = i.getComponent("Lobby.Popup.Inbox.Item.Controller");
a.init(e, t);
a.title.string = t.title;
a.time.string = cc.CORE.UTIL.getStringDateByTime(t.createdAt);
a.from.string = "inbox" == e.tabShow ? null == t ? void 0 : null == (o = t.from_username) ? void 0 : o.toUpperCase() : null == t ? void 0 : null == (n = t.admin_username) ? void 0 : n.toUpperCase();
"inbox" == e.tabShow && (a.new_icon.active = !t.seen);
"news" == e.tabShow && (a.new_icon.active = !1);
e.listInboxContent.addChild(i);
});
}
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
onSelectHeader: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.header.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.getData(e);
this.tabShow = e;
},
onRemoveInbox: function(t) {
var e = this, o = {
event: "inbox",
data: {
remove: {
id: t.id
}
}
};
cc.CORE.NETWORK.APP.Send(o);
setTimeout(function() {
e.getData(e.tabShow);
}, 300);
},
onClickViewInbox: function(t) {
var e, o;
if ("inbox" == this.tabShow) {
var n = {
event: "inbox",
data: {
view: {
id: t.id
}
}
};
setTimeout(function() {
cc.CORE.NETWORK.APP.UTIL.GetCountNewInbox();
}, 500);
cc.CORE.NETWORK.APP.Send(n);
}
this.listInboxNode.active = !1;
this.showInboxNode.active = !0;
this.showInboxTitle.string = t.title;
this.showInboxTime.string = cc.CORE.UTIL.getStringDateByTime(t.createdAt);
this.showInboxFrom.string = "inbox" == this.tabShow ? null == t ? void 0 : null == (e = t.from_username) ? void 0 : e.toUpperCase() : null == t ? void 0 : null == (o = t.admin_username) ? void 0 : o.toUpperCase();
this.showInboxContent.string = t.content;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Inbox.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "06ddegr6QZJ2pl9nEVMNwEN", "Lobby.Popup.Inbox.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
title: cc.RichText,
time: cc.Label,
from: cc.Label,
new_icon: cc.Node
},
init: function(t, e) {
void 0 === e && (e = {});
this.CORE = t;
this.data = e;
},
onLoad: function() {},
onEnable: function() {},
onClickRemove: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onRemoveInbox(this.data);
},
onClickView: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickViewInbox(this.data);
}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.New_Member.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "379e8msovJJGo0yQkIRs9jK", "Lobby.Popup.New_Member.Controller");
t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {},
onEnable: function() {},
init: function(t) {
this.CORE = t;
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
setShow: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
comingSoon: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.GAME_SCENCE.FastNotify("Sự kiện này sẽ sớm được ra mắt!", "info", 1);
}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Lobby.Popup.Payment.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "4c16e/rSXRP4aUD+w90cOdp", "Lobby.Popup.Payment.Controller");
var o = t("HttpRequest"), n = t("LocalStorage"), i = t("Lobby.Popup.Payment.Deposit.Controller"), a = t("Lobby.Popup.Payment.Withdraw.Controller");
cc.Class({
extends: cc.Component,
properties: {
sound_open: {
default: null,
type: cc.AudioSource
},
headerPaymentType: cc.Node,
bodyPaymentType: cc.Node,
Deposit: i,
Withdraw: a,
maintanceNode: cc.Node,
loadingNode: cc.Node
},
init: function(t) {
this.CORE = t;
this.is_loaded_bank_support = !1;
this.is_loaded_user_bank_account = !1;
this.bank_support_data = null;
this.tabShow = "deposit";
},
onLoad: function() {
this.Deposit.init(this);
this.Withdraw.init(this);
},
onEnable: function() {
cc.CORE.AUDIO.playSound(this.sound_open);
this.getConfig();
this.getBankSupport();
this.getUserBankAccount();
},
onSelectHeaderPaymentType: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.headerPaymentType.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.bodyPaymentType.children.forEach(function(t) {
t.active = t.name == e;
});
this.tabShow = e.toLowerCase();
this.getUserBankAccount();
},
getConfig: function() {
var t = this;
o.Get(cc.CORE.CONFIG.SERVER_API + "/payment/deposit/config", {}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
var o = e.data;
t.Deposit.config = o;
t.Deposit.onSelectheaderGateType({
target: {
name: t.Deposit.tabShow
}
});
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
o.Get(cc.CORE.CONFIG.SERVER_API + "/payment/withdraw/config", {}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
var o = e.data;
t.Withdraw.config = o;
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
getBankSupport: function() {
var t = this;
this.is_loaded_bank_support || o.Get(cc.CORE.CONFIG.SERVER_API + "/payment/bank-support-list", {}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
t.is_loaded_bank_support = !0;
t.bank_support_data = e.data;
}
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
getUserBankAccount: function() {
var t = this;
o.Get(cc.CORE.CONFIG.SERVER_API + "/payment/user-bank-accounts", {}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
t.is_loaded_user_bank_account = !0;
t.Withdraw.Bank.form_add_bank_node.active = !1;
t.Withdraw.Bank.form_withdraw_bank_node.active = !0;
if (e.data && e.data.bank_account_number) {
t.Withdraw.Bank.bank_account_number.string = e.data.bank_account_number;
t.Withdraw.Bank.bank_account_name.string = e.data.bank_account_name;
t.Withdraw.Bank.bank_select.string = cc.CORE.UTIL.cutText(e.data.bank_data.short_name + " - " + e.data.bank_data.name, 20);
t.Withdraw.Bank.bank_select_data = e.data.bank_data;
} else {
console.error("USER_BANK_ACCOUNT data is invalid or missing");
t.Withdraw.Bank.form_add_bank_node.active = !0;
t.Withdraw.Bank.form_withdraw_bank_node.active = !1;
}
} else {
t.Withdraw.Bank.form_add_bank_node.active = !0;
t.Withdraw.Bank.form_withdraw_bank_node.active = !1;
}
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
onClickShowHistory: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.toggle();
this.CORE.show("history_finan");
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
"Lobby.Popup.Payment.Deposit.Controller": "Lobby.Popup.Payment.Deposit.Controller",
"Lobby.Popup.Payment.Withdraw.Controller": "Lobby.Popup.Payment.Withdraw.Controller",
LocalStorage: void 0
} ],
"Lobby.Popup.Payment.Deposit.Bank.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "08f7b4DH1tAjImkcN7OoRLh", "Lobby.Popup.Payment.Deposit.Bank.Controller");
var o = t("HttpRequest"), n = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
request_Node: cc.Node,
inputAmount: cc.EditBox,
amountSuggestNode: cc.Node,
response_Node: cc.Node,
resp_amount: cc.Label,
resp_bank: cc.Label,
resp_bank_account_name: cc.Label,
resp_bank_account_number: cc.Label,
resp_bank_content: cc.Label,
resp_qr_sprite: cc.Sprite
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {
this.request_Node.active = !0;
this.response_Node.active = !1;
this.inputAmount.string = "";
this.amountSuggestNode.children.forEach(function(t) {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
});
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
this.amountSuggestNode.children.forEach(function(e) {
if (e.name == cc.CORE.UTIL.getOnlyNumberInString(t)) {
e.getChildByName("active").active = !0;
e.getChildByName("none").active = !1;
} else {
e.getChildByName("active").active = !1;
e.getChildByName("none").active = !0;
}
});
},
onClickAmountSuggest: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.inputAmount.string = cc.CORE.UTIL.numberWithCommas(e);
this.amountSuggestNode.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
},
clean: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.inputAmount.string = "";
this.amountSuggestNode.children.forEach(function(t) {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
});
},
onClickCopyStk: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.UTIL.copyToClipboard(this.resp_bank_account_number.string);
cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, !0);
},
onClickCopyContent: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.UTIL.copyToClipboard(this.resp_bank_content.string);
cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, !0);
},
onClickSubmit: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
var e = this.CORE.config.bank.auto.config;
if (0 == cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập số tiền!", "info", 1, 1, !0);
if (e.min > cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là " + cc.CORE.UTIL.numberWithCommas(e.min) + "!", "info", 1, 1, !0);
if (e.max < cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối đa là " + cc.CORE.UTIL.numberWithCommas(e.max) + "!", "info", 1, 1, !0);
var i = {
amount: Number(cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string))
};
this.CORE.CORE.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/payment/deposit/bank-auto", {}, i, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "success", 1, 1, !0);
var o = e.data;
t.resp_bank.string = cc.CORE.UTIL.cutText("" + o.bank_code.toUpperCase(), 21);
t.resp_bank_account_name.string = o.bank_account_name;
t.resp_bank_account_number.string = o.bank_account_number;
t.resp_bank_content.string = o.bank_content;
null != o.qr_data && cc.CORE.UTIL.LoadImgFromUrl(t.resp_qr_sprite, o.qr_data, null, null, "png");
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.AUDIO.playSound(t.CORE.CORE.sound_open);
t.request_Node.active = !1;
t.response_Node.active = !0;
} else {
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}
}).catch(function(e) {
t.CORE.CORE.loadingNode.active = !1;
console.log(e);
return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, !0);
});
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Payment.Deposit.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "9d7db7jb91LLrjjncUVAxqF", "Lobby.Popup.Payment.Deposit.Controller");
var o = t("Lobby.Popup.Payment.Deposit.Bank.Controller"), n = t("Lobby.Popup.Payment.Deposit.QrCode.Controller"), i = t("Lobby.Popup.Payment.Deposit.Usdt.Controller");
cc.Class({
extends: cc.Component,
properties: {
headerGateType: cc.Node,
bodyGateType: cc.Node,
Bank: o,
QrCode: n,
Usdt: i
},
init: function(t) {
this.CORE = t;
this.config = null;
this.tabShow = "BANK";
},
onLoad: function() {
this.Bank.init(this);
this.QrCode.init(this);
this.Usdt.init(this);
},
onEnable: function() {},
onSelectheaderGateType: function(t) {
var e = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (null != this.config) {
var o = t.target.name;
this.headerGateType.children.forEach(function(t) {
if (t.name == o) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.bodyGateType.children.forEach(function(t) {
if (t.name == o) try {
if ("active" == e.config[o.toLowerCase()].auto.config.status) {
t.active = !0;
e.CORE.maintanceNode.active = !1;
} else {
t.active = !1;
e.CORE.maintanceNode.active = !0;
}
} catch (t) {
console.log(t);
} else t.active = !1;
});
this.tabShow = o;
}
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
"Lobby.Popup.Payment.Deposit.Bank.Controller": "Lobby.Popup.Payment.Deposit.Bank.Controller",
"Lobby.Popup.Payment.Deposit.QrCode.Controller": "Lobby.Popup.Payment.Deposit.QrCode.Controller",
"Lobby.Popup.Payment.Deposit.Usdt.Controller": "Lobby.Popup.Payment.Deposit.Usdt.Controller"
} ],
"Lobby.Popup.Payment.Deposit.QrCode.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "1d618A8qyFPNKUhd1RtgP3u", "Lobby.Popup.Payment.Deposit.QrCode.Controller");
var o = t("HttpRequest"), n = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
request_Node: cc.Node,
inputAmount: cc.EditBox,
amountSuggestNode: cc.Node,
response_Node: cc.Node,
resp_amount: cc.Label,
resp_bank: cc.Label,
resp_bank_account_name: cc.Label,
resp_bank_account_number: cc.Label,
resp_bank_content: cc.Label,
resp_qr_sprite: cc.Sprite
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
this.inputAmount.string = "";
},
onDisable: function() {
this.request_Node.active = !0;
this.response_Node.active = !1;
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
onClickAmountSuggest: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.inputAmount.string = cc.CORE.UTIL.numberWithCommas(e);
this.amountSuggestNode.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
},
clean: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.inputAmount.string = "";
this.amountSuggestNode.children.forEach(function(t) {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
});
},
onClickCopyStk: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.UTIL.copyToClipboard(this.resp_bank_account_number.string);
cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, !0);
},
onClickCopyContent: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.UTIL.copyToClipboard(this.resp_bank_content.string);
cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, !0);
},
onClickSubmit: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
var e = this.CORE.config.qrcode.auto.config;
if (0 == cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập số tiền!", "info", 1, 1, !0);
if (e.min > cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là " + cc.CORE.UTIL.numberWithCommas(e.min) + "!", "info", 1, 1, !0);
if (e.max < cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối đa là " + cc.CORE.UTIL.numberWithCommas(e.max) + "!", "info", 1, 1, !0);
var i = {
amount: Number(cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string))
};
this.CORE.CORE.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/payment/deposit/bank-auto", {}, i, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "success", 1, 1, !0);
var o = e.data;
t.resp_bank.string = cc.CORE.UTIL.cutText(o.bank_code.toUpperCase() + " - " + o.bank, 21);
t.resp_bank_account_name.string = o.bank_account_name;
t.resp_bank_account_number.string = o.bank_account_number;
t.resp_bank_content.string = o.bank_content;
null != o.qr_data && cc.CORE.UTIL.LoadImgFromUrl(t.resp_qr_sprite, o.qr_data, null, null, "png");
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.AUDIO.playSound(t.CORE.CORE.sound_open);
t.request_Node.active = !1;
t.response_Node.active = !0;
} else {
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}
}).catch(function(e) {
t.CORE.CORE.loadingNode.active = !1;
console.log(e);
return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, !0);
});
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Payment.Deposit.Usdt.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d6ff80sai1Kk4VYn3tZ2NXB", "Lobby.Popup.Payment.Deposit.Usdt.Controller");
var o = t("HttpRequest"), n = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
headerNetworkType: cc.Node,
exchageCurrent: cc.Label,
inputAmount: cc.EditBox,
inputExchange: cc.Label,
resp_network: cc.Label,
resp_wallet_address: cc.Label,
resp_qr_sprite: cc.Sprite
},
init: function(t) {
this.CORE = t;
this.config = null;
this.exchange_rate = 0;
this.network = "eth";
},
onLoad: function() {},
onEnable: function() {
this.getUsdtAddress();
},
onDisable: function() {
this.inputAmount.string = "0";
this.inputExchange.string = "0";
},
onMaintain: function() {
cc.CORE.GAME_SCENCE.FastNotify("Phương thức đang bảo trì!", "error", 1, 1, !0);
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
onChangerExchange: function(t) {
void 0 === t && (t = 0);
var e = Number(cc.CORE.UTIL.getOnlyNumberInString(t)) * this.exchange_rate;
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputExchange.string = cc.CORE.UTIL.numberWithCommas(e);
},
onSelectHeaderNetworkType: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
var e = t.target.name;
this.headerNetworkType.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.network = e.toLowerCase();
this.resp_NETWORK.APP.string = "Ví nhận (" + e.toUpperCase() + ")";
this.getUsdtAddress();
},
clean: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.inputAmount.string = "0";
this.inputExchange.string = "0";
},
onClickCopyStk: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.UTIL.copyToClipboard(this.resp_wallet_address.string);
cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, !0);
},
getUsdtAddress: function() {
var t = this, e = {
network: this.network
};
this.CORE.CORE.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/payment/deposit/usdt-auto", {}, e, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "success", 1, 1, !0);
var o = e.data;
t.resp_wallet_address.string = o.address;
null != o.qr_image && cc.CORE.UTIL.LoadImgFromBase64(t.resp_qr_sprite, o.qr_image);
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.AUDIO.playSound(t.CORE.CORE.sound_open);
} else {
t.CORE.CORE.loadingNode.active = !1;
t.resp_wallet_address.string = e.error_message;
t.resp_qr_sprite.spriteFrame = null;
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}
}).catch(function(e) {
t.CORE.CORE.loadingNode.active = !1;
t.resp_wallet_address.string = result.error_message;
t.resp_qr_sprite.spriteFrame = null;
console.log(e);
return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, !0);
});
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {
if (null != this.CORE.config) {
this.config = this.CORE.config.usdt.auto.config;
if (null != this.config.exchange_rate) {
this.exchange_rate = this.config.exchange_rate;
this.exchageCurrent.string = cc.CORE.UTIL.numberWithCommas(this.exchange_rate);
}
}
}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Payment.Withdraw.Bank.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "0085cU57E9KHY7FDvmko+7V", "Lobby.Popup.Payment.Withdraw.Bank.Controller");
var o = t("HttpRequest"), n = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
form_add_bank_node: cc.Node,
form_withdraw_bank_node: cc.Node,
add_bank_select: cc.Label,
add_bank_account_number: cc.EditBox,
add_bank_account_name: cc.EditBox,
add_more_bank_node: cc.Node,
add_bankSupportListContent: cc.Node,
current_amount: cc.Label,
bank_select: cc.Label,
bank_account_number: cc.EditBox,
bank_account_name: cc.EditBox,
amount: cc.EditBox,
more_bank_node: cc.Node,
otp: cc.EditBox,
bankSupportListContent: cc.Node,
itemBankSelectPrefab: cc.Prefab
},
init: function(t) {
this.CORE = t;
this.config = null;
this.is_set_list_bank_support = !1;
this.bank_select_data = null;
this.add_bank_select_data = null;
},
onLoad: function() {},
onEnable: function() {
this.current_amount.string = cc.CORE.UTIL.numberWithCommas(cc.CORE.USER.balance);
},
onDisable: function() {
this.clean();
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.amount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.amount.string);
},
onChangerBankAccountName: function(t) {
void 0 === t && (t = "");
t = cc.CORE.UTIL.nonAccentVietnamese(t.trim());
this.bank_account_name.string = "" == t ? "" : t.toUpperCase();
this.add_bank_account_name.string = "" == t ? "" : t.toUpperCase();
},
setListBankSupport: function(t) {
var e = this;
t.forEach(function(t) {
if ("bank" === t.gate_name && "active" === t.status && !0 === t.allow_withdraw) {
var o = cc.instantiate(e.itemBankSelectPrefab), n = o.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
n.init(e, t, "withdraw");
n.txt_bank_name.string = cc.CORE.UTIL.cutText(t.short_name + " - " + t.name, 25);
e.bankSupportListContent.addChild(o);
var i = cc.instantiate(e.itemBankSelectPrefab), a = i.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
a.init(e, t, "add");
a.txt_bank_name.string = cc.CORE.UTIL.cutText(t.short_name + " - " + t.name, 25);
e.add_bankSupportListContent.addChild(i);
}
});
},
onUniqueSelectActive: function(t, e) {
"withdraw" === e && this.bankSupportListContent.children.forEach(function(e) {
e.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller").bg_active.active = e.name === t;
});
"add" === e && this.add_bankSupportListContent.children.forEach(function(e) {
e.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller").bg_active.active = e.name === t;
});
},
onSelectBank: function(t, e) {
this.onUniqueSelectActive(t.code, e);
if ("withdraw" === e) {
this.bank_select_data = t;
this.bank_select.string = cc.CORE.UTIL.cutText(t.short_name + " - " + t.name, 20);
this.toggleMoreBank();
}
if ("add" === e) {
this.add_bank_select_data = t;
this.add_bank_select.string = cc.CORE.UTIL.cutText(t.short_name + " - " + t.name, 20);
this.add_toggleMoreBank();
}
},
clean: function() {
this.bank_select.string = "Chọn ngân hàng";
this.bank_account_number.string = "";
this.bank_account_name.string = "";
this.amount.string = "";
this.onUniqueSelectActive(null, "withdraw");
this.add_bank_select_data = null;
this.add_bank_select.string = "Chọn ngân hàng";
this.add_bank_account_number.string = "";
this.add_bank_account_name.string = "";
this.onUniqueSelectActive(null, "add");
},
cleanStk: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.bank_account_number.string = "";
this.add_bank_account_number.string = "";
},
cleanAccountName: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.bank_account_name.string = "";
this.add_bank_account_name.string = "";
},
cleanAmount: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.amount.string = "";
},
toggleMoreBank: function() {
this.more_bank_node.active = !this.more_bank_node.active;
},
add_toggleMoreBank: function() {
this.add_more_bank_node.active = !this.add_more_bank_node.active;
},
onClickGetOtp: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.NETWORK.APP.Send({
event: "security",
data: {
get_otp: {
action: "withdraw"
}
}
});
},
onClickSubmit: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
var e = Number(cc.CORE.UTIL.getOnlyNumberInString(this.amount.string)), i = this.bank_account_number.string.trim(), a = this.bank_account_name.string.trim(), c = this.otp.string;
console.log(e, i, a, this.bank_select_data, c);
if ("" == e || "" == i || "" == a || !this.bank_select_data) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập đủ thông tin", "error", 1, 1, !0);
if (a.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên chủ tài khoản không hợp lệ", "error", 1, 1, !0);
if (i.length < 3) return cc.CORE.GAME_SCENCE.FastNotify("Số tài khoản không hợp lệ", "error", 1, 1, !0);
var r = this.CORE.config.bank.manual.config;
if (e < r.min) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là " + cc.CORE.UTIL.numberWithCommas(r.min) + "!", "info", 1, 1, !0);
if (e > r.max) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối đa là " + cc.CORE.UTIL.numberWithCommas(r.max) + "!", "info", 1, 1, !0);
if (c.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, !0);
var s = {
amount: e,
bank_account_number: i,
bank_account_name: a,
bank_code: this.bank_select_data.code,
bank_select_data: this.bank_select_data,
otp: Number(c)
};
this.CORE.CORE.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/payment/withdraw/bank-manual", {}, s, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "success", 1, 1, !0);
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.AUDIO.playSound(t.CORE.CORE.sound_open);
} else {
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}
}).catch(function(e) {
t.CORE.CORE.loadingNode.active = !1;
console.log(e);
return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, !0);
});
},
onClickAddBank: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
var e = this.add_bank_account_number.string.trim(), i = this.add_bank_account_name.string.trim();
if ("" == this.add_bank_account_number.string || "" == this.add_bank_account_name.string || !this.add_bank_select_data) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập đủ thông tin", "error", 1, 1, !0);
if (i.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên chủ tài khoản không hợp lệ", "error", 1, 1, !0);
if (e.length < 3) return cc.CORE.GAME_SCENCE.FastNotify("Số tài khoản không hợp lệ", "error", 1, 1, !0);
var a = {
bank_data: this.add_bank_select_data,
bank_id: this.add_bank_select_data.id,
bank_account_number: e,
bank_account_name: i
};
this.CORE.CORE.loadingNode.active = !0;
o.Post(cc.CORE.CONFIG.SERVER_API + "/payment/user-bank-accounts", {}, a, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(e) {
if (0 == e.error_code) {
cc.CORE.GAME_SCENCE.FastNotify("Cập nhật thành công!", "success", 1, 1, !0);
t.CORE.CORE.loadingNode.active = !1;
t.form_add_bank_node.active = !1;
t.form_withdraw_bank_node.active = !0;
if (e.data && e.data.bank_account_number) {
t.bank_account_number.string = e.data.bank_account_number;
t.bank_account_name.string = e.data.bank_account_name;
t.bank_select.string = cc.CORE.UTIL.cutText(e.data.bank_data.short_name + " - " + e.data.bank_data.name, 20);
t.bank_select_data = e.data.bank_data;
} else {
console.error("USER_BANK_ACCOUNT data is invalid or missing");
t.form_add_bank_node.active = !0;
t.form_withdraw_bank_node.active = !1;
}
} else {
t.CORE.CORE.loadingNode.active = !1;
cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}
}).catch(function(e) {
t.CORE.CORE.loadingNode.active = !1;
console.log(e);
return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, !0);
});
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {
null != cc.CORE.USER.balance && (this.current_amount.string = cc.CORE.UTIL.numberWithCommas(cc.CORE.USER.balance));
if ((null != this.CORE.CORE.bank_support_data || this.is_set_list_bank_support) && !this.is_set_list_bank_support) {
var t = this.CORE.CORE.bank_support_data;
this.is_set_list_bank_support = !0;
this.setListBankSupport(t);
}
}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Payment.Withdraw.Bank.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "248e5yE9EhAhKKwE7megX1O", "Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
bg_active: cc.Node,
txt_bank_name: cc.Label
},
init: function(t, e, o) {
this.CORE = t;
this.data = e;
this.type = o;
this.node.name = e.code;
},
onLoad: function() {},
onEnable: function() {},
onClickItem: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.bg_active.active = !0;
this.CORE.onSelectBank(this.data, this.type);
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Payment.Withdraw.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "968darDlb9FNal3xigVLdKm", "Lobby.Popup.Payment.Withdraw.Controller");
var o = t("Lobby.Popup.Payment.Withdraw.Bank.Controller");
cc.Class({
extends: cc.Component,
properties: {
headerGateType: cc.Node,
bodyGateType: cc.Node,
Bank: o
},
init: function(t) {
this.CORE = t;
this.config = null;
this.tabShow = "BANK";
},
onLoad: function() {
this.Bank.init(this);
},
onEnable: function() {},
onSelectheaderGateType: function(t) {
cc.CORE.GAME_SCENCE.PlayClick();
if (null != this.config) {
var e = t.target.name;
this.headerGateType.children.forEach(function(t) {
if (t.name == e) {
t.getChildByName("active").active = !0;
t.getChildByName("none").active = !1;
} else {
t.getChildByName("active").active = !1;
t.getChildByName("none").active = !0;
}
});
this.tabShow = e;
}
},
toggle: function() {
this.node.active = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
"Lobby.Popup.Payment.Withdraw.Bank.Controller": "Lobby.Popup.Payment.Withdraw.Bank.Controller"
} ],
"Lobby.Popup.Profile.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "7c072ZUTnFJJ5iHiRlL9ccJ", "Lobby.Popup.Profile.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
balance: cc.Label,
nickname: cc.Label,
uid: cc.Label,
phone: cc.Label,
avatar: cc.Sprite,
verify_phone: cc.Label,
verify_phone_btn: cc.Node,
created_at: cc.Label,
updated_at: cc.Label
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {},
clickRegNickname: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (this.nickname.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(this.nickname.string)) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
cc.CORE.NETWORK.APP.Send({
event: "user",
data: {
set_nickname: this.nickname.string
}
});
},
onClickChangePassword: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
this.toggle();
cc.CORE.GAME_SCENCE.Popup.show("change_password");
},
onClickVerifyPhone: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
this.toggle();
cc.CORE.GAME_SCENCE.Popup.show("verify_phone");
},
onClickChangeAvatar: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
cc.CORE.GAME_SCENCE.Popup.show("change_avatar");
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {
if (cc.CORE.IS_LOGIN) {
var t, e, n, i, a, c, r, s;
this.balance.string = cc.CORE.UTIL.numberWithCommas(null == (t = cc.CORE.USER) ? void 0 : t.balance) || 0;
this.nickname.string = (null == (e = cc.CORE.USER) ? void 0 : e.nickname.toUpperCase()) || "Chưa cập nhật";
this.uid.string = "UID: 2037" + (null == (n = cc.CORE.USER) ? void 0 : n.id) || "";
this.created_at.string = cc.CORE.UTIL.getStringDateByTime(null == (i = cc.CORE.USER) ? void 0 : i.createdAt) || "";
this.updated_at.string = cc.CORE.UTIL.getStringDateByTime(null == (a = cc.CORE.USER) ? void 0 : a.updatedAt) || "";
if (null != (c = cc.CORE.USER) && c.verify) {
this.verify_phone.string = "Đã xác minh";
this.verify_phone.node.color = cc.color().fromHEX("#00FF00");
this.verify_phone_btn.active = !1;
} else {
this.verify_phone.string = "Chưa xác minh";
this.verify_phone.node.color = cc.color().fromHEX("#FF0000");
this.verify_phone_btn.active = !0;
}
if (null !== (null == (r = cc.CORE.USER) ? void 0 : r.phone)) {
var l;
this.phone.string = "+" + cc.CORE.UTIL.maskPhoneNumber(null == (l = cc.CORE.USER) ? void 0 : l.phone);
} else this.phone.string = "Chưa cập nhật";
if (null != (s = cc.CORE.USER) && s.avatar) {
var u;
o.setAvatarToSprite(this.avatar, null == (u = cc.CORE.USER) ? void 0 : u.avatar).then(function() {}).catch(function(t) {
console.error("Failed to set player avatar:", t);
});
}
}
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Lobby.Popup.RegNickname.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "0e2b8bWi8hLh4dzJqX5A4Ba", "Lobby.Popup.RegNickname.Controller");
cc.Class({
extends: cc.Component,
properties: {
nickname: cc.EditBox
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {},
clickRegNickname: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (this.nickname.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(this.nickname.string)) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
cc.CORE.NETWORK.APP.Send({
event: "user",
data: {
set_nickname: this.nickname.string
}
});
},
hidePopup: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Lobby.Popup.Setting.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "44f71cCYbJEx7v5mFyWlwHQ", "Lobby.Popup.Setting.Controller");
var o = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
switch_SpriteFame: {
default: [],
type: cc.SpriteFrame
},
sound_spriteFrame: cc.Sprite,
music_spriteFrame: cc.Sprite
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {
o.getItem("MUSIC") ? cc.CORE.SETTING.MUSIC = cc.CORE.UTIL.stringToBoolean(o.getItem("MUSIC")) : o.setItem("MUSIC", "true");
o.getItem("SOUND") ? cc.CORE.SETTING.SOUND = cc.CORE.UTIL.stringToBoolean(o.getItem("SOUND")) : o.setItem("SOUND", "true");
this.music_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.MUSIC ? 1 : 0];
this.sound_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.SOUND ? 1 : 0];
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
onChangerSound: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.SETTING.SOUND = !cc.CORE.SETTING.SOUND;
o.setItem("SOUND", cc.CORE.SETTING.SOUND);
this.sound_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.SOUND ? 1 : 0];
},
onChangerMusic: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.SETTING.MUSIC = !cc.CORE.SETTING.MUSIC;
o.setItem("MUSIC", cc.CORE.SETTING.MUSIC);
this.music_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.MUSIC ? 1 : 0];
void 0 !== cc.CORE.GAME_SCENCE && (cc.CORE.SETTING.MUSIC ? cc.CORE.AUDIO.playMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic) : cc.CORE.AUDIO.stopMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic));
},
onClickVeryPhone: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.toggle();
cc.CORE.IS_LOGIN ? null != cc.CORE.GAME_SCENCE.PopupLobby ? cc.CORE.GAME_SCENCE.PopupLobby.show("verify_phone") : cc.CORE.GAME_SCENCE.Popup.show("verify_phone") : cc.CORE.GAME_SCENCE.Popup.show("signin");
},
onClickChangePassword: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.toggle();
cc.CORE.IS_LOGIN ? null != cc.CORE.GAME_SCENCE.PopupLobby ? cc.CORE.GAME_SCENCE.PopupLobby.show("change_password") : cc.CORE.GAME_SCENCE.Popup.show("change_password") : cc.CORE.GAME_SCENCE.Popup.show("signin");
},
update: function() {}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Lobby.Popup.SignIn.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "695d83BakRELJm1Yf676rZY", "Lobby.Popup.SignIn.Controller");
var o = t("LocalStorage"), n = t("HttpRequest");
cc.Class({
extends: cc.Component,
properties: {
username: cc.EditBox,
password: cc.EditBox,
remember: cc.Node
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {},
clickSignIn: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
if (this.password.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu không hợp lệ!", "error", 1, 1, !0);
n.Post(cc.CORE.CONFIG.SERVER_API + "/auth/login", {}, {
username: this.username.string,
password: this.password.string
}).then(function(e) {
console.log(e);
if (0 == e.error_code) {
var n = e.data, i = n.access_token, a = n.refresh_token;
o.setItem("access_token", i);
o.setItem("refresh_token", a);
t.toggle();
cc.CORE.NETWORK.APP.Send({
event: "authentication",
data: {
type: "token",
access_token: i
}
});
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
checkRemember: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.remember.active = !this.remember.active;
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.SignOut.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "62e58qkAvxLcZn6SWfNnGoL", "Lobby.Popup.SignOut.Controller");
var o = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {},
clickSignOut: function() {
cc.CORE.GAME_SCENCE.PlayClick();
o.setItem("access_token", "");
o.setItem("refresh_token", "");
o.removeItem("ref_code");
cc.CORE.NETWORK.APP._close();
cc.CORE.IS_LOGIN = !1;
cc.CORE.USER = {};
cc.CORE.GAME_ROOM.clean();
cc.CORE.GAME_SCENCE.Header.setHeader();
this.toggle();
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Lobby.Popup.SignUp.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "9b070kjXdZP5b+cOvVqkNeE", "Lobby.Popup.SignUp.Controller");
var o = t("LocalStorage"), n = t("HttpRequest");
cc.Class({
extends: cc.Component,
properties: {
username: cc.EditBox,
password: cc.EditBox,
password_confirm: cc.EditBox,
captcha: cc.EditBox,
captchaSprite: cc.Sprite,
ref_code: cc.EditBox,
mask_ref_code: cc.Node,
acceptTerms: {
default: !0
},
tickTerms: cc.Node
},
init: function() {
this.CORE = this;
},
onLoad: function() {
this.captcha_code = null;
},
onEnable: function() {
this.initCaptcha();
if (o.getItem("ref_code")) {
this.mask_ref_code.active = !0;
this.ref_code.string = o.getItem("ref_code").toLowerCase().trim();
} else this.mask_ref_code.active = !1;
},
acceptTermsClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.acceptTerms = !this.acceptTerms;
this.tickTerms.active = this.acceptTerms;
},
clickRegister: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (this.username.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên tài khoản không hợp lệ!", "error", 1, 1, !0);
if (this.password.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mật khẩu không hợp lệ!", "error", 1, 1, !0);
if (this.password_confirm.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Xác nhận mật khẩu không hợp lệ!", "error", 1, 1, !0);
if (this.password.string != this.password_confirm.string) return cc.CORE.GAME_SCENCE.FastNotify("2 mật khẩu không khớp!", "error", 1, 1, !0);
if (this.captcha.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Mã xác nhận không hợp lệ!", "error", 1, 1, !0);
if (this.captcha.string != this.captcha_code) return cc.CORE.GAME_SCENCE.FastNotify("Mã captcha không hợp lệ!", "error", 1, 1, !0);
if (!this.acceptTerms) return cc.CORE.GAME_SCENCE.FastNotify("Bạn phải đồng ý với điều khoản!", "error", 1, 1, !0);
n.Post(cc.CORE.CONFIG.SERVER_API + "/auth/register", {}, {
name: "Player Account",
username: this.username.string,
password: this.password.string,
captcha: this.captcha.string,
ref_code: "" == this.ref_code.string ? null : this.ref_code.string
}).then(function(e) {
console.log(e);
if (0 == e.error_code) {
var n = e.data, i = n.access_token, a = n.refresh_token;
o.setItem("access_token", i);
o.setItem("refresh_token", a);
o.removeItem("ref_code");
t.toggle();
cc.CORE.NETWORK.APP.Send({
event: "authentication",
data: {
type: "token",
access_token: i
}
});
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify(t.message, "error", 1, 1, !0);
});
},
initCaptcha: function() {
var t = this;
n.Post(cc.CORE.CONFIG.SERVER_API + "/captcha", {}, {}).then(function(e) {
if (0 == e.error_code) {
var o = e.data;
t.captcha_code = o.code;
var n = new Image();
n.src = o.captcha;
n.onload = function() {
var e = new cc.Texture2D();
e.initWithElement(n);
e.handleLoadedTexture();
var o = new cc.SpriteFrame(e);
t.captchaSprite.spriteFrame = o;
};
} else cc.CORE.GAME_SCENCE.FastNotify(e.error_message, "error", 1, 1, !0);
}).catch(function(t) {
console.log(t);
return cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, !0);
});
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Transfer.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "f6f80B+0VZJjpiFEgSwxEvV", "Lobby.Popup.Transfer.Controller");
var o = t("HttpRequest"), n = t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox,
inputUsername: cc.EditBox,
inputOtp: cc.EditBox,
inputContent: cc.EditBox,
btn_check_on: cc.Node,
btn_check_off: cc.Node
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {},
onDisable: function() {
this.clean();
},
clean: function() {
this.inputAmount.string = "";
this.inputUsername.string = "";
this.inputOtp.string = "";
this.inputContent.string = "";
},
onChangerAmount: function(t) {
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = t;
this.inputAmount.string = "0" === t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
onChangerNickname: function(t) {
var e = this;
void 0 === t && (t = "");
if (t.length > 0) o.Get(cc.CORE.CONFIG.SERVER_API + "/user/check-valid-nickname?nickname=" + t, {}, {
Authorization: "Bearer " + n.getItem("access_token")
}).then(function(t) {
if (0 == t.error_code) {
e.btn_check_on.active = !0;
e.btn_check_off.active = !1;
} else {
e.btn_check_on.active = !1;
e.btn_check_off.active = !0;
}
}).catch(function() {
e.btn_check_on.active = !1;
e.btn_check_off.active = !1;
}); else {
this.btn_check_on.active = !1;
this.btn_check_off.active = !1;
}
},
clickTransfer: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (this.inputUsername.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("ID người nhận không hợp lệ!", "info", 1, 1, !0);
if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1e3) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, 1, !0);
if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, !0);
cc.CORE.NETWORK.APP.Send({
event: "transfer",
data: {
amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string),
username: this.inputUsername.string,
otp: this.inputOtp.string,
content: this.inputContent.string
}
});
},
clickGetOtp: function() {
cc.CORE.GAME_SCENCE.PlayClick();
cc.CORE.NETWORK.APP.Send({
event: "security",
data: {
get_otp: {
action: "transfer_balance"
}
}
});
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {}
});
cc._RF.pop();
}, {
HttpRequest: void 0,
LocalStorage: void 0
} ],
"Lobby.Popup.Verify_Phone.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "b6f73QIU/NAWYUV0nMzT3Cq", "Lobby.Popup.Verify_Phone.Controller");
cc.Class({
extends: cc.Component,
properties: {
FormVerify: cc.Node,
FormVerified: cc.Node,
inputOtp: cc.EditBox,
user_phone: cc.Label
},
init: function() {
this.CORE = this;
},
onLoad: function() {},
onEnable: function() {
if (void 0 !== cc.CORE.USER.verify && void 0 !== cc.CORE.USER.phone) if (cc.CORE.USER.verify && null !== cc.CORE.USER.phone) {
this.user_phone.string = "+" + cc.CORE.USER.phone;
this.FormVerify.active = !1;
this.FormVerified.active = !0;
} else {
this.FormVerify.active = !0;
this.FormVerified.active = !1;
} else {
this.FormVerify.active = !0;
this.FormVerified.active = !1;
}
},
onDisable: function() {
this.inputOtp.string = "";
},
onClickVerify: function() {
cc.CORE.GAME_SCENCE.PlayClick();
if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "error", 1, 1, !0);
cc.CORE.NETWORK.APP.Send({
event: "security",
data: {
verify: {
otp: this.inputOtp.string
}
}
});
},
onClickOtpBot: function(t, e) {
void 0 === e && (e = "TELEGRAM_BOT");
cc.CORE.GAME_SCENCE.PlayClick();
var o = e, n = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[o];
n && "" !== n && null !== n ? cc.sys.openURL(n) : this.FastNotify(n ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
},
toggle: function() {
cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
time: .3
});
},
update: function() {
if (void 0 !== cc.CORE.USER.verify && void 0 !== cc.CORE.USER.phone) if (cc.CORE.USER.verify && null !== cc.CORE.USER.phone) {
this.user_phone.string = "+" + cc.CORE.UTIL.maskPhoneNumber(cc.CORE.USER.phone);
this.FormVerify.active = !1;
this.FormVerified.active = !0;
} else {
this.FormVerify.active = !0;
this.FormVerified.active = !1;
} else {
this.FormVerify.active = !0;
this.FormVerified.active = !1;
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Lobby.Controller", "Lobby.Audio.Controller", "Lobby.Banner.Controller", "Lobby.Banner.Image.Item.Controler", "Lobby.Banner.Pagination.Item.Controller", "Lobby.Header.Controller", "Lobby.Header_User.Controller", "Lobby.Dialog.Xocdia_Select_Room.Controller", "Lobby.Menu_Game.Controller", "Lobby.Menu_Tab.Controller", "Lobby.News.Controller", "Lobby.Popup.ChangeAvatar.Controller", "Lobby.Popup.ChangeAvatar.Item.Controller", "Lobby.Popup.ChangePwd.Controller", "Lobby.Popup.ForgotPwd.Controller", "Lobby.Popup.Profile.Controller", "Lobby.Popup.RegNickname.Controller", "Lobby.Popup.SignIn.Controller", "Lobby.Popup.SignOut.Controller", "Lobby.Popup.SignUp.Controller", "Lobby.Popup.Contact.Controller", "Lobby.Popup.Event.First_Deposit.Controller", "Lobby.Popup.Event.First_Deposit.Progress.Controller", "Lobby.Popup.Event.Milestone_Deposit.Controller", "Lobby.Popup.Event.Milestone_Deposit.Progress.Controller", "Lobby.Popup.Event.New_Member.Controller", "Lobby.Popup.Event.Refund_Bet.Controller", "Lobby.Popup.Event.Controller", "Lobby.Popup.GameApi.Controller", "Lobby.Popup.GameApi.Direct.Controller", "Lobby.Popup.GameApi.Item.Controller", "Lobby.Popup.GameApi.TransferWallet.Controller", "Lobby.Popup.GameApi.TransfeWallet.Deposit.Controller", "Lobby.Popup.GameApi.TransfeWallet.Withdraw.Controller", "Lobby.Popup.History_Bet.Controller", "Lobby.Popup.History_Bet.Sicbo.ByDate.Item.Controller", "Lobby.Popup.History_Bet.Sicbo.BySession.Item.Controller", "Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller", "Lobby.Popup.History_Bet.Xocdia.ByDate.Item.Controller", "Lobby.Popup.History_Bet.Xocdia.BySession.Item.Controller", "Lobby.Popup.History_Bet.Xocdia.BySessionBet.Item.Controller", "Lobby.Popup.History_Finan.Controller", "Lobby.Popup.History_Finan.Item.Controller", "Lobby.Popup.History_Tip.Controller", "Lobby.Popup.History_Tip.Item.Controller", "Lobby.Popup.History_Transfer.Controller", "Lobby.Popup.History_Transfer.Item.Controller", "Lobby.Popup.Inbox.Controller", "Lobby.Popup.Inbox.Item.Controller", "Lobby.Popup.Controller", "Lobby.Popup.New_Member.Controller", "Lobby.Popup.Payment.Deposit.Bank.Controller", "Lobby.Popup.Payment.Deposit.Controller", "Lobby.Popup.Payment.Deposit.QrCode.Controller", "Lobby.Popup.Payment.Deposit.Usdt.Controller", "Lobby.Popup.Payment.Controller", "Lobby.Popup.Payment.Withdraw.Bank.Controller", "Lobby.Popup.Payment.Withdraw.Bank.Item.Controller", "Lobby.Popup.Payment.Withdraw.Controller", "Lobby.Popup.Setting.Controller", "Lobby.Popup.Transfer.Controller", "Lobby.Popup.Verify_Phone.Controller", "Lobby.Fast_Notify.Controller" ]);