window.__require = function t(e, o, i) {
function n(a, r) {
if (!o[a]) {
if (!e[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!e[s]) {
var u = "function" == typeof __require && __require;
if (!r && u) return u(s, !0);
if (c) return c(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var l = o[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return n(e[a][1][t] || t);
}, l, l.exports, t, e, o, i);
}
return o[a].exports;
}
for (var c = "function" == typeof __require && __require, a = 0; a < i.length; a++) n(i[a]);
return n;
}({
"Sicbo.Audio.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "38ba0wCFmFKGb629rXC9rE6", "Sicbo.Audio.Controller");
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
chip_bet: {
default: null,
type: cc.AudioSource
},
win_bet: {
default: null,
type: cc.AudioSource
},
refurn_bet: {
default: null,
type: cc.AudioSource
},
customer_tip: {
default: null,
type: cc.AudioSource
},
owner_leave: {
default: null,
type: cc.AudioSource
},
welcome: {
default: null,
type: cc.AudioSource
},
start_normal_bet: {
default: null,
type: cc.AudioSource
},
start_big_bet: {
default: null,
type: cc.AudioSource
},
stop_bet: {
default: null,
type: cc.AudioSource
},
res_white3: {
default: null,
type: cc.AudioSource
},
res_red3: {
default: null,
type: cc.AudioSource
},
res_red4: {
default: null,
type: cc.AudioSource
},
res_white4: {
default: null,
type: cc.AudioSource
},
res_double: {
default: null,
type: cc.AudioSource
},
res_tai: {
default: null,
type: cc.AudioSource
},
res_xiu: {
default: null,
type: cc.AudioSource
},
res_1: {
default: null,
type: cc.AudioSource
},
res_2: {
default: null,
type: cc.AudioSource
},
res_3: {
default: null,
type: cc.AudioSource
},
res_4: {
default: null,
type: cc.AudioSource
},
res_5: {
default: null,
type: cc.AudioSource
},
res_6: {
default: null,
type: cc.AudioSource
}
},
start: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Chat.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "62708ATuyJNLomN2krgSoVe", "Sicbo.Chat.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputChat: cc.EditBox,
content: cc.Node,
itemChatPrefab: cc.Prefab,
itemChatQuickTextPrefab: cc.Prefab,
itemChatQuickEmojiPrefab: cc.Prefab,
chatMain_Node: cc.Node,
chatQuickText_Node: cc.Node,
chatQuickEmoji_Node: cc.Node,
contentQuickText: cc.Node,
contentQuickEmoji: cc.Node
},
init: function(t) {
var e = this;
this.CORE = t;
this.quickchat_text_list = [ "Tài", "Xỉu", "Kết Tài", "Kết Xỉu", "Chạm 1", "Chạm 2", "Chạm 3", "Chạm 4", "Chạm 5", "Chạm 6", "Đen Quá", "Lại thua", "Còn cái nịt", "Đen quá", "Đánh gì đây", "Bộ sáp" ];
this.quickchat_emoji_list = [ "EMO1", "EMO2", "EMO3", "EMO4", "EMO5", "EMO6", "EMO7", "EMO8", "EMO9", "EMO10", "EMO11", "EMO12", "EMO13", "EMO14", "EMO15", "EMO16", "EMO17", "EMO18", "EMO19", "EMO20", "ICONEMO" ];
this.contentQuickText.removeAllChildren();
this.quickchat_text_list.forEach(function(t) {
var o = cc.instantiate(e.itemChatQuickTextPrefab), i = o.getComponent("Sicbo.Chat.QuickText.Item.Controller");
i.init(e);
i.text.string = t;
e.contentQuickText.addChild(o);
});
this.contentQuickEmoji.removeAllChildren();
this.quickchat_emoji_list.forEach(function(t) {
var o = cc.instantiate(e.itemChatQuickEmojiPrefab), i = o.getComponent("Sicbo.Chat.QuickEmoji.Item.Controller");
i.init(e);
i.setEmoji(t);
e.contentQuickEmoji.addChild(o);
});
},
onEnable: function() {
this.chatMain_Node.active = !0;
this.chatQuickText_Node.active = !1;
this.chatQuickEmoji_Node.active = !1;
},
toggle: function() {
this.node.active = !this.node.active;
},
openChatBoard: function() {
this.node.active = !0;
},
closeChatBoard: function() {
this.node.active = !1;
},
openChatTab: function(t, e) {
this.node.active = !0;
if ("text" == e) {
this.chatMain_Node.active = !1;
this.chatQuickText_Node.active = !0;
this.chatQuickEmoji_Node.active = !1;
} else if ("emoji" == e) {
this.chatMain_Node.active = !1;
this.chatQuickText_Node.active = !1;
this.chatQuickEmoji_Node.active = !0;
} else {
this.chatMain_Node.active = !0;
this.chatQuickText_Node.active = !1;
this.chatQuickEmoji_Node.active = !1;
}
},
sendMessage: function() {
if (!(this.inputChat.string.length <= 0)) {
if (this.inputChat.string.length > 80) return cc.CORE.GAME_SCENCE.FastNotify("Nội dung chat quá dài!", "info", 1, !1);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
chat: {
send_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
message: this.inputChat.string,
type: "text"
}
}
}
}
});
this.inputChat.string = "";
}
},
onClickChatQuickTextItem: function(t) {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
chat: {
send_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
message: t,
type: "text"
}
}
}
}
});
this.openChatTab(null, null);
},
onClickChatQuickEmojiItem: function(t) {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
chat: {
send_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
message: t,
type: "emoji"
}
}
}
}
});
this.openChatTab(null, null);
this.openChatTab(null, null);
},
MessagePush: function(t, e, o, i, n) {
void 0 === i && (i = "#FFC200");
void 0 === n && (n = "#FFFFFF");
var c = cc.instantiate(this.itemChatPrefab), a = c.getComponent("Sicbo.Chat.Item.Controller");
a.init(this);
a.addMessage(t, e, o, i, n);
this.content.addChild(c);
},
onData: function(t) {
var e = this;
void 0 !== t.get_chat && t.get_chat.forEach(function(t) {
e.MessagePush(t.type, t.nickname, t.content, t.color_username, t.color_content);
});
if (void 0 !== t.new_chat) {
var o = t.new_chat;
this.MessagePush(o.type, o.nickname, o.content, o.color_username, o.color_content);
}
}
});
cc._RF.pop();
}, {} ],
"Sicbo.Chat.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "6d59aKMjDRLPYRRtvVPAWDB", "Sicbo.Chat.Item.Controller");
function o(t, e) {
var o = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (o) return (o = o.call(t)).next.bind(o);
if (Array.isArray(t) || (o = i(t)) || e && t && "number" == typeof t.length) {
o && (t = o);
var n = 0;
return function() {
return n >= t.length ? {
done: !0
} : {
done: !1,
value: t[n++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function i(t, e) {
if (t) {
if ("string" == typeof t) return n(t, e);
var o = Object.prototype.toString.call(t).slice(8, -1);
"Object" === o && t.constructor && (o = t.constructor.name);
return "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? n(t, e) : void 0;
}
}
function n(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var o = 0, i = new Array(e); o < e; o++) i[o] = t[o];
return i;
}
var c = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
message_text: cc.RichText,
message_emoji: cc.Node
},
init: function(t) {
this.CORE = t;
},
onEnable: function() {},
wrapText: function(t) {
for (var e, i = [], n = "", c = !1, a = o(t.split(" ")); !(e = a()).done; ) {
var r = e.value;
if ((n + (n ? " " : "") + r).length + this.username.string.length <= 46) n += (n ? " " : "") + r; else {
if (n) {
i.push(n);
c = !0;
}
n = r;
}
}
n && i.push(n);
return {
text: i.join("\n"),
isWrapped: c
};
},
addMessage: function(t, e, o, i, n) {
var a = this;
this.username.string = e;
this.username.node.color = cc.color().fromHEX(i);
if ("text" == t) {
this.message_text.node.active = !0;
this.message_emoji.active = !1;
var r = this.wrapText(o), s = "<color=" + n + ">" + r.text + "</color>";
this.message_text.string = s;
setTimeout(function() {
a.node.height = a.message_text.node.height + (r.isWrapped ? 20 : 0);
}, 100);
} else if ("emoji" == t) {
this.message_text.node.active = !1;
this.message_emoji.active = !0;
c.loadFromBundle("Common_Bundle", "Images/Emojis/" + o, cc.SpriteFrame).then(function(t) {
a.message_emoji.children[0].getComponent(cc.Sprite).spriteFrame = t;
}).catch(function(t) {
return console.error("❌ Error loading:", t);
});
}
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Sicbo.Chat.QuickEmoji.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "5a263+mzg9KYY8B4K5l58y7", "Sicbo.Chat.QuickEmoji.Item.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {},
init: function(t) {
this.CORE = t;
},
setEmoji: function(t) {
var e = this;
this.text = t;
o.loadFromBundle("Common_Bundle", "Images/Emojis/" + t, cc.SpriteFrame).then(function(t) {
e.node.getComponent(cc.Sprite).spriteFrame = t;
}).catch(function(t) {
return console.error("❌ Error loading:", t);
});
},
onClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickChatQuickEmojiItem(this.text);
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Sicbo.Chat.QuickText.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "238ed8DSDpG/Y+RH58f5rXO", "Sicbo.Chat.QuickText.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
text: cc.Label
},
init: function(t) {
this.CORE = t;
},
onClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickChatQuickTextItem(this.text.string);
}
});
cc._RF.pop();
}, {} ],
"Sicbo.ClockOverlayManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "718a8PTTqtAAqjuAQrlPpPA", "Sicbo.ClockOverlayManager");
var o = {
id: "cocos-timer-overlay",
create: function(t) {
void 0 === t && (t = "00");
},
updateFixedPosition: function(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
},
setText: function() {},
hide: function() {},
show: function() {},
destroy: function() {}
};
window.ClockOverlayManager = o;
e.exports = o;
cc._RF.pop();
}, {} ],
"Sicbo.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d05e7oyMGVK4bp5oTJqW45p", "Sicbo.Controller");
function o() {
return (o = Object.assign ? Object.assign.bind() : function(t) {
for (var e = 1; e < arguments.length; e++) {
var o = arguments[e];
for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (t[i] = o[i]);
}
return t;
}).apply(this, arguments);
}
var i = t("LocalStorage"), n = t("AssetManager"), c = t("Sicbo.Audio.Controller"), a = t("Sicbo.KeyBoardManager"), r = t("Sicbo.Dealer.KeyBoardManager");
t("Sicbo.Init.Util")();
var s = t("Sicbo.ClockOverlayManager"), u = t("Sicbo.PlayerCountOverlayManager"), l = t("Sicbo.ResultDotOverlayManager"), d = t("Sicbo.Popup.Controller"), h = t("Sicbo.Chat.Controller"), p = t("Sicbo.Notify.Controller"), C = t("Sicbo.ThongKe.SoiCau.Controller"), f = t("Sicbo.ThongKe.SoiCau.Controller");
cc.Class({
extends: cc.Component,
properties: {
Audio: c,
font: {
default: [],
type: cc.BitmapFont
},
txtVideoStream: {
type: cc.Label,
default: null
},
VideoStream: {
type: cc.WebView,
default: null
},
GameMain: cc.Node,
diceSprite: {
default: [],
type: cc.SpriteFrame
},
balance: {
type: cc.Label,
default: null
},
total_bet: {
type: cc.Label,
default: null
},
contractor_username: {
type: cc.Label,
default: null
},
contractor_balance: {
type: cc.Label,
default: null
},
username_sidebar: {
type: cc.Label,
default: null
},
balance_sidebar: {
type: cc.Label,
default: null
},
session_sidebar: {
type: cc.Label,
default: null
},
time_remain: {
type: cc.Label,
default: null
},
gameDicesResult: {
type: cc.Node,
default: null
},
gamePlayerCount: {
type: cc.Label,
default: null
},
gameNodeChipBet: {
default: [],
type: cc.Node
},
gameBetBoardNode: {
type: cc.Node,
default: null
},
gamePageNodeBet: {
default: [],
type: cc.Node
},
gameNodeBet: {
default: [],
type: cc.Node
},
gameNodeBetPagination: {
default: [],
type: cc.Node
},
sideBar: {
type: cc.Node,
default: null
},
miniNotifyPrefab: {
default: null,
type: cc.Prefab
},
nodeNotify: {
default: null,
type: cc.Node
},
prefabNode: {
default: null,
type: cc.Node
},
SicboPopup: d,
SicboSoiCau: C,
SicboSoiCau2: f,
SicboChat: h,
SicboNotify: p
},
start: function() {},
init: function() {
cc.CORE.GAME_SCENCE = this;
},
onLoad: function() {
var t = this;
cc.CORE.GAME_SCENCE = this;
a.init();
this.pageBetShow = 0;
this.gameNodeBet.forEach(function(e) {
return e.on(cc.Node.EventType.TOUCH_END, t.PlayChipBet, t);
});
this.gameNodeBet.forEach(function(e) {
return e.on(cc.Node.EventType.TOUCH_END, t.onClickBet, t);
});
this.gameNodeChipBet.forEach(function(e) {
e.on(cc.Node.EventType.TOUCH_END, t.onChangerSelectChipShow, t);
});
this.username_sidebar.string = cc.CORE.USER.nickname ? cc.CORE.USER.nickname.toUpperCase() : cc.CORE.USER.username.toUpperCase();
this.isIframeOverlayCreated = !1;
this.positionVideoStream = this.VideoStream.node.position;
window.addEventListener("resize", function() {
t.positionVideoStream = t.VideoStream.node.position;
});
this.ROOM = {};
this.user_balance = 0;
this.gameLogs = [];
this.gameState = null;
this.newInGame = !0;
this.newInGameSetDiceResult = !1;
this.audioStatus = !0;
this.amountCurrent = 1e4;
this.amountRefurn = 0;
this.gameNodeBetMap = new Map();
this.gameNodeBet.forEach(function(e) {
return t.gameNodeBetMap.set(e.name, e);
});
this.SicboPopup.init(this);
this.SicboSoiCau.init(this);
this.SicboSoiCau2.init(this);
this.SicboChat.init(this);
this.sideBar.getComponent("Sicbo.Sidebar.Controller").init(this);
this.isCheckPopupOpen = !0;
this.isPopupOpen = !1;
this.currentPopupOpen = null;
this.InitPopupPrefab();
this.pageViewComponent = this.gameBetBoardNode.getComponent(cc.PageView);
this.pageViewComponent && this.pageViewComponent.node.on("page-turning", function() {
var e = t.pageViewComponent.getCurrentPageIndex();
t.showPageBetByIndex(e);
});
this.DealerLockedPressKey = !1;
},
onEnable: function() {
var t = this;
cc.CORE.AUDIO.playSound(this.Audio.welcome);
cc.CORE.NETWORK.APP.UTIL.UpdateScene("SICBO");
setTimeout(function() {
cc.sys.isNative && t.FixScreenNative();
}, 200);
void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED && cc.CORE.NETWORK.DEALER.Send({
event: "dealer_join_room",
data: {
game: cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
});
this.OffWinNode();
this.SetDiceResult(!1);
this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
this.setCurrentMeBetAmountNodeBet(!0);
this.getRoomConfig();
this.getUserInfo();
this.getMeBet();
this.getLogs();
this.getChat();
this.intervalCheckUserInfo = setInterval(function() {
cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN && t.getUserInfo();
}, 5e3);
this.ClockOverlayManager = s;
this.PlayerCountOverlayManager = u;
this.ResultDotOverlayManager = l;
},
FixScreenNative: function() {
cc.log("FixScreenNative");
var t = this.VideoStream.node.position.y;
this.VideoStream.node.setPosition(cc.v2(0, t - 90));
this.GameMain.setPosition(cc.v2(0, this.GameMain.position.y - 90));
},
InitPopupPrefab: function() {
var t = this;
n.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Lobby.Popup", cc.Prefab).then(function(e) {
try {
var o = cc.instantiate(e);
o.name = "Lobby.Popup";
var i = o.getComponent("Lobby.Popup.Controller");
t.PopupLobby = i;
i.init(t);
t.prefabNode.addChild(o);
} catch (t) {}
}).catch(function(t) {
return console.error("❌ Error loading prefab:", t);
});
},
getRoomConfig: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
get_info_room: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
},
getUserInfo: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
user: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
},
getMeBet: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
me_bet: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
},
getLogs: function(t) {
void 0 === t && (t = 100);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
get_logs: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
limit: t
}
}
}
});
},
getChat: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
chat: {
get_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
},
onData: function(t) {
void 0 !== t.event && "game" == t.event && void 0 !== t.data.sicbo && this.Sicbo(t.data.sicbo);
void 0 !== t.event && "history_bet" == t.event && void 0 !== t.data && this.PopupLobby.HistoryBet.onData(t.data);
void 0 !== t.event && "notification" == t.event && this.onDataNotify(t.data);
if (void 0 !== t.event && "user" == t.event) {
var e = t.data;
if (void 0 !== e.user && void 0 !== e.user.balance) {
cc.log(e.user.balance);
if ("public" == this.ROOM.room_type) {
this.user_balance = e.user.balance;
this.balance.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
this.user_balance.toString().length >= 9 ? this.balance_sidebar.string = cc.CORE.UTIL.abbreviateNumber(this.user_balance, 2) : this.balance_sidebar.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
}
}
void 0 !== e.user && void 0 !== e.user.verify && void 0 !== e.user.phone && e.user.verify && null !== e.user.phone && (cc.CORE.USER = o({}, cc.CORE.USER, e.user));
}
},
onDataNotify: function(t) {
if (void 0 !== t.notify_data) {
if (void 0 !== t.notify_type && "common" == t.notify_type) {
var e = void 0 !== t.notify_data.time ? t.notify_data.time : 1;
this.FastNotify(t.notify_data.message, t.notify_data.type, e, !1);
}
void 0 !== t.notify_type && "transfer" == t.notify_type && this.FastNotify(t.notify_data.message, t.notify_data.type, notifyTime, !0);
void 0 !== t.notify_type && "notify" == t.notify_type && this.SicboNotify.showNotify("Thông báo", t.notify_data.message);
if (void 0 !== t.notify_type && "sicbo" == t.notify_type) {
var o = void 0 !== t.notify_data.time ? t.notify_data.time : 1;
this.FastNotifySicbo(t.notify_data.message, t.notify_data.type, o, !1);
}
}
},
Sicbo: function(t) {
var e = this, i = t.data;
if (void 0 !== i.get_info_room) {
this.ROOM = o({}, this.ROOM, i.get_info_room);
this.setupRoom(i.get_info_room);
}
void 0 !== i.request_join && this.SicboPopup.show("request_join_room", i.request_join);
void 0 !== i.leave && i.leave.leave && this.outGameByServer(i.leave);
void 0 !== i.owner_leave && this.SicboPopup.show("owner_leave");
if (void 0 !== i.get_logs) {
this.gameLogs = i.get_logs.data;
this.gameLogCounts = {
tai: i.get_logs.total_big,
xiu: i.get_logs.total_small
};
this.SicboSoiCau.setThongKe();
this.SicboSoiCau2.setThongKe();
}
if (void 0 !== i.user && void 0 !== i.user.balance) {
this.user_balance = i.user.balance;
this.balance.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
this.user_balance.toString().length >= 9 ? this.balance_sidebar.string = cc.CORE.UTIL.abbreviateNumber(this.user_balance, 4) : this.balance_sidebar.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
}
void 0 !== i.session && (this.ROOM.session = i.session);
if (void 0 !== i.time_remain) {
this.time_remain.string = cc.CORE.UTIL.numberPad(i.time_remain, 2);
s.setText(cc.CORE.UTIL.numberPad(i.time_remain, 2));
0 == i.time_remain && "start_bet" == this.gameState && setTimeout(function() {
cc.CORE.AUDIO.playSound(e.Audio.stop_bet);
}, 1500);
}
void 0 !== i.state && (this.gameState = i.state);
if (void 0 !== i.finish) {
this.cleanFastNotify();
this.cleanFastNotifySicbo();
void 0 !== i.finish.door_win && this.SetWinNode(i.finish.door_win);
if (void 0 !== i.finish.results) {
this.SetDiceResult(!0, i.finish.results);
this.SetDiceResultSound(!0, i.finish.results);
}
this.getLogs();
setTimeout(function() {
e.OffWinNode();
e.SetDiceResult(!1);
e.setDefaultCurrentBetAmountNodeBet(e.gameNodeBet);
e.setCurrentMeBetAmountNodeBet(!0);
e.total_bet.string = 0;
}, 5e3);
}
if (void 0 !== i.new_game && i.new_game) {
this.OffWinNode();
this.SetDiceResult(!1);
this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
this.setCurrentMeBetAmountNodeBet(!0);
this.total_bet.string = 0;
cc.CORE.AUDIO.playSound(this.Audio.start_normal_bet);
}
if (void 0 !== i.bet_data) {
var n = i.bet_data;
void 0 !== n.bet_door_amount && this.setUsersBetCurrent(n.bet_door_amount);
n.bet_door_player;
}
if (void 0 !== i.me_bet) {
var c = i.me_bet;
void 0 !== c.bet_door && this.setMebetCurrent(c.bet_door);
}
void 0 !== i.bet_status && i.bet_status && this.getMeBet();
if (void 0 !== i.call_update && i.call_update) {
this.getUserInfo();
this.getMeBet();
}
if (void 0 !== i.refurn) {
this.amountRefurn += i.refurn.refurn;
void 0 !== this.taskRefurn && clearTimeout(this.taskRefurn);
this.taskRefurn = setTimeout(function() {
e.TextMoneyFly(!0, e.amountRefurn, "Hoàn");
cc.CORE.AUDIO.playSound(e.Audio.refurn_bet);
setTimeout(function() {
e.amountRefurn = 0;
}, 5e3);
}, 1500);
}
if (void 0 !== i.status) {
this.setStatusWinLose(i.status);
this.getUserInfo();
}
if (void 0 !== i.contractor) {
if (void 0 !== i.contractor.user && null !== i.contractor.user) {
this.contractor_balance.string = cc.CORE.UTIL.numberWithCommas(i.contractor.user.balance);
this.contractor_username.string = i.contractor.user.nickname;
}
void 0 !== i.contractor.get_list && this.SicboPopup.Contractor.onData(i.contractor.get_list);
}
void 0 !== i.chat && this.SicboChat.onData(i.chat);
void 0 !== i.get_history_bet && this.SicboPopup.History_Bet.onData(i.get_history_bet);
void 0 !== i.check_transfer && this.SicboPopup.Transfer.onData(i.check_transfer);
if (void 0 !== i.dealer) {
void 0 !== i.dealer.locked_press_key && (this.DealerLockedPressKey = i.dealer.locked_press_key);
void 0 !== i.dealer.show_confirm_result && (this.SicboPopup.Dealer_Confirm_Result.node.active = i.dealer.show_confirm_result);
void 0 !== i.dealer.set_confirm_result && this.SicboPopup.Dealer_Confirm_Result.setResultDoor(i.dealer.set_confirm_result);
void 0 !== i.dealer.customer_tip && this.SicboPopup.Customer_Tip.show(i.dealer.customer_tip);
}
},
setupRoom: function(t) {
void 0 !== t.stream && this.setStream(!0, t.stream);
if (void 0 !== t.time_remain) {
this.time_remain.string = cc.CORE.UTIL.numberPad(t.time_remain, 2);
s.setText(cc.CORE.UTIL.numberPad(t.time_remain, 2));
}
void 0 !== t.room_code && (this.session_sidebar.string = t.room_code);
t.session;
void 0 !== t.ratio && this.setRatioBet(t.ratio);
void 0 !== t.player_count && (this.gamePlayerCount.string = cc.CORE.UTIL.numberWithCommas(t.player_count));
if (void 0 !== t.contractor) {
if (null !== t.contractor) {
this.contractor_balance.string = cc.CORE.UTIL.numberWithCommas(t.contractor.balance, 2);
this.contractor_username.string = t.contractor.nickname;
}
if (null == t.contractor) {
this.contractor_balance.string = "";
this.contractor_username.string = "";
}
}
},
setStream: function(t, e) {
void 0 === t && (t = !0);
void 0 === e && (e = null);
t && (this.VideoStream.node.active = !0);
var o = t ? 0 : 5e3;
this.VideoStream.node.setPosition(o, this.VideoStream.node.position.y);
e && (this.VideoStream.url = e);
},
setRatioBet: function(t) {
var e = this, o = t, i = o.fee;
Object.entries(o).forEach(function(t) {
var o = t[0], n = t[1];
if ("fee" != o) {
var c = n.win, a = e.gameNodeBetMap.get(o);
if (a) {
var r = a.getChildByName("name_ratio").getChildByName("ratio");
if ("small" == o || "big" == o) {
c = n.bet * n.win * (1 - i / 100);
r.getComponent(cc.Label).string = n.bet + "x" + c;
} else r.getComponent(cc.Label).string = n.bet + "x" + c;
}
}
});
},
onClickBet: function(t) {
var e = t.target.name;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
bet: {
room_code: this.ROOM.room_code,
door: e,
amount: this.amountCurrent
}
}
}
});
},
onClickRepeatBet: function() {
this.isClickToBet || cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
repeat_bet: {
room_code: this.ROOM.room_code
}
}
}
});
},
onClickCancelBet: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
cancel_bet: {
room_code: this.ROOM.room_code
}
}
}
});
},
onClickTipDealer: function() {
this.SicboPopup.show("tip");
},
onClickLeaveGame: function() {
this.SicboPopup.show("leave");
},
onClickLobbyTransfer: function() {
this.PopupLobby.show("transfer");
},
onClickLobbyVerifyPhone: function() {
this.PopupLobby.show("verify_phone");
},
onClickLobbyPayment: function() {
this.PopupLobby.show("payment");
},
onClickContact: function(t, e) {
void 0 === e && (e = "TELEGRAM_GROUP");
this.PopupLobby.show("contact");
},
outGameByServer: function() {
this.ClockOverlayManager.destroy();
this.PlayerCountOverlayManager.destroy();
this.ResultDotOverlayManager.destroy();
clearInterval(this.intervalCheckUserInfo);
void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED && cc.CORE.NETWORK.DEALER.Send({
event: "dealer_leave_room",
data: {
game: cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
});
cc.CORE.GAME_ROOM.clean();
i.removeItem("IN_GAME_ROOM");
cc.director.loadScene("Lobby");
},
setMebetCurrent: function(t) {
for (var e = 0, o = Object.entries(t.data); e < o.length; e++) {
var i = o[e], n = i[0], c = i[1];
this.setCurrentMeBetAmountNodeBet(!1, n, c);
}
this.total_bet.string = cc.CORE.UTIL.abbreviateNumber(t.total, 2);
},
setCurrentMeBetAmountNodeBet: function(t, e, o) {
void 0 === t && (t = !0);
void 0 === e && (e = null);
void 0 === o && (o = 0);
if (t) this.gameNodeBet.map(function(t) {
var e = t.getChildByName("me_bet");
if (e) {
var o = e.getChildByName("txt_me_bet").getComponent(cc.Label);
o && (o.string = "");
}
e.active = !1;
}); else if (null === e) ; else {
var i = this.gameNodeBetMap.get(e).getChildByName("me_bet");
if (i) {
var n = i.getChildByName("txt_me_bet").getComponent(cc.Label);
n && (n.string = cc.CORE.UTIL.abbreviateNumber(o, 2));
}
i.active = o > 0;
}
},
setStatusWinLose: function(t) {
if (t.total_win > 0) {
var e = t.total_win;
this.TextMoneyFly(!0, e);
cc.CORE.AUDIO.playSound(this.Audio.win_bet);
} else if (t.total_lose > 0) {
var o = t.total_lose;
this.TextMoneyFly(!1, o);
}
},
SetDiceResult: function(t, e) {
void 0 === t && (t = !1);
void 0 === e && (e = []);
var o = this;
if (!Array.isArray(e) || e.length !== o.gameDicesResult.children.length) return o.gameDicesResult.active = !1;
o.gameDicesResult.active = t;
e.sort(function(t, e) {
return t - e;
});
o.gameDicesResult.children.forEach(function(t, i) {
var n = t.getComponent(cc.Sprite);
if (n) {
var c = e[i];
n.spriteFrame = o.diceSprite[c];
}
});
},
SetDiceResultSound: function(t, e) {
var o = this;
void 0 === t && (t = !1);
void 0 === e && (e = []);
this.gameDicesResult.active = t;
if (Array.isArray(e) && e.length === this.gameDicesResult.children.length) {
e.sort(function(t, e) {
return t - e;
});
var i = this.getWinningDoorsSoundName(e);
i && this.node.runAction(cc.sequence(cc.callFunc(function() {
return cc.CORE.AUDIO.playSound(o.Audio[i]);
}), cc.delayTime(1.2), cc.callFunc(function() {
return cc.CORE.AUDIO.playSound(o.Audio["res_" + e[0]]);
}), cc.delayTime(.7), cc.callFunc(function() {
return cc.CORE.AUDIO.playSound(o.Audio["res_" + e[1]]);
}), cc.delayTime(.7), cc.callFunc(function() {
return cc.CORE.AUDIO.playSound(o.Audio["res_" + e[2]]);
})));
}
},
getWinningDoorsSoundName: function(t) {
void 0 === t && (t = []);
var e = t.reduce(function(t, e) {
return t + e;
}, 0);
return e > 10 ? "res_tai" : e <= 10 ? "res_xiu" : void 0;
},
OffWinNode: function() {
this.gameNodeBet.map(function(t) {
t.getChildByName("active").active = !1;
});
},
SetWinNode: function(t) {
var e = this;
e.OffWinNode();
t.map(function(t) {
return e.gameNodeBetMap.get(t).getChildByName("active").active = !0;
});
},
setDefaultCurrentBetAmountNodeBet: function(t) {
Promise.all(t.map(function(t) {
var e = t.getChildByName("txt_users_bet").getComponent(cc.Label);
e && (e.string = "0");
}));
},
setUsersBetCurrent: function(t) {
var e = this;
Object.entries(t).forEach(function(t) {
var o = t[0], i = t[1], n = e.gameNodeBetMap.get(o);
if (n) {
var c = n.getChildByName("txt_users_bet").getComponent(cc.Label);
c && (c.string = cc.CORE.UTIL.abbreviateNumber(i, 2));
}
});
},
toggleSidebar: function() {
this.sideBar.getComponent("Sicbo.Sidebar.Controller").toggleSidebar(this.VideoStream);
},
reConnect: function() {
var t = this;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
join: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD
}
}
}
});
setTimeout(function() {
t.getRoomConfig();
t.getUserInfo();
t.getMeBet();
}, 1e3);
},
onChangerSelectChipShow: function(t) {
var e = Number(t.target.name);
this.gameNodeChipBet.map(function(t) {
e == Number(t.name) ? t.children[1].active = !0 : t.children[1].active = !1;
});
this.amountCurrent = e;
},
showPageBetByIndex: function(t) {
this.pageBetShow = t;
this.gameNodeBetPagination.forEach(function(e, o) {
e.getComponent(cc.Sprite).node.color = o === t ? cc.Color.RED : cc.Color.WHITE;
});
},
showNextPage: function() {
this.PlayClick();
var t = this.pageViewComponent.getCurrentPageIndex() + 1;
t >= this.pageViewComponent.getPages().length && (t = 0);
this.pageViewComponent.scrollToPage(t, .3);
this.showPageBetByIndex(t);
},
showPreviousPage: function() {
this.PlayClick();
var t = this.pageViewComponent.getCurrentPageIndex() - 1;
t < 0 && (t = this.pageViewComponent.getPages().length - 1);
this.pageViewComponent.scrollToPage(t, .3);
this.showPageBetByIndex(t);
},
PlayClick: function() {
cc.CORE.AUDIO.playSound(this.Audio.click);
},
PlayChipBet: function() {
cc.CORE.AUDIO.playSound(this.Audio.chip_bet);
},
cleanFastNotify: function() {
this.prefabNode.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
},
cleanFastNotifySicbo: function() {
this.nodeNotify.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
},
FastNotify: function(t, e, o, i, n, c) {
void 0 === t && (t = "");
void 0 === e && (e = "success");
void 0 === o && (o = 3);
void 0 === i && (i = !0);
void 0 === n && (n = .5);
void 0 === c && (c = !0);
if (i || !this.isPopupOpen) {
c && this.prefabNode.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
var a = cc.instantiate(this.miniNotifyPrefab);
a.getComponent("Sicbo.Fast_Notify.Controller").init({
text: t,
type: e,
showTime: o,
animationTime: n
});
this.prefabNode.addChild(a);
}
},
FastNotifySicbo: function(t, e, o, i, n, c) {
void 0 === t && (t = "");
void 0 === e && (e = "success");
void 0 === o && (o = 3);
void 0 === i && (i = !0);
void 0 === n && (n = .5);
void 0 === c && (c = !0);
if (i || !this.isPopupOpen) {
c && this.nodeNotify.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
var a = cc.instantiate(this.miniNotifyPrefab);
a.getComponent("Sicbo.Fast_Notify.Controller").init({
text: t,
type: e,
showTime: o,
animationTime: n
});
this.nodeNotify.addChild(a);
}
},
TextMoneyFly: function(t, e, o) {
void 0 === o && (o = "");
var i = new cc.Node();
i.addComponent(cc.Label);
(i = i.getComponent(cc.Label)).string = o + " " + (t ? "+" : "-") + cc.CORE.UTIL.numberWithCommas(e);
i.font = this.font[0];
i.node.color = "Hoàn" == o ? cc.Color.WHITE : t ? cc.Color.GREEN : cc.Color.RED;
i.lineHeight = 50;
i.fontSize = 50;
i.node.position = cc.v2(-7, -375);
this.prefabNode.addChild(i.node);
i.node.runAction(cc.sequence(cc.moveTo(2, cc.v2(-7, -185)), cc.callFunc(function() {
try {
this.node.destroy();
} catch (t) {
console.log(t);
}
}, i)));
},
update: function(t) {
var e = this;
"finish" !== this.gameState && this.OffWinNode();
"start_bet" == this.gameState ? s.show() : "finish" == this.gameState ? s.hide() : null == this.gameState && ("00" !== this.time_remain.string ? s.show() : s.hide());
if (void 0 !== this.PopupLobby && this.isCheckPopupOpen) {
this.isPopupOpen = !1;
this.currentPopupOpen = null;
this.PopupLobby.node.children.forEach(function(t) {
if (t.active) {
e.currentPopupOpen = t.name;
e.isPopupOpen = !0;
}
});
this.setStream(!this.isPopupOpen);
if (this.isPopupOpen) {
s.hide();
u.hide();
l.hide();
} else u.show();
}
cc.sys.isBrowser && void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED && r.handleInput(t);
}
});
cc._RF.pop();
}, {
AssetManager: void 0,
LocalStorage: void 0,
"Sicbo.Audio.Controller": "Sicbo.Audio.Controller",
"Sicbo.Chat.Controller": "Sicbo.Chat.Controller",
"Sicbo.ClockOverlayManager": "Sicbo.ClockOverlayManager",
"Sicbo.Dealer.KeyBoardManager": "Sicbo.Dealer.KeyBoardManager",
"Sicbo.Init.Util": "Sicbo.Init.Util",
"Sicbo.KeyBoardManager": "Sicbo.KeyBoardManager",
"Sicbo.Notify.Controller": "Sicbo.Notify.Controller",
"Sicbo.PlayerCountOverlayManager": "Sicbo.PlayerCountOverlayManager",
"Sicbo.Popup.Controller": "Sicbo.Popup.Controller",
"Sicbo.ResultDotOverlayManager": "Sicbo.ResultDotOverlayManager",
"Sicbo.ThongKe.SoiCau.Controller": "Sicbo.ThongKe.SoiCau.Controller"
} ],
"Sicbo.Dealer.KeyBoardManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "0620aMWL5ZEaKn7ItYaKHEX", "Sicbo.Dealer.KeyBoardManager");
var o = t("Sicbo.KeyBoardManager"), i = cc.macro.KEY, n = {
handleInput: function(t) {
o.update(t);
for (var e = 0; e <= 9; e++) {
var n = i["num" + e];
if (o.wasKeyJustPressed(n)) {
this.onNumberPressed(e);
o.consumeJustPressed(n);
}
}
if (o.wasKeyJustPressed(i.enter) || o.wasKeyJustPressed(108)) {
this.onEnterPressed();
o.consumeJustPressed(i.enter);
o.consumeJustPressed(108);
}
},
onNumberPressed: function(t) {
cc.log("[DealerKeyboardManager] Bấm số:", t);
if (void 0 !== t && void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, !1);
cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím lên máy chủ:", t);
cc.CORE.NETWORK.DEALER.Send({
event: "dealer_machine_signal",
data: {
command: String(t)
}
});
}
},
onEnterPressed: function() {
cc.log("[DealerKeyboardManager] Bấm phím Enter");
if (void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, !1);
cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím Enter lên máy chủ");
cc.CORE.NETWORK.DEALER.Send({
event: "dealer_machine_signal",
data: {
command: "enter"
}
});
}
}
};
e.exports = n;
cc._RF.pop();
}, {
"Sicbo.KeyBoardManager": "Sicbo.KeyBoardManager"
} ],
"Sicbo.Fast_Notify.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "abcd7bhvKlDrreOCKgf83JA", "Sicbo.Fast_Notify.Controller");
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
var e = cc.scaleTo(.3, 1).easing(cc.easeBackOut()), o = cc.delayTime(this.showTime || 2), i = cc.scaleTo(.3, 0).easing(cc.easeBackIn()), n = cc.callFunc(function() {
if (cc.isValid(t.node)) try {
t.node.destroy();
} catch (t) {
console.log(t);
}
}), c = cc.sequence(e, o, i, n);
this.node.runAction(c);
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Init.Util": [ function(t, e) {
"use strict";
cc._RF.push(e, "1d78d+Z+kRM3p2RqabRuS/2", "Sicbo.Init.Util");
e.exports = function() {};
cc._RF.pop();
}, {} ],
"Sicbo.KeyBoardManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "a2f50IiDolOuJ1rbWiyt96j", "Sicbo.KeyBoardManager");
var o = {}, i = {}, n = {}, c = {
init: function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
},
_onKeyDown: function(t) {
o[t.keyCode] || (n[t.keyCode] = !0);
o[t.keyCode] = !0;
},
_onKeyUp: function(t) {
o[t.keyCode] = !1;
i[t.keyCode] = 0;
},
isKeyPressed: function(t) {
return !!o[t];
},
wasKeyJustPressed: function(t) {
return !0 === n[t];
},
consumeJustPressed: function(t) {
n[t] = !1;
},
canUseKey: function(t) {
return !i[t] || i[t] <= 0;
},
consumeKey: function(t, e) {
void 0 === e && (e = .2);
i[t] = e;
},
update: function(t) {
for (var e in i) i[e] > 0 && (i[e] -= t);
},
destroy: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
}
};
e.exports = c;
cc._RF.pop();
}, {} ],
"Sicbo.Notify.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "fdf36EPPFVG+5smUlxSGZbn", "Sicbo.Notify.Controller");
cc.Class({
extends: cc.Component,
properties: {
title: cc.Label,
label: cc.Label
},
onLoad: function() {},
showNotify: function(t, e) {
this.title.string = t;
this.label.string = e;
this.node.active = !0;
},
hideNotify: function() {
this.node.active = !1;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.PlayerCountOverlayManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "4024fTC1Q5CHqeeB0t5EEJs", "Sicbo.PlayerCountOverlayManager");
var o = {
id: "cocos-players-count-overlay",
textId: "cocos-players-count-overlay-txt",
create: function(t) {
void 0 === t && (t = "0");
},
updateFixedPosition: function(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
},
setText: function() {},
hide: function() {},
show: function() {},
destroy: function() {}
};
window.ClockOverlayManager = o;
e.exports = o;
cc._RF.pop();
}, {} ],
"Sicbo.Popup.Contractor.Confirm.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "85c1bC0ck1M36ymvHMn3WF3", "Sicbo.Popup.Contractor.Confirm.Controller");
cc.Class({
extends: cc.Component,
properties: {
label_txt: cc.Label,
btn_confirm: cc.Node,
btn_cancel: cc.Node
},
init: function(t) {
this.CORE = t;
this.type = null;
this.data = null;
},
onLoad: function() {},
onEnable: function() {},
clickConfirm: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (this.type) {
"register" == this.type && cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
contractor: {
register: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
"cancel" == this.type && cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
contractor: {
cancel: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
if ("set_contractor" == this.type) {
if (!this.data) return;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
contractor: {
set: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
request_id: this.data.id
}
}
}
}
});
}
this.toggle();
setTimeout(function() {
t.CORE.Contractor.getListContractor();
}, 800);
}
},
toggle: function(t, e) {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
this.type = t;
this.data = e;
if (this.type) {
"register" == this.type && (this.label_txt.string = "Bạn muốn đăng ký thầu vị?");
"cancel" == this.type && (this.label_txt.string = "Bạn muốn thoát thầu vị?");
"set_contractor" == this.type && (this.label_txt.string = "Chỉ định " + e.nickname + " là thầu vị?");
}
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.Contractor.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "a9d43LRHAJEuL9CDI9aUHuy", "Sicbo.Popup.Contractor.Controller");
cc.Class({
extends: cc.Component,
properties: {
content: cc.Node,
prefabItem: cc.Prefab
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {
this.STATUS_ALLOW = [ "active", "pending" ];
},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
this.getListContractor();
this.content.removeAllChildren();
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
getListContractor: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
contractor: {
get_list: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
},
onData: function(t) {
var e = this;
this.content.removeAllChildren();
var o = 1;
t.data.forEach(function(i) {
if (e.STATUS_ALLOW.includes(i.status)) {
var n = cc.instantiate(e.prefabItem), c = n.getComponent("Sicbo.Popup.ContractorList.Controller.Item");
c.init(e, i);
c.is_current.active = "active" == i.status;
c.top.string = o;
c.username.string = i.nickname;
c.username.node.color = i.is_owner && t.is_owner ? cc.Color.YELLOW : cc.Color.WHITE;
c.btn_cancel.active = !(i.is_owner || !t.is_owner);
c.btn_set.active = !("pending" != i.status || !t.is_owner);
e.content.addChild(n);
o++;
}
});
},
clickRegister: function() {
cc.CORE.GAME_SCENCE.SicboPopup.Contractor_Confirm.toggle("register");
},
clickCancel: function() {
cc.CORE.GAME_SCENCE.SicboPopup.Contractor_Confirm.toggle("cancel");
},
onCancelContractor: function(t) {
var e = this;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
contractor: {
reject: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
request_id: t.id
}
}
}
}
});
setTimeout(function() {
e.getListContractor();
}, 800);
},
onClickSetContractor: function(t) {
cc.CORE.GAME_SCENCE.SicboPopup.show("set_contractor", t);
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.ContractorList.Controller.Item": [ function(t, e) {
"use strict";
cc._RF.push(e, "07737dN2QJGAr84ma8E+YUk", "Sicbo.Popup.ContractorList.Controller.Item");
cc.Class({
extends: cc.Component,
properties: {
top: cc.Label,
username: cc.Label,
is_current: cc.Node,
btn_set: cc.Node,
btn_cancel: cc.Node
},
init: function(t, e) {
this.CORE = t;
this.data = e;
},
onEnable: function() {},
onClickCancel: function() {
this.CORE.onCancelContractor(this.data);
},
onClickSetContractor: function() {
this.CORE.onClickSetContractor(this.data);
},
playClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "91769/DddtKF6eIOi7+kuvI", "Sicbo.Popup.Controller");
var o = t("Sicbo.Popup.LeaveGame.Controller"), i = t("Sicbo.Popup.TipDealer.Controller"), n = t("Sicbo.Popup.Contractor.Controller"), c = t("Sicbo.Popup.Contractor.Confirm.Controller"), a = t("Sicbo.Popup.Transfer.Controller"), r = t("Sicbo.Popup.History_Bet.Controller"), s = t("Sicbo.Popup.Tutorial.Controller"), u = t("Sicbo.Popup.Dealer_Confirm_Result.Controller"), l = t("Sicbo.Popup.Request_Join_Room.Controller"), d = t("Sicbo.Popup.Customer_Tip.Controller"), h = t("Sicbo.Popup.Owner_Leave.Controller");
cc.Class({
extends: cc.Component,
properties: {
LeaveGame: o,
TipDealer: i,
Contractor: n,
Contractor_Confirm: c,
Transfer: a,
History_Bet: r,
Tutorial: s,
Dealer_Confirm_Result: u,
Request_Join_Room: l,
Customer_Tip: d,
Owner_Leave: h
},
init: function(t) {
this.CORE = t;
this.LeaveGame.init(this);
this.TipDealer.init(this);
this.Contractor.init(this);
this.Contractor_Confirm.init(this);
this.Transfer.init(this);
this.History_Bet.init(this);
this.Tutorial.init(this);
this.Dealer_Confirm_Result.init(this);
this.Request_Join_Room.init(this);
this.Customer_Tip.init(this);
this.Owner_Leave.init(this);
},
onLoad: function() {},
show: function(t, e) {
switch (t) {
case "tip":
this.TipDealer.toggle();
break;

case "leave":
this.LeaveGame.toggle();
break;

case "contractor":
this.Contractor.toggle();
break;

case "contractor_register":
this.Contractor_Confirm.toggle("register");
break;

case "contractor_cancel":
this.Contractor_Confirm.toggle("cancel");

case "set_contractor":
this.Contractor_Confirm.toggle("set_contractor", e);
return;

case "transfer":
this.Transfer.toggle();
break;

case "history_bet":
this.History_Bet.toggle();
break;

case "tutorial":
this.Tutorial.toggle();
break;

case "dealer_confirm_result":
this.Dealer_Confirm_Result.toggle();
break;

case "request_join_room":
this.Request_Join_Room.show(e);
break;

case "customer_tip":
this.Customer_Tip.show(e);
break;

case "owner_leave":
this.Owner_Leave.toggle();
}
},
update: function() {}
});
cc._RF.pop();
}, {
"Sicbo.Popup.Contractor.Confirm.Controller": "Sicbo.Popup.Contractor.Confirm.Controller",
"Sicbo.Popup.Contractor.Controller": "Sicbo.Popup.Contractor.Controller",
"Sicbo.Popup.Customer_Tip.Controller": "Sicbo.Popup.Customer_Tip.Controller",
"Sicbo.Popup.Dealer_Confirm_Result.Controller": "Sicbo.Popup.Dealer_Confirm_Result.Controller",
"Sicbo.Popup.History_Bet.Controller": "Sicbo.Popup.History_Bet.Controller",
"Sicbo.Popup.LeaveGame.Controller": "Sicbo.Popup.LeaveGame.Controller",
"Sicbo.Popup.Owner_Leave.Controller": "Sicbo.Popup.Owner_Leave.Controller",
"Sicbo.Popup.Request_Join_Room.Controller": "Sicbo.Popup.Request_Join_Room.Controller",
"Sicbo.Popup.TipDealer.Controller": "Sicbo.Popup.TipDealer.Controller",
"Sicbo.Popup.Transfer.Controller": "Sicbo.Popup.Transfer.Controller",
"Sicbo.Popup.Tutorial.Controller": "Sicbo.Popup.Tutorial.Controller"
} ],
"Sicbo.Popup.Customer_Tip.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "3a6226Ar1VP1IhvQ5rSvE7g", "Sicbo.Popup.Customer_Tip.Controller");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
amount: cc.Label
},
init: function(t) {
this.CORE = t;
this.data = {
username: "",
amount: 0
};
this.timeShow = 5;
this.timeShowIntv = null;
},
onLoad: function() {},
onEnable: function() {
this.timeShow = 5;
cc.CORE.AUDIO.playSound(cc.CORE.GAME_SCENCE.Audio.customer_tip);
clearInterval(this.timeShowIntv);
},
onDisable: function() {
clearInterval(this.timeShowIntv);
},
toggle: function() {
this.node.active = !this.node.active;
},
show: function(t) {
var e = this;
this.data = t;
void 0 !== this.data.nickname && (this.username.string = this.data.nickname);
void 0 !== this.data.amount && (this.amount.string = cc.CORE.UTIL.numberWithCommas(this.data.amount));
this.node.active = !0;
this.timeShowIntv = setInterval(function() {
e.timeShow--;
e.timeShow <= 0 && e.close();
}, 1e3);
},
close: function() {
this.node.active = !1;
clearInterval(this.timeShowIntv);
},
onData: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.Dealer_Confirm_Result.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "8b491KCpfdMdL+WTtiARQyJ", "Sicbo.Popup.Dealer_Confirm_Result.Controller");
cc.Class({
extends: cc.Component,
properties: {
result_node: cc.Node
},
init: function(t) {
this.CORE = t;
},
getWinningDoorsText: function(t) {
if (0 == t.length) return "null";
},
onLoad: function() {
this.setResultDoor([]);
},
onEnable: function() {},
onDisable: function() {
this.setResultDoor([]);
},
setResultDoor: function(t) {
var e = cc.CORE.GAME_SCENCE.diceSprite;
this.result_node.children.forEach(function(o, i) {
o.getChildByName("active").active = !1;
var n = o.getChildByName("dice").getComponent(cc.Sprite);
if (0 === t.length) n.spriteFrame = e[0]; else if (i < t.length) {
n.spriteFrame = e[t[i]];
o.getChildByName("active").active = !0;
} else n.spriteFrame = e[0];
});
},
toggle: function() {
this.node.active = !this.node.active;
},
onData: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.History_Bet.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "69504XLYe1KnLM0TVqGZfTc", "Sicbo.Popup.History_Bet.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
total_bet: cc.Label,
total_refurn: cc.Label,
total_fee: cc.Label,
total_profit: cc.Label,
content: cc.Node,
ItemPrefab: cc.Prefab,
pagination: cc.Node,
sprite_status: {
default: [],
type: cc.SpriteFrame
},
sprite_dices: {
default: [],
type: cc.SpriteFrame
}
},
init: function(t) {
var e = this;
this.CORE = t;
this.BET_DOOR_ENUM = {
even: "CHẴN",
odd: "LẺ",
even_low: "CHẴN",
odd_low: "LẺ",
even_high: "CHẴN",
odd_high: "LẺ",
red3: "3 ĐỎ",
red4: "4 ĐỎ",
white3: "3 TRẮNG",
white4: "4 TRẮNG"
};
o.loadFromBundle("Common_Bundle", "Prefabs/Pagination", cc.Prefab).then(function(t) {
var o = cc.instantiate(t);
e.pagination.addChild(o);
e.pagination = o.getComponent("Pagination");
e.pagination.init(e);
}).catch(function(t) {
return console.log("❌ Error loading:", t);
});
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !1;
this.getDataPage(1);
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !0;
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
onData: function(t) {
var e = this;
this.content.removeAllChildren();
if (void 0 !== t.sum) {
var o = t.sum;
void 0 !== o.total_bet && (this.total_bet.string = cc.CORE.UTIL.abbreviateNumber(o.total_bet, 2));
void 0 !== o.total_refurn && (this.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(o.total_refurn, 2));
void 0 !== o.total_fee && (this.total_fee.string = cc.CORE.UTIL.abbreviateNumber(o.total_fee, 2));
if (void 0 !== o.total_win && void 0 !== o.total_lose) {
var i = o.total_win - o.total_lose > 0 ? "#00FF00" : "#FF0000";
this.total_profit.string = cc.CORE.UTIL.abbreviateNumber(o.total_win - o.total_lose, 2);
this.total_profit.node.color = cc.color().fromHEX(i);
}
}
void 0 !== t.data && t.data.forEach(function(t) {
var o = cc.instantiate(e.ItemPrefab), i = o.getComponent("Sicbo.Popup.History_Bet.Item.Controller");
i.init(e);
var n = "...";
Object.keys(e.BET_DOOR_ENUM).forEach(function(o) {
t[o] && t[o] > 0 && (n = e.BET_DOOR_ENUM[o]);
});
i.fee.string = "..." == n ? cc.CORE.UTIL.abbreviateNumber(0, 2) : cc.CORE.UTIL.abbreviateNumber(t.fee, 2);
i.bet_door.string = n;
void 0 !== t.result && i.setResult(t.result);
void 0 !== t.is_win && (i.status.getComponent(cc.Sprite).spriteFrame = t.is_win ? e.sprite_status[0] : e.sprite_status[1]);
i.username.string = cc.CORE.USER.username.toUpperCase();
i.session.string = "#" + t.session;
i.time.string = cc.CORE.UTIL.getStringDateByTime(t.createdAt);
i.total_bet.string = cc.CORE.UTIL.abbreviateNumber(t.total_bet, 2);
i.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(t.total_refurn, 2);
i.total_win.string = cc.CORE.UTIL.abbreviateNumber(t.total_win, 2);
i.total_win.node.color = t.total_win > 0 ? cc.color().fromHEX("#00FF00") : cc.color().fromHEX("#FF0000");
e.content.addChild(o);
});
if (void 0 !== t.total && void 0 !== t.page && void 0 !== t.limit) {
var n = t;
this.pagination.onSet(n.page, n.limit, n.total);
}
},
getDataPage: function(t, e) {
void 0 === e && (e = 4);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
get_history_bet: {
get_list: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
page: t,
limit: e
}
}
}
}
});
},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Sicbo.Popup.History_Bet.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "f56f7dYWvZPrZPhpDVsgyl6", "Sicbo.Popup.History_Bet.Item.Controller");
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
session: cc.Label,
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
bet_door: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label,
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
setResult: function(t) {
var e = this;
this.result_dot.map(function(o, i) {
if (i < t.length) {
var n = t[i], c = n >= 1 && n <= 6 ? n : 0;
o.getComponent(cc.Sprite).spriteFrame = e.CORE.sprite_dices[c];
} else o.getComponent(cc.Sprite).spriteFrame = e.CORE.sprite_dices[0];
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
"Sicbo.Popup.LeaveGame.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "438f3GZ4cNPkqeTFf0lZcjZ", "Sicbo.Popup.LeaveGame.Controller");
t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
text: cc.Label
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
if ("private" == cc.CORE.GAME_SCENCE.ROOM.room_type) {
var t = cc.CORE.GAME_SCENCE.ROOM.is_ended ? "" : " đăng ký";
this.text.string = "Bạn có chắc chắn muốn" + t + "\nthoát khỏi phòng không?";
} else this.text.string = "Bạn có chắc chắn muốn\nrời khỏi phòng không?";
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
clickLeave: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
leave: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
this.toggle();
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Sicbo.Popup.Owner_Leave.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "df6b78Mt2pOB7zEPpHMz5wZ", "Sicbo.Popup.Owner_Leave.Controller");
t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
text: cc.Label
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.AUDIO.playSound(cc.CORE.GAME_SCENCE.Audio.owner_leave);
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Sicbo.Popup.Request_Join_Room.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "e3e0chmtHlOTJFuiAoNvJru", "Sicbo.Popup.Request_Join_Room.Controller");
cc.Class({
extends: cc.Component,
properties: {
username_txt: cc.Label
},
init: function(t) {
this.CORE = t;
this.data = {};
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
clickConfirm: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
request_join: this.data
}
}
});
this.close();
},
show: function(t) {
this.data = t;
void 0 !== this.data.nickname && (this.username_txt.string = this.data.nickname);
this.node.active = !0;
},
close: function() {
this.node.active = !1;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.TipDealer.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "2f4f04gTkFHU46CTF+zD12o", "Sicbo.Popup.TipDealer.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
this.inputAmount.string = "";
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
clickTip: function() {
if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1e3) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, !1);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
tip: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)
}
}
}
});
this.toggle();
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.Transfer.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "15616qroQBHup34XqChWeV+", "Sicbo.Popup.Transfer.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox,
inputUsername: cc.EditBox,
inputOtp: cc.EditBox,
btn_check_on: cc.Node,
btn_check_off: cc.Node
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
this.btn_check_on.active = !1;
this.btn_check_off.active = !1;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
this.clean();
},
clean: function() {
this.inputAmount.string = "";
this.inputUsername.string = "";
this.inputOtp.string = "";
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
clickTransfer: function() {
if (this.inputUsername.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("ID người nhận không hợp lệ!", "info", 1, !1);
if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1e3) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, !1);
if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, !1);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
transfer: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string),
username: this.inputUsername.string,
otp: this.inputOtp.string
}
}
}
});
},
clickGetOtp: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
get_otp: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
action: "transfer_balance"
}
}
}
});
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
onData: function(t) {
if (t) {
this.btn_check_on.active = !0;
this.btn_check_off.active = !1;
} else {
this.btn_check_on.active = !1;
this.btn_check_off.active = !0;
}
},
onChangerNickname: function(t) {
void 0 === t && (t = "");
if (t.length > 0) cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
sicbo: {
check_transfer: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
nickname: t
}
}
}
}); else {
this.btn_check_on.active = !1;
this.btn_check_off.active = !1;
}
},
update: function() {
cc.CORE.GAME_SCENCE.currentPopupOpen = "transfer";
}
});
cc._RF.pop();
}, {} ],
"Sicbo.Popup.Tutorial.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "8a6adKC7BVFxISfsJ/PH+7w", "Sicbo.Popup.Tutorial.Controller");
cc.Class({
extends: cc.Component,
properties: {},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !1;
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !0;
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.ResultDotOverlayManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "06ce0ZXJL9GM7QM88Tn5Ppe", "Sicbo.ResultDotOverlayManager");
var o = {
id: "cocos-result-dot-overlay",
create: function() {},
updateFixedPosition: function(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
},
setResult: function() {},
hide: function() {},
show: function() {},
destroy: function() {}
};
window.ResultDotOverlayManager = o;
e.exports = o;
cc._RF.pop();
}, {} ],
"Sicbo.Sidebar.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "aa140YoCodJDYgF1qF5WJMH", "Sicbo.Sidebar.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
Avatar: cc.Sprite,
sidebar: cc.Node,
sidebarBg: cc.Node,
audioSpriteframe: {
default: [],
type: cc.SpriteFrame
},
posXshow: 0,
posXhide: 832
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {
this.isShowing = !1;
this.isAnimating = !1;
this.sidebar.active = !0;
this.sidebarBg.active = !1;
},
onEnable: function() {
this.setAvatar();
this.resetSidebarState();
},
resetSidebarState: function() {
this.isShowing = !1;
this.isAnimating = !1;
this.sidebar.x = this.posXhide;
this.sidebarBg.active = !1;
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
setAvatar: function() {
if (cc.CORE.IS_LOGIN) {
var t;
if (null != (t = cc.CORE.USER) && t.avatar) {
var e;
o.setAvatarToSprite(this.Avatar, null == (e = cc.CORE.USER) ? void 0 : e.avatar).then(function() {}).catch(function(t) {
console.error("Failed to set player avatar:", t);
});
}
}
},
toggleSidebar: function(t) {
var e = this;
if (!this.isAnimating) {
var o = this.isShowing;
this.isShowing && (this.sidebarBg.active = !1);
this.isAnimating = !0;
this.sidebar.active = !0;
var i = this.isShowing ? this.posXhide : this.posXshow;
cc.tween(this.sidebar).to(.3, {
x: i
}, {
easing: "sineInOut"
}).call(function() {
e.sidebar.x = i;
e.isShowing = !o;
cc.CORE.GAME_SCENCE.isPopupOpen = e.isShowing;
e.isAnimating = !1;
if (e.isShowing) e.sidebarBg.active = !0; else {
t && t.node && (t.node.active = !0);
e.sidebarBg.active = !1;
}
}).start();
}
},
onClickContractor: function() {
cc.CORE.GAME_SCENCE.SicboPopup.show("contractor");
},
onClickTransfer: function() {
if ("private" != cc.CORE.GAME_SCENCE.ROOM.room_type) return cc.CORE.GAME_SCENCE.FastNotify("Tính năng chỉ áp dụng cho phòng riêng!", "info", 1, !1);
cc.CORE.GAME_SCENCE.SicboPopup.show("transfer");
},
onClickAudio: function() {
cc.CORE.GAME_SCENCE.PopupLobby.show("setting");
},
onClickHistoryBet: function() {
cc.CORE.GAME_SCENCE.PopupLobby.show("history_bet");
},
onClickTutorial: function() {
cc.CORE.GAME_SCENCE.SicboPopup.show("tutorial");
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Sicbo.ThongKe.SoiCau.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d891bobvAROGK0fF9cf7TLb", "Sicbo.ThongKe.SoiCau.Controller");
function o(t, e) {
var o = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (o) return (o = o.call(t)).next.bind(o);
if (Array.isArray(t) || (o = i(t)) || e && t && "number" == typeof t.length) {
o && (t = o);
var n = 0;
return function() {
return n >= t.length ? {
done: !0
} : {
done: !1,
value: t[n++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function i(t, e) {
if (t) {
if ("string" == typeof t) return n(t, e);
var o = Object.prototype.toString.call(t).slice(8, -1);
"Object" === o && t.constructor && (o = t.constructor.name);
return "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? n(t, e) : void 0;
}
}
function n(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var o = 0, i = new Array(e); o < e; o++) i[o] = t[o];
return i;
}
cc.Class({
extends: cc.Component,
properties: {
total_tai: cc.Label,
total_xiu: cc.Label,
TaiXiuCell: cc.Node,
total_row: 5,
total_colume: 11,
total_dice_colume: 11,
scrollView: {
default: null,
type: cc.Node
},
nodeResultDot: {
default: null,
type: cc.Node
},
prefabResultDot: {
default: null,
type: cc.Prefab
}
},
init: function(t) {
this.CORE = t;
this.TaiXiuCell = this.TaiXiuCell.children.map(function(t) {
t.CORE = t.children.map(function(t) {
return t.getComponent(cc.Sprite);
});
return t;
});
},
onScrollViewScrollToBottom: function() {
this.scrollView.getComponent(cc.ScrollView).scrollToRight(.5);
},
onLoad: function() {},
onData: function() {},
onClickDot: function(t) {
cc.log(t);
},
isTai: function(t) {
return t[0] + t[1] + t[2] >= 11;
},
isXiu: function(t) {
return t[0] + t[1] + t[2] <= 10;
},
countRedFaces: function(t) {
for (var e = 0, o = 0; o < t.length; o++) t[o] % 2 == 0 && e++;
return e;
},
isTriple: function(t) {
return t[0] === t[1] && t[1] === t[2];
},
countOccurrences: function(t, e) {
for (var i, n = 0, c = o(t); !(i = c()).done; ) i.value === e && n++;
return n;
},
toggle: function() {
this.node.active = !this.node.active;
this.onScrollViewScrollToBottom();
},
setThongKe: function() {
var t = this, e = this;
e.gameLogs = e.CORE.gameLogs;
e.gameLogCounts = e.CORE.gameLogCounts;
var i = -1, n = [], c = [];
new Promise(function(a) {
var r = e.gameLogs.slice();
r.reverse();
for (var s, u = o(r); !(s = u()).done; ) {
var l = s.value.result, d = e.isTai(l);
-1 === i && (i = d);
if (d !== i) {
if (c.length > 0) {
n.push(c);
c = [];
}
i = d;
}
c.push([ d ]);
if (c.length >= t.total_row) {
n.push(c);
c = [];
}
}
c.length > 0 && n.push(c);
a(n);
}).then(function(o) {
Promise.all(e.TaiXiuCell.map(function(t) {
t.active = !0;
return Promise.all(t.CORE.map(function(t) {
t.active = !0;
t.getComponent(cc.Sprite).spriteFrame = null;
t.node.children[0].getComponent(cc.Label).string = "";
}));
})).then(function() {});
var i = o;
i.reverse();
(i = i.slice(0, t.total_colume)).reverse();
Promise.all(e.TaiXiuCell.map(function(t, e) {
var o = i[e];
if (void 0 !== o) {
t.active = !0;
return Promise.all(t.CORE.map(function(t, e) {
var i = o[e];
if (void 0 !== i) {
var n = i[0], c = n ? "T" : "X";
t.active = !0;
t.session = 123;
t.node.setContentSize(35, 35);
t.node.children[0].getComponent(cc.Label).string = c;
t.node.children[0].getComponent(cc.Label).node.color = n ? cc.color().fromHEX("#FF0000") : cc.color().fromHEX("#D7D7DD");
} else t.active = !1;
}));
}
t.active = !1;
})).then(function() {
e.total_tai.string = e.gameLogCounts.tai;
e.total_xiu.string = e.gameLogCounts.xiu;
});
});
var a = e.gameLogs.slice(0, e.total_dice_colume);
a.reverse();
e.nodeResultDot.removeAllChildren();
Promise.all(a.map(function(t) {
var o = cc.instantiate(e.prefabResultDot), i = o.getComponent("Sicbo.ThongKe.SoiCau.DiceLog.Item.Controller");
i.init(t);
null != t && t.result && i.setSessionDiceLogs(t.result);
e.nodeResultDot.addChild(o);
})).then(function() {});
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Sicbo.ThongKe.SoiCau.DiceLog.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "e83afHWSDBH1pL80ZT5MtKy", "Sicbo.ThongKe.SoiCau.DiceLog.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
dice_1: {
default: null,
type: cc.Label
},
dice_2: {
default: null,
type: cc.Label
},
dice_3: {
default: null,
type: cc.Label
},
result_dices: {
default: null,
type: cc.Node
}
},
start: function() {},
init: function(t) {
this.CORE = t;
},
setSessionDiceLogs: function(t) {
t.sort(function(t, e) {
return t - e;
});
var e = cc.CORE.GAME_SCENCE.diceSprite;
this.result_dices.children.map(function(o, i) {
o.getComponent(cc.Sprite).spriteFrame = e[t[i]];
});
this.dice_1.string = t[0];
this.dice_2.string = t[1];
this.dice_3.string = t[2];
this.dice_1.node.color = 1 === t[0] || 4 === t[0] ? cc.Color.RED : cc.Color.WHITE;
this.dice_2.node.color = 1 === t[1] || 4 === t[1] ? cc.Color.RED : cc.Color.WHITE;
this.dice_3.node.color = 1 === t[2] || 4 === t[2] ? cc.Color.RED : cc.Color.WHITE;
}
});
cc._RF.pop();
}, {} ],
"Xocdia.Audio.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "03a90DwioJNXqXZTbI7rRKS", "Xocdia.Audio.Controller");
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
chip_bet: {
default: null,
type: cc.AudioSource
},
win_bet: {
default: null,
type: cc.AudioSource
},
refurn_bet: {
default: null,
type: cc.AudioSource
},
customer_tip: {
default: null,
type: cc.AudioSource
},
owner_leave: {
default: null,
type: cc.AudioSource
},
welcome: {
default: null,
type: cc.AudioSource
},
start_normal_bet: {
default: null,
type: cc.AudioSource
},
start_big_bet: {
default: null,
type: cc.AudioSource
},
stop_bet: {
default: null,
type: cc.AudioSource
},
res_white3: {
default: null,
type: cc.AudioSource
},
res_red3: {
default: null,
type: cc.AudioSource
},
res_red4: {
default: null,
type: cc.AudioSource
},
res_white4: {
default: null,
type: cc.AudioSource
},
res_double: {
default: null,
type: cc.AudioSource
}
},
start: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Chat.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "14222qMk7lJlYyS853d4c2o", "Xocdia.Chat.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputChat: cc.EditBox,
content: cc.Node,
itemChatPrefab: cc.Prefab,
itemChatQuickTextPrefab: cc.Prefab,
itemChatQuickEmojiPrefab: cc.Prefab,
chatMain_Node: cc.Node,
chatQuickText_Node: cc.Node,
chatQuickEmoji_Node: cc.Node,
contentQuickText: cc.Node,
contentQuickEmoji: cc.Node
},
init: function(t) {
var e = this;
this.CORE = t;
this.quickchat_text_list = [ "Dealer xinh quá !", "Đánh gì ae nhỉ ?", "Tay này Lẻ rồi !", "Tay này Chẵn rồi ! ", "Lẻ thừa này !", "Chẵn thừa này !", "Kết Lẻ ", "Kết chẵn ", "Chẵn vào nữa đi…", "Lẻ vào nữa đi …", "Thua quá !", "Lại thua… Cay thật !", "Đen quá !", "Còn cái nịt .", "Tất tay Lẻ ", "Tất tay Chẵn ", "Anh em theo tôi ", "3 Trắng rồi !", "3 Đỏ rồi !", "4 Trắng rồi !", "4 Đỏ rồi !", "Sấp Đôi rồi !" ];
this.quickchat_emoji_list = [ "EMO1", "EMO2", "EMO3", "EMO4", "EMO5", "EMO6", "EMO7", "EMO8", "EMO9", "EMO10", "EMO11", "EMO12", "EMO13", "EMO14", "EMO15", "EMO16", "EMO17", "EMO18", "EMO19", "EMO20", "ICONEMO" ];
this.contentQuickText.removeAllChildren();
this.quickchat_text_list.forEach(function(t) {
var o = cc.instantiate(e.itemChatQuickTextPrefab), i = o.getComponent("Xocdia.Chat.QuickText.Item.Controller");
i.init(e);
i.text.string = t;
e.contentQuickText.addChild(o);
});
this.contentQuickEmoji.removeAllChildren();
this.quickchat_emoji_list.forEach(function(t) {
var o = cc.instantiate(e.itemChatQuickEmojiPrefab), i = o.getComponent("Xocdia.Chat.QuickEmoji.Item.Controller");
i.init(e);
i.setEmoji(t);
e.contentQuickEmoji.addChild(o);
});
},
onEnable: function() {
this.chatMain_Node.active = !0;
this.chatQuickText_Node.active = !1;
this.chatQuickEmoji_Node.active = !1;
},
toggle: function() {
this.node.active = !this.node.active;
},
openChatBoard: function() {
this.node.active = !0;
},
closeChatBoard: function() {
this.node.active = !1;
},
openChatTab: function(t, e) {
this.node.active = !0;
if ("text" == e) {
this.chatMain_Node.active = !1;
this.chatQuickText_Node.active = !0;
this.chatQuickEmoji_Node.active = !1;
} else if ("emoji" == e) {
this.chatMain_Node.active = !1;
this.chatQuickText_Node.active = !1;
this.chatQuickEmoji_Node.active = !0;
} else {
this.chatMain_Node.active = !0;
this.chatQuickText_Node.active = !1;
this.chatQuickEmoji_Node.active = !1;
}
},
sendMessage: function() {
if (!(this.inputChat.string.length <= 0)) {
if (this.inputChat.string.length > 80) return cc.CORE.GAME_SCENCE.FastNotify("Nội dung chat quá dài!", "info", 1, !1);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
chat: {
send_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
message: this.inputChat.string,
type: "text"
}
}
}
}
});
this.inputChat.string = "";
}
},
onClickChatQuickTextItem: function(t) {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
chat: {
send_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
message: t,
type: "text"
}
}
}
}
});
this.openChatTab(null, null);
},
onClickChatQuickEmojiItem: function(t) {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
chat: {
send_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
message: t,
type: "emoji"
}
}
}
}
});
this.openChatTab(null, null);
this.openChatTab(null, null);
},
MessagePush: function(t, e, o, i, n) {
void 0 === i && (i = "#FFC200");
void 0 === n && (n = "#FFFFFF");
var c = cc.instantiate(this.itemChatPrefab), a = c.getComponent("Xocdia.Chat.Item.Controller");
a.init(this);
a.addMessage(t, e, o, i, n);
this.content.addChild(c);
},
onData: function(t) {
var e = this;
void 0 !== t.get_chat && t.get_chat.forEach(function(t) {
e.MessagePush(t.type, t.nickname, t.content, t.color_username, t.color_content);
});
if (void 0 !== t.new_chat) {
var o = t.new_chat;
this.MessagePush(o.type, o.nickname, o.content, o.color_username, o.color_content);
}
}
});
cc._RF.pop();
}, {} ],
"Xocdia.Chat.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "9eb44UhnGRE0IGX9HLjNxQf", "Xocdia.Chat.Item.Controller");
function o(t, e) {
var o = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (o) return (o = o.call(t)).next.bind(o);
if (Array.isArray(t) || (o = i(t)) || e && t && "number" == typeof t.length) {
o && (t = o);
var n = 0;
return function() {
return n >= t.length ? {
done: !0
} : {
done: !1,
value: t[n++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function i(t, e) {
if (t) {
if ("string" == typeof t) return n(t, e);
var o = Object.prototype.toString.call(t).slice(8, -1);
"Object" === o && t.constructor && (o = t.constructor.name);
return "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? n(t, e) : void 0;
}
}
function n(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var o = 0, i = new Array(e); o < e; o++) i[o] = t[o];
return i;
}
var c = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
message_text: cc.RichText,
message_emoji: cc.Node
},
init: function(t) {
this.CORE = t;
},
onEnable: function() {},
wrapText: function(t) {
for (var e, i = [], n = "", c = !1, a = o(t.split(" ")); !(e = a()).done; ) {
var r = e.value;
if ((n + (n ? " " : "") + r).length + this.username.string.length <= 46) n += (n ? " " : "") + r; else {
if (n) {
i.push(n);
c = !0;
}
n = r;
}
}
n && i.push(n);
return {
text: i.join("\n"),
isWrapped: c
};
},
addMessage: function(t, e, o, i, n) {
var a = this;
this.username.string = e;
this.username.node.color = cc.color().fromHEX(i);
if ("text" == t) {
this.message_text.node.active = !0;
this.message_emoji.active = !1;
var r = this.wrapText(o), s = "<color=" + n + ">" + r.text + "</color>";
this.message_text.string = s;
setTimeout(function() {
a.node.height = a.message_text.node.height + (r.isWrapped ? 20 : 0);
}, 100);
} else if ("emoji" == t) {
this.message_text.node.active = !1;
this.message_emoji.active = !0;
c.loadFromBundle("Common_Bundle", "Images/Emojis/" + o, cc.SpriteFrame).then(function(t) {
a.message_emoji.children[0].getComponent(cc.Sprite).spriteFrame = t;
}).catch(function(t) {
return console.error("❌ Error loading:", t);
});
}
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Xocdia.Chat.QuickEmoji.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "69171WI+4NLwqxCISb7QhrY", "Xocdia.Chat.QuickEmoji.Item.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {},
init: function(t) {
this.CORE = t;
},
setEmoji: function(t) {
var e = this;
this.text = t;
o.loadFromBundle("Common_Bundle", "Images/Emojis/" + t, cc.SpriteFrame).then(function(t) {
e.node.getComponent(cc.Sprite).spriteFrame = t;
}).catch(function(t) {
return console.error("❌ Error loading:", t);
});
},
onClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickChatQuickEmojiItem(this.text);
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Xocdia.Chat.QuickText.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d7105qmoV5J8IN7CE/KzPdr", "Xocdia.Chat.QuickText.Item.Controller");
cc.Class({
extends: cc.Component,
properties: {
text: cc.Label
},
init: function(t) {
this.CORE = t;
},
onClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
this.CORE.onClickChatQuickTextItem(this.text.string);
}
});
cc._RF.pop();
}, {} ],
"Xocdia.ClockOverlayManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "5cd3aFGwENKvLBkChGAmw6A", "Xocdia.ClockOverlayManager");
var o = {
id: "cocos-timer-overlay",
create: function(t) {
void 0 === t && (t = "00");
},
updateFixedPosition: function(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
},
setText: function() {},
hide: function() {},
show: function() {},
destroy: function() {}
};
window.ClockOverlayManager = o;
e.exports = o;
cc._RF.pop();
}, {} ],
"Xocdia.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "dfa68m3wWxBZLrlDVyg1jBa", "Xocdia.Controller");
function o(t, e) {
var o = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (o) return (o = o.call(t)).next.bind(o);
if (Array.isArray(t) || (o = i(t)) || e && t && "number" == typeof t.length) {
o && (t = o);
var n = 0;
return function() {
return n >= t.length ? {
done: !0
} : {
done: !1,
value: t[n++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function i(t, e) {
if (t) {
if ("string" == typeof t) return n(t, e);
var o = Object.prototype.toString.call(t).slice(8, -1);
"Object" === o && t.constructor && (o = t.constructor.name);
return "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? n(t, e) : void 0;
}
}
function n(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var o = 0, i = new Array(e); o < e; o++) i[o] = t[o];
return i;
}
function c() {
return (c = Object.assign ? Object.assign.bind() : function(t) {
for (var e = 1; e < arguments.length; e++) {
var o = arguments[e];
for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (t[i] = o[i]);
}
return t;
}).apply(this, arguments);
}
var a = t("LocalStorage"), r = t("AssetManager"), s = t("Xocdia.Audio.Controller"), u = t("Xocdia.KeyBoardManager"), l = t("Xocdia.Dealer.KeyBoardManager");
t("Xocdia.Init.Util")();
var d = t("Xocdia.ClockOverlayManager"), h = t("Xocdia.PlayerCountOverlayManager"), p = t("Xocdia.ResultDotOverlayManager"), C = t("Xocdia.Popup.Controller"), f = t("Xocdia.ThongKe.SoiCau.Controller"), m = t("Xocdia.ThongKe.SoiCau.Controller"), E = t("Xocdia.Chat.Controller"), _ = t("Xocdia.Notify.Controller");
cc.Class({
extends: cc.Component,
properties: {
Audio: s,
font: {
default: [],
type: cc.BitmapFont
},
txtVideoStream: cc.Label,
VideoStream: cc.WebView,
GameMain: cc.Node,
diceSprite: {
default: [],
type: cc.SpriteFrame
},
balance: cc.Label,
total_bet: cc.Label,
contractor_username: cc.Label,
contractor_balance: cc.Label,
username_sidebar: cc.Label,
balance_sidebar: cc.Label,
session_sidebar: cc.Label,
time_remain: cc.Label,
gameDicesResult: cc.Node,
gamePlayerCount: cc.Label,
gameNodeChipBet: {
default: [],
type: cc.Node
},
gameNodeBet: {
default: [],
type: cc.Node
},
sideBar: cc.Node,
miniNotifyPrefab: {
default: null,
type: cc.Prefab
},
nodeNotify: {
default: null,
type: cc.Node
},
prefabNode: {
default: null,
type: cc.Node
},
XocdiaPopup: C,
XocdiaSoiCau: f,
XocdiaSoiCau2: m,
XocdiaChat: E,
XocdiaNotify: _
},
start: function() {},
init: function() {
cc.CORE.GAME_SCENCE = this;
},
onEnable: function() {
var t = this;
cc.CORE.AUDIO.playSound(this.Audio.welcome);
cc.CORE.NETWORK.APP.UTIL.UpdateScene("XOCDIA");
setTimeout(function() {
cc.sys.isNative && t.FixScreenNative();
}, 200);
void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED && cc.CORE.NETWORK.DEALER.Send({
event: "dealer_join_room",
data: {
game: cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
});
this.OffWinNode();
this.SetDiceResult(!1);
this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
this.setCurrentMeBetAmountNodeBet(!0);
this.getRoomConfig();
this.getUserInfo();
this.getMeBet();
this.getLogs();
this.getChat();
this.intervalCheckUserInfo = setInterval(function() {
cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN && t.getUserInfo();
}, 5e3);
this.ClockOverlayManager = d;
this.PlayerCountOverlayManager = h;
this.ResultDotOverlayManager = p;
},
onLoad: function() {
var t = this;
cc.CORE.GAME_SCENCE = this;
u.init();
this.gameNodeBet.forEach(function(e) {
return e.on(cc.Node.EventType.TOUCH_END, t.PlayChipBet, t);
});
this.gameNodeBet.forEach(function(e) {
return e.on(cc.Node.EventType.TOUCH_END, t.onClickBet, t);
});
this.gameNodeChipBet.forEach(function(e) {
e.on(cc.Node.EventType.TOUCH_END, t.onChangerSelectChipShow, t);
});
this.username_sidebar.string = cc.CORE.USER.nickname ? cc.CORE.USER.nickname.toUpperCase() : cc.CORE.USER.username.toUpperCase();
this.isIframeOverlayCreated = !1;
this.positionVideoStream = this.VideoStream.node.position;
window.addEventListener("resize", function() {
t.positionVideoStream = t.VideoStream.node.position;
});
this.ROOM = {};
this.user_balance = 0;
this.gameLogs = [];
this.gameState = null;
this.newInGame = !0;
this.newInGameSetDiceResult = !1;
this.audioStatus = !0;
this.amountCurrent = 1e4;
this.isClickToBet = !1;
this.amountRefurn = 0;
this.gameNodeBetMap = new Map();
this.gameNodeBet.forEach(function(e) {
return t.gameNodeBetMap.set(e.name, e);
});
this.XocdiaPopup.init(this);
this.XocdiaSoiCau.init(this);
this.XocdiaSoiCau2.init(this);
this.XocdiaChat.init(this);
this.sideBar.getComponent("Xocdia.Sidebar.Controller").init(this);
this.isCheckPopupOpen = !0;
this.isPopupOpen = !1;
this.currentPopupOpen = null;
this.InitPopupPrefab();
this.DealerKeyLatest = null;
this.DealerLockedPressKey = !1;
},
FixScreenNative: function() {
cc.log("FixScreenNative");
var t = this.VideoStream.node.position.y;
this.VideoStream.node.setPosition(cc.v2(0, t - 90));
this.GameMain.setPosition(cc.v2(0, this.GameMain.position.y - 90));
},
InitPopupPrefab: function() {
var t = this;
r.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Lobby.Popup", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
o.name = "Lobby.Popup";
var i = o.getComponent("Lobby.Popup.Controller");
t.PopupLobby = i;
i.init(t);
t.prefabNode.addChild(o);
}).catch(function(t) {
return console.error("❌ Error loading prefab:", t);
});
},
onData: function(t) {
void 0 !== t.event && "game" == t.event && void 0 !== t.data.xocdia && this.Xocdia(t.data.xocdia);
void 0 !== t.event && "history_bet" == t.event && void 0 !== t.data && this.PopupLobby.HistoryBet.onData(t.data);
void 0 !== t.event && "notification" == t.event && this.onDataNotify(t.data);
if (void 0 !== t.event && "user" == t.event) {
var e = t.data;
if (void 0 !== e.user && void 0 !== e.user.balance && "public" == this.ROOM.room_type) {
this.user_balance = e.user.balance;
this.balance.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
this.user_balance.toString().length >= 9 ? this.balance_sidebar.string = cc.CORE.UTIL.abbreviateNumber(this.user_balance, 2) : this.balance_sidebar.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
}
void 0 !== e.user && void 0 !== e.user.verify && void 0 !== e.user.phone && e.user.verify && null !== e.user.phone && (cc.CORE.USER = c({}, cc.CORE.USER, e.user));
}
},
onDataNotify: function(t) {
if (void 0 !== t.notify_data) {
if (void 0 !== t.notify_type && "common" == t.notify_type) {
var e = void 0 !== t.notify_data.time ? t.notify_data.time : 1;
this.FastNotify(t.notify_data.message, t.notify_data.type, e, !1);
}
void 0 !== t.notify_type && "transfer" == t.notify_type && this.FastNotify(t.notify_data.message, t.notify_data.type, notifyTime, !0);
void 0 !== t.notify_type && "notify" == t.notify_type && this.XocdiaNotify.showNotify("Thông báo", t.notify_data.message);
if (void 0 !== t.notify_type && "xocdia" == t.notify_type) {
var o = void 0 !== t.notify_data.time ? t.notify_data.time : 1;
this.FastNotifyXocdia(t.notify_data.message, t.notify_data.type, o, !1);
}
}
},
Xocdia: function(t) {
var e = this, o = t.data;
if (void 0 !== o.get_info_room) {
this.ROOM = c({}, this.ROOM, o.get_info_room);
this.setupRoom(o.get_info_room);
}
void 0 !== o.request_join && this.XocdiaPopup.show("request_join_room", o.request_join);
void 0 !== o.leave && o.leave.leave && this.outGameByServer(o.leave);
void 0 !== o.owner_leave && this.XocdiaPopup.show("owner_leave");
if (void 0 !== o.get_logs) {
this.gameLogs = o.get_logs.data;
this.gameLogCounts = {
even: o.get_logs.total_even,
odd: o.get_logs.total_odd
};
this.XocdiaSoiCau.setThongKe();
this.XocdiaSoiCau2.setThongKe();
}
if (void 0 !== o.user && void 0 !== o.user.balance) {
this.user_balance = o.user.balance;
this.balance.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
this.user_balance.toString().length >= 9 ? this.balance_sidebar.string = cc.CORE.UTIL.abbreviateNumber(this.user_balance, 4) : this.balance_sidebar.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
}
void 0 !== o.session && (this.ROOM.session = o.session);
if (void 0 !== o.time_remain) {
this.time_remain.string = cc.CORE.UTIL.numberPad(o.time_remain, 2);
d.setText(cc.CORE.UTIL.numberPad(o.time_remain, 2));
0 == o.time_remain && "start_big_bet" == this.gameState && setTimeout(function() {
cc.CORE.AUDIO.playSound(e.Audio.stop_bet);
}, 1500);
}
if (void 0 !== o.state) {
this.gameState = o.state;
if ("start_big_bet" == this.gameState) {
this.cleanFastNotify();
cc.CORE.AUDIO.playSound(this.Audio.start_big_bet);
}
this.gameState && (this.isClickToBet = !1);
}
if (void 0 !== o.finish) {
this.cleanFastNotify();
void 0 !== o.finish.door_win && this.SetWinNode(o.finish.door_win);
if (void 0 !== o.finish.results) {
this.SetDiceResult(!0, o.finish.results);
this.SetDiceResultSound(!0, o.finish.results);
}
this.getLogs();
setTimeout(function() {
e.OffWinNode();
e.SetDiceResult(!1);
e.setDefaultCurrentBetAmountNodeBet(e.gameNodeBet);
e.setCurrentMeBetAmountNodeBet(!0);
e.total_bet.string = 0;
}, 5e3);
}
if (void 0 !== o.new_game && o.new_game) {
this.OffWinNode();
this.SetDiceResult(!1);
this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
this.setCurrentMeBetAmountNodeBet(!0);
this.total_bet.string = 0;
cc.CORE.AUDIO.playSound(this.Audio.start_normal_bet);
}
if (void 0 !== o.bet_data) {
var i = o.bet_data;
void 0 !== i.bet_door_amount && this.setUsersBetCurrent(i.bet_door_amount);
i.bet_door_player;
}
if (void 0 !== o.me_bet) {
var n = o.me_bet;
void 0 !== n.bet_door && this.setMebetCurrent(n.bet_door);
}
void 0 !== o.bet_status && o.bet_status && this.getMeBet();
if (void 0 !== o.call_update && o.call_update) {
this.getUserInfo();
this.getMeBet();
}
if (void 0 !== o.refurn) {
this.amountRefurn += o.refurn.refurn;
void 0 !== this.taskRefurn && clearTimeout(this.taskRefurn);
this.taskRefurn = setTimeout(function() {
e.TextMoneyFly(!0, e.amountRefurn, "Hoàn");
cc.CORE.AUDIO.playSound(e.Audio.refurn_bet);
setTimeout(function() {
e.amountRefurn = 0;
}, 5e3);
}, 1500);
}
if (void 0 !== o.status) {
this.setStatusWinLose(o.status);
this.getUserInfo();
}
if (void 0 !== o.contractor) {
if (void 0 !== o.contractor.user && null !== o.contractor.user) {
this.contractor_balance.string = cc.CORE.UTIL.numberWithCommas(o.contractor.user.balance);
this.contractor_username.string = o.contractor.user.nickname;
}
void 0 !== o.contractor.get_list && this.XocdiaPopup.Contractor.onData(o.contractor.get_list);
}
void 0 !== o.chat && this.XocdiaChat.onData(o.chat);
void 0 !== o.get_history_bet && this.XocdiaPopup.History_Bet.onData(o.get_history_bet);
void 0 !== o.check_transfer && this.XocdiaPopup.Transfer.onData(o.check_transfer);
if (void 0 !== o.dealer) {
void 0 !== o.dealer.locked_press_key && (this.DealerLockedPressKey = o.dealer.locked_press_key);
void 0 !== o.dealer.show_confirm_result && (this.XocdiaPopup.Dealer_Confirm_Result.node.active = o.dealer.show_confirm_result);
void 0 !== o.dealer.set_confirm_result && this.XocdiaPopup.Dealer_Confirm_Result.setResultDoor(o.dealer.set_confirm_result);
void 0 !== o.dealer.customer_tip && this.XocdiaPopup.Customer_Tip.show(o.dealer.customer_tip);
}
},
getRoomConfig: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
get_info_room: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
},
getUserInfo: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
user: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
},
getMeBet: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
me_bet: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
},
getLogs: function(t) {
void 0 === t && (t = 100);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
get_logs: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
limit: t
}
}
}
});
},
getChat: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
chat: {
get_chat: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
},
setupRoom: function(t) {
void 0 !== t.stream && this.setStream(!0, t.stream);
if (void 0 !== t.time_remain) {
this.time_remain.string = cc.CORE.UTIL.numberPad(t.time_remain, 2);
d.setText(cc.CORE.UTIL.numberPad(t.time_remain, 2));
}
void 0 !== t.room_code && (this.session_sidebar.string = t.room_code);
t.session;
void 0 !== t.ratio && this.setRatioBet(t.ratio);
void 0 !== t.player_count && (this.gamePlayerCount.string = cc.CORE.UTIL.numberWithCommas(t.player_count));
if (void 0 !== t.contractor) {
if (null !== t.contractor) {
this.contractor_balance.string = cc.CORE.UTIL.numberWithCommas(t.contractor.balance, 2);
this.contractor_username.string = t.contractor.nickname;
}
if (null == t.contractor) {
this.contractor_balance.string = "";
this.contractor_username.string = "";
}
}
},
setStream: function(t, e) {
void 0 === t && (t = !0);
void 0 === e && (e = null);
t && (this.VideoStream.node.active = !0);
var o = t ? 0 : 5e3;
this.VideoStream.node.setPosition(o, this.VideoStream.node.position.y);
e && (this.VideoStream.url = e);
},
setRatioBet: function(t) {
var e = this, o = t, i = o.fee;
Object.entries(o).forEach(function(t) {
var o = t[0], n = t[1];
if ("fee" != o) {
var c = n.win, a = e.gameNodeBetMap.get(o);
if (a) {
var r = a.getChildByName("name_ratio").getChildByName("ratio");
if ("even" == o || "odd" == o) {
c = n.bet * n.win * (1 - i / 100);
r.getComponent(cc.Label).string = "(" + n.bet + "x" + c + ")";
} else r.getComponent(cc.Label).string = "white4" == o || "white3" == o || "red4" == o || "red3" == o ? "(" + n.bet + "x" + c + ")" : "(" + n.bet + ":" + c + ")";
}
}
});
},
setStatusWinLose: function(t) {
if (t.total_win > 0) {
var e = t.total_win + t.total_bet - t.total_lose;
this.TextMoneyFly(!0, e);
cc.CORE.AUDIO.playSound(this.Audio.win_bet);
} else if (t.total_lose > 0) {
var o = t.total_lose;
this.TextMoneyFly(!1, o);
}
},
SetDiceResult: function(t, e) {
void 0 === t && (t = !1);
void 0 === e && (e = []);
var o = this;
if (!Array.isArray(e) || e.length !== o.gameDicesResult.children.length) return o.gameDicesResult.active = !1;
o.gameDicesResult.active = t;
o.gameDicesResult.children.forEach(function(t, i) {
var n = t.getComponent(cc.Sprite);
if (n) {
var c = e[i];
n.spriteFrame = o.diceSprite[c ? 1 : 0];
}
});
},
getWinningDoorsSoundName: function(t) {
var e = t.filter(Boolean).length, o = 4 - e;
return 2 == e && 2 == o ? "res_double" : 3 == e ? "res_red3" : 4 == e ? "res_red4" : 3 == o ? "res_white3" : 4 == o ? "res_white4" : void 0;
},
SetDiceResultSound: function(t, e) {
void 0 === t && (t = !1);
void 0 === e && (e = []);
this.gameDicesResult.active = t;
if (Array.isArray(e) && e.length === this.gameDicesResult.children.length) {
var o = this.getWinningDoorsSoundName(e);
o && cc.CORE.AUDIO.playSound(this.Audio[o]);
}
},
OffWinNode: function() {
for (var t, e = o(this.gameNodeBet.entries()); !(t = e()).done; ) {
var i = t.value, n = (i[0], i[1]);
if (n.children && n.children.length > 0) {
var c = n.children.find(function(t) {
return "active" === t.name;
});
c && (c.active = !1);
}
}
},
SetWinNode: function(t) {
var e = this;
e.OffWinNode();
t.map(function(t) {
return e.gameNodeBetMap.get(t).getChildByName("active").active = !0;
});
},
setDefaultCurrentBetAmountNodeBet: function(t) {
Promise.all(t.map(function(t) {
var e = t.getChildByName("txt_users_bet").getComponent(cc.Label);
e && (e.string = "0");
}));
},
setUsersBetCurrent: function(t) {
var e = this;
Object.entries(t).forEach(function(t) {
var o = t[0], i = t[1], n = e.gameNodeBetMap.get(o);
if (n) {
var c = n.getChildByName("txt_users_bet").getComponent(cc.Label);
c && (c.string = cc.CORE.UTIL.abbreviateNumber(i, 2));
}
});
},
setMebetCurrent: function(t) {
for (var e = 0, o = Object.entries(t.data); e < o.length; e++) {
var i = o[e], n = i[0], c = i[1];
this.setCurrentMeBetAmountNodeBet(!1, n, c);
}
this.total_bet.string = cc.CORE.UTIL.abbreviateNumber(t.total, 2);
},
setCurrentMeBetAmountNodeBet: function(t, e, o) {
void 0 === t && (t = !0);
void 0 === e && (e = null);
void 0 === o && (o = 0);
if (t) this.gameNodeBet.map(function(t) {
var e = t.getChildByName("me_bet");
if (e) {
var o = e.getChildByName("txt_me_bet").getComponent(cc.Label);
o && (o.string = "");
}
e.active = !1;
}); else if (null === e) ; else {
var i = this.gameNodeBetMap.get(e).getChildByName("me_bet");
if (i) {
var n = i.getChildByName("txt_me_bet").getComponent(cc.Label);
n && (n.string = cc.CORE.UTIL.abbreviateNumber(o, 2));
}
i.active = o > 0;
}
},
onClickBet: function(t) {
this.gameState && (this.isClickToBet = !0);
var e = t.target.name;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
bet: {
room_code: this.ROOM.room_code,
door: e,
amount: this.amountCurrent
}
}
}
});
},
onClickRepeatBet: function() {
this.isClickToBet || cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
repeat_bet: {
room_code: this.ROOM.room_code
}
}
}
});
},
onClickCancelBet: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
cancel_bet: {
room_code: this.ROOM.room_code
}
}
}
});
},
onClickTipDealer: function() {
this.XocdiaPopup.show("tip");
},
onClickLeaveGame: function() {
this.XocdiaPopup.show("leave");
},
onClickLobbyTransfer: function() {
this.PopupLobby.show("transfer");
},
onClickLobbyVerifyPhone: function() {
this.PopupLobby.show("verify_phone");
},
onClickLobbyPayment: function() {
this.PopupLobby.show("payment");
},
onChangerSelectChipShow: function(t) {
var e = Number(t.target.name);
this.gameNodeChipBet.map(function(t) {
e == Number(t.name) ? t.children[1].active = !0 : t.children[1].active = !1;
});
this.amountCurrent = e;
},
toggleSidebar: function() {
this.sideBar.getComponent("Xocdia.Sidebar.Controller").toggleSidebar(this.VideoStream);
},
reConnect: function() {
var t = this;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
join: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD
}
}
}
});
setTimeout(function() {
t.getRoomConfig();
t.getUserInfo();
t.getMeBet();
}, 1e3);
},
outGameByServer: function() {
this.ClockOverlayManager.destroy();
this.PlayerCountOverlayManager.destroy();
this.ResultDotOverlayManager.destroy();
clearInterval(this.intervalCheckUserInfo);
void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED && cc.CORE.NETWORK.DEALER.Send({
event: "dealer_leave_room",
data: {
game: cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
});
cc.CORE.GAME_ROOM.clean();
a.removeItem("IN_GAME_ROOM");
cc.director.loadScene("Lobby");
},
cleanFastNotify: function() {
this.prefabNode.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
},
FastNotify: function(t, e, o, i, n, c) {
void 0 === t && (t = "");
void 0 === e && (e = "success");
void 0 === o && (o = 3);
void 0 === i && (i = !0);
void 0 === n && (n = .5);
void 0 === c && (c = !0);
if (i || !this.isPopupOpen) {
c && this.prefabNode.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
var a = cc.instantiate(this.miniNotifyPrefab);
a.getComponent("Xocdia.Fast_Notify.Controller").init({
text: t,
type: e,
showTime: o,
animationTime: n
});
this.prefabNode.addChild(a);
}
},
FastNotifyXocdia: function(t, e, o, i, n, c) {
void 0 === t && (t = "");
void 0 === e && (e = "success");
void 0 === o && (o = 3);
void 0 === i && (i = !0);
void 0 === n && (n = .5);
void 0 === c && (c = !0);
if (i || !this.isPopupOpen) {
c && this.nodeNotify.children.map(function(t) {
try {
"Fast_Notify" == t.name && cc.isValid(t) && t.destroy();
} catch (t) {
cc.log(t);
}
});
var a = cc.instantiate(this.miniNotifyPrefab);
a.getComponent("Xocdia.Fast_Notify.Controller").init({
text: t,
type: e,
showTime: o,
animationTime: n
});
this.nodeNotify.addChild(a);
}
},
TextMoneyFly: function(t, e, o) {
void 0 === o && (o = "");
var i = new cc.Node();
i.addComponent(cc.Label);
(i = i.getComponent(cc.Label)).string = o + " " + (t ? "+" : "-") + cc.CORE.UTIL.numberWithCommas(e);
i.font = this.font[0];
i.node.color = "Hoàn" == o ? cc.Color.WHITE : t ? cc.Color.GREEN : cc.Color.RED;
i.lineHeight = 50;
i.fontSize = 50;
i.node.position = cc.v2(-7, -375);
this.prefabNode.addChild(i.node);
i.node.runAction(cc.sequence(cc.moveTo(2, cc.v2(-7, -185)), cc.callFunc(function() {
try {
this.node.destroy();
} catch (t) {
console.log(t);
}
}, i)));
},
PlayClick: function() {
cc.CORE.AUDIO.playSound(this.Audio.click);
},
PlayChipBet: function() {
cc.CORE.AUDIO.playSound(this.Audio.chip_bet);
},
onClickContact: function(t, e) {
void 0 === e && (e = "TELEGRAM_GROUP");
this.PopupLobby.show("contact");
},
playVideo: function() {
this.controlVideo("play");
},
pauseVideo: function() {
this.controlVideo("pause");
},
controlVideo: function() {},
update: function(t) {
var e = this;
"finish" !== this.gameState && this.OffWinNode();
"start_normal_bet" == this.gameState ? d.show() : "start_big_bet" == this.gameState ? d.show() : "finish" == this.gameState ? d.hide() : null == this.gameState && ("00" !== this.time_remain.string ? d.show() : d.hide());
if (void 0 !== this.PopupLobby && this.isCheckPopupOpen) {
this.isPopupOpen = !1;
this.currentPopupOpen = null;
this.PopupLobby.node.children.forEach(function(t) {
if (t.active) {
e.currentPopupOpen = t.name;
e.isPopupOpen = !0;
}
});
this.setStream(!this.isPopupOpen);
if (this.isPopupOpen) {
d.hide();
h.hide();
p.hide();
} else h.show();
}
cc.sys.isBrowser && void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED && l.handleInput(t);
}
});
cc._RF.pop();
}, {
AssetManager: void 0,
LocalStorage: void 0,
"Xocdia.Audio.Controller": "Xocdia.Audio.Controller",
"Xocdia.Chat.Controller": "Xocdia.Chat.Controller",
"Xocdia.ClockOverlayManager": "Xocdia.ClockOverlayManager",
"Xocdia.Dealer.KeyBoardManager": "Xocdia.Dealer.KeyBoardManager",
"Xocdia.Init.Util": "Xocdia.Init.Util",
"Xocdia.KeyBoardManager": "Xocdia.KeyBoardManager",
"Xocdia.Notify.Controller": "Xocdia.Notify.Controller",
"Xocdia.PlayerCountOverlayManager": "Xocdia.PlayerCountOverlayManager",
"Xocdia.Popup.Controller": "Xocdia.Popup.Controller",
"Xocdia.ResultDotOverlayManager": "Xocdia.ResultDotOverlayManager",
"Xocdia.ThongKe.SoiCau.Controller": "Xocdia.ThongKe.SoiCau.Controller"
} ],
"Xocdia.Dealer.KeyBoardManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "b75ba7LXitLApuYcRJ/tp7A", "Xocdia.Dealer.KeyBoardManager");
var o = t("Xocdia.KeyBoardManager"), i = cc.macro.KEY, n = {
handleInput: function(t) {
o.update(t);
for (var e = 0; e <= 9; e++) {
var n = i["num" + e];
if (o.wasKeyJustPressed(n)) {
this.onNumberPressed(e);
o.consumeJustPressed(n);
}
}
if (o.wasKeyJustPressed(i.enter) || o.wasKeyJustPressed(108)) {
this.onEnterPressed();
o.consumeJustPressed(i.enter);
o.consumeJustPressed(108);
}
},
onNumberPressed: function(t) {
cc.log("[DealerKeyboardManager] Bấm số:", t);
if (void 0 !== t && void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, !1);
cc.CORE.GAME_SCENCE.DealerKeyLatest = t;
cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím lên máy chủ:", t);
cc.CORE.NETWORK.DEALER.Send({
event: "dealer_machine_signal",
data: {
command: String(t),
confirm: !1
}
});
}
},
onEnterPressed: function() {
cc.log("[DealerKeyboardManager] Bấm phím Enter");
if (void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) if (void 0 !== cc.CORE.GAME_SCENCE.DealerKeyLatest) {
if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, !1);
cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím Enter lên máy chủ với confirm=true");
cc.CORE.NETWORK.DEALER.Send({
event: "dealer_machine_signal",
data: {
command: String(cc.CORE.GAME_SCENCE.DealerKeyLatest),
confirm: !0
}
});
} else cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Không có phím nào được lưu để confirm");
}
};
e.exports = n;
cc._RF.pop();
}, {
"Xocdia.KeyBoardManager": "Xocdia.KeyBoardManager"
} ],
"Xocdia.Fast_Notify.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "0c393udrwVHEqwuaDa9PK2l", "Xocdia.Fast_Notify.Controller");
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
var e = cc.scaleTo(.3, 1).easing(cc.easeBackOut()), o = cc.delayTime(this.showTime || 2), i = cc.scaleTo(.3, 0).easing(cc.easeBackIn()), n = cc.callFunc(function() {
if (cc.isValid(t.node)) try {
t.node.destroy();
} catch (t) {
console.log(t);
}
}), c = cc.sequence(e, o, i, n);
this.node.runAction(c);
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Init.Util": [ function(t, e) {
"use strict";
cc._RF.push(e, "a9632e0fo1CHoxtqOM8kv/I", "Xocdia.Init.Util");
e.exports = function() {};
cc._RF.pop();
}, {} ],
"Xocdia.KeyBoardManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "d0dc4kLOABI0KMU0ysHe8MH", "Xocdia.KeyBoardManager");
var o = {}, i = {}, n = {}, c = {
init: function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
},
_onKeyDown: function(t) {
o[t.keyCode] || (n[t.keyCode] = !0);
o[t.keyCode] = !0;
},
_onKeyUp: function(t) {
o[t.keyCode] = !1;
i[t.keyCode] = 0;
},
isKeyPressed: function(t) {
return !!o[t];
},
wasKeyJustPressed: function(t) {
return !0 === n[t];
},
consumeJustPressed: function(t) {
n[t] = !1;
},
canUseKey: function(t) {
return !i[t] || i[t] <= 0;
},
consumeKey: function(t, e) {
void 0 === e && (e = .2);
i[t] = e;
},
update: function(t) {
for (var e in i) i[e] > 0 && (i[e] -= t);
},
destroy: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
}
};
e.exports = c;
cc._RF.pop();
}, {} ],
"Xocdia.Notify.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "a07693WsLZHZrBv8PATts5U", "Xocdia.Notify.Controller");
cc.Class({
extends: cc.Component,
properties: {
title: cc.Label,
label: cc.Label
},
onLoad: function() {},
showNotify: function(t, e) {
this.title.string = t;
this.label.string = e;
this.node.active = !0;
},
hideNotify: function() {
this.node.active = !1;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.PlayerCountOverlayManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "3ec65ir1g9LMrVbD7MY3Ya3", "Xocdia.PlayerCountOverlayManager");
var o = {
id: "cocos-players-count-overlay",
textId: "cocos-players-count-overlay-txt",
create: function(t) {
void 0 === t && (t = "0");
},
updateFixedPosition: function(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
},
setText: function() {},
hide: function() {},
show: function() {},
destroy: function() {}
};
window.ClockOverlayManager = o;
e.exports = o;
cc._RF.pop();
}, {} ],
"Xocdia.Popup.Contractor.Confirm.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d1c93pZCapNsq/kLiyjqTju", "Xocdia.Popup.Contractor.Confirm.Controller");
cc.Class({
extends: cc.Component,
properties: {
label_txt: cc.Label,
btn_confirm: cc.Node,
btn_cancel: cc.Node
},
init: function(t) {
this.CORE = t;
this.type = null;
this.data = null;
},
onLoad: function() {},
onEnable: function() {},
clickConfirm: function() {
var t = this;
cc.CORE.GAME_SCENCE.PlayClick();
if (this.type) {
"register" == this.type && cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
contractor: {
register: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
"cancel" == this.type && cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
contractor: {
cancel: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
if ("set_contractor" == this.type) {
if (!this.data) return;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
contractor: {
set: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
request_id: this.data.id
}
}
}
}
});
}
this.toggle();
setTimeout(function() {
t.CORE.Contractor.getListContractor();
}, 800);
}
},
toggle: function(t, e) {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
this.type = t;
this.data = e;
if (this.type) {
"register" == this.type && (this.label_txt.string = "Bạn muốn đăng ký thầu vị?");
"cancel" == this.type && (this.label_txt.string = "Bạn muốn thoát thầu vị?");
"set_contractor" == this.type && (this.label_txt.string = "Chỉ định " + e.nickname + " là thầu vị?");
}
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.Contractor.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "e48f1ENyA9NQqgO1K7q+9+T", "Xocdia.Popup.Contractor.Controller");
cc.Class({
extends: cc.Component,
properties: {
content: cc.Node,
prefabItem: cc.Prefab
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {
this.STATUS_ALLOW = [ "active", "pending" ];
},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
this.getListContractor();
this.content.removeAllChildren();
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
getListContractor: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
contractor: {
get_list: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
}
});
},
onData: function(t) {
var e = this;
this.content.removeAllChildren();
var o = 1;
t.data.forEach(function(i) {
if (e.STATUS_ALLOW.includes(i.status)) {
var n = cc.instantiate(e.prefabItem), c = n.getComponent("Xocdia.Popup.ContractorList.Controller.Item");
c.init(e, i);
c.is_current.active = "active" == i.status;
c.top.string = o;
c.username.string = i.nickname;
c.username.node.color = i.is_owner && t.is_owner ? cc.Color.YELLOW : cc.Color.WHITE;
c.btn_cancel.active = !(i.is_owner || !t.is_owner);
c.btn_set.active = !("pending" != i.status || !t.is_owner);
e.content.addChild(n);
o++;
}
});
},
clickRegister: function() {
cc.CORE.GAME_SCENCE.XocdiaPopup.Contractor_Confirm.toggle("register");
},
clickCancel: function() {
cc.CORE.GAME_SCENCE.XocdiaPopup.Contractor_Confirm.toggle("cancel");
},
onCancelContractor: function(t) {
var e = this;
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
contractor: {
reject: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
request_id: t.id
}
}
}
}
});
setTimeout(function() {
e.getListContractor();
}, 800);
},
onClickSetContractor: function(t) {
cc.CORE.GAME_SCENCE.XocdiaPopup.show("set_contractor", t);
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.ContractorList.Controller.Item": [ function(t, e) {
"use strict";
cc._RF.push(e, "4ee09VPHzpE4JZJuBGsgGA8", "Xocdia.Popup.ContractorList.Controller.Item");
cc.Class({
extends: cc.Component,
properties: {
top: cc.Label,
username: cc.Label,
is_current: cc.Node,
btn_set: cc.Node,
btn_cancel: cc.Node
},
init: function(t, e) {
this.CORE = t;
this.data = e;
},
onEnable: function() {},
onClickCancel: function() {
this.CORE.onCancelContractor(this.data);
},
onClickSetContractor: function() {
this.CORE.onClickSetContractor(this.data);
},
playClick: function() {
cc.CORE.GAME_SCENCE.PlayClick();
}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "f559aE/nuRLGLzIc6yeIAyl", "Xocdia.Popup.Controller");
var o = t("Xocdia.Popup.LeaveGame.Controller"), i = t("Xocdia.Popup.TipDealer.Controller"), n = t("Xocdia.Popup.Contractor.Controller"), c = t("Xocdia.Popup.Contractor.Confirm.Controller"), a = t("Xocdia.Popup.Transfer.Controller"), r = t("Xocdia.Popup.History_Bet.Controller"), s = t("Xocdia.Popup.Tutorial.Controller"), u = t("Xocdia.Popup.Dealer_Confirm_Result.Controller"), l = t("Xocdia.Popup.Request_Join_Room.Controller"), d = t("Xocdia.Popup.Customer_Tip.Controller"), h = t("Xocdia.Popup.Owner_Leave.Controller");
cc.Class({
extends: cc.Component,
properties: {
LeaveGame: o,
TipDealer: i,
Contractor: n,
Contractor_Confirm: c,
Transfer: a,
History_Bet: r,
Tutorial: s,
Dealer_Confirm_Result: u,
Request_Join_Room: l,
Customer_Tip: d,
Owner_Leave: h
},
init: function(t) {
this.CORE = t;
this.LeaveGame.init(this);
this.TipDealer.init(this);
this.Contractor.init(this);
this.Contractor_Confirm.init(this);
this.Transfer.init(this);
this.History_Bet.init(this);
this.Tutorial.init(this);
this.Dealer_Confirm_Result.init(this);
this.Request_Join_Room.init(this);
this.Customer_Tip.init(this);
this.Owner_Leave.init(this);
},
onLoad: function() {},
show: function(t, e) {
switch (t) {
case "tip":
this.TipDealer.toggle();
break;

case "leave":
this.LeaveGame.toggle();
break;

case "contractor":
this.Contractor.toggle();
break;

case "contractor_register":
this.Contractor_Confirm.toggle("register");
break;

case "contractor_cancel":
this.Contractor_Confirm.toggle("cancel");

case "set_contractor":
this.Contractor_Confirm.toggle("set_contractor", e);
return;

case "transfer":
this.Transfer.toggle();
break;

case "history_bet":
this.History_Bet.toggle();
break;

case "tutorial":
this.Tutorial.toggle();
break;

case "dealer_confirm_result":
this.Dealer_Confirm_Result.toggle();
break;

case "request_join_room":
this.Request_Join_Room.show(e);
break;

case "customer_tip":
this.Customer_Tip.show(e);
break;

case "owner_leave":
this.Owner_Leave.toggle();
}
},
update: function() {}
});
cc._RF.pop();
}, {
"Xocdia.Popup.Contractor.Confirm.Controller": "Xocdia.Popup.Contractor.Confirm.Controller",
"Xocdia.Popup.Contractor.Controller": "Xocdia.Popup.Contractor.Controller",
"Xocdia.Popup.Customer_Tip.Controller": "Xocdia.Popup.Customer_Tip.Controller",
"Xocdia.Popup.Dealer_Confirm_Result.Controller": "Xocdia.Popup.Dealer_Confirm_Result.Controller",
"Xocdia.Popup.History_Bet.Controller": "Xocdia.Popup.History_Bet.Controller",
"Xocdia.Popup.LeaveGame.Controller": "Xocdia.Popup.LeaveGame.Controller",
"Xocdia.Popup.Owner_Leave.Controller": "Xocdia.Popup.Owner_Leave.Controller",
"Xocdia.Popup.Request_Join_Room.Controller": "Xocdia.Popup.Request_Join_Room.Controller",
"Xocdia.Popup.TipDealer.Controller": "Xocdia.Popup.TipDealer.Controller",
"Xocdia.Popup.Transfer.Controller": "Xocdia.Popup.Transfer.Controller",
"Xocdia.Popup.Tutorial.Controller": "Xocdia.Popup.Tutorial.Controller"
} ],
"Xocdia.Popup.Customer_Tip.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "73ee0bIQotKX6R0GQMsD7sN", "Xocdia.Popup.Customer_Tip.Controller");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
amount: cc.Label
},
init: function(t) {
this.CORE = t;
this.data = {
username: "",
amount: 0
};
this.timeShow = 5;
this.timeShowIntv = null;
},
onLoad: function() {},
onEnable: function() {
this.timeShow = 5;
cc.CORE.AUDIO.playSound(cc.CORE.GAME_SCENCE.Audio.customer_tip);
clearInterval(this.timeShowIntv);
},
onDisable: function() {
clearInterval(this.timeShowIntv);
},
toggle: function() {
this.node.active = !this.node.active;
},
show: function(t) {
var e = this;
this.data = t;
void 0 !== this.data.nickname && (this.username.string = this.data.nickname);
void 0 !== this.data.amount && (this.amount.string = cc.CORE.UTIL.numberWithCommas(this.data.amount));
this.node.active = !0;
this.timeShowIntv = setInterval(function() {
e.timeShow--;
e.timeShow <= 0 && e.close();
}, 1e3);
},
close: function() {
this.node.active = !1;
clearInterval(this.timeShowIntv);
},
onData: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.Dealer_Confirm_Result.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "da987lQzatGR6eu0gKNEgZJ", "Xocdia.Popup.Dealer_Confirm_Result.Controller");
cc.Class({
extends: cc.Component,
properties: {
result_node: cc.Node
},
init: function(t) {
this.CORE = t;
this.BET_DOOR_ENUM = {
double: "CHẴN",
red3: "3 ĐỎ",
red4: "4 ĐỎ",
white3: "3 TRẮNG",
white4: "4 TRẮNG"
};
},
getWinningDoorsText: function(t) {
if (0 == t.length) return "null";
var e = t.filter(Boolean).length, o = 4 - e;
return 2 == e && 2 == o ? "double" : 3 == e ? "red3" : 4 == e ? "red4" : 3 == o ? "white3" : 4 == o ? "white4" : void 0;
},
onLoad: function() {
this.setResultDoor([]);
},
onEnable: function() {},
onDisable: function() {
this.setResultDoor([]);
},
setResultDoor: function(t) {
var e = this.getWinningDoorsText(t);
this.result_node.children.forEach(function(t) {
t.name == e ? t.getChildByName("active").active = !0 : t.getChildByName("active").active = !1;
});
},
toggle: function() {
this.node.active = !this.node.active;
},
onData: function() {},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.History_Bet.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "47abd/fSZFMko/uQisBZQrf", "Xocdia.Popup.History_Bet.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
total_bet: cc.Label,
total_refurn: cc.Label,
total_fee: cc.Label,
total_profit: cc.Label,
content: cc.Node,
ItemPrefab: cc.Prefab,
pagination: cc.Node,
sprite_status: {
default: [],
type: cc.SpriteFrame
},
sprite_dices: {
default: [],
type: cc.SpriteFrame
}
},
init: function(t) {
var e = this;
this.CORE = t;
this.BET_DOOR_ENUM = {
even: "CHẴN",
odd: "LẺ",
even_low: "CHẴN",
odd_low: "LẺ",
even_high: "CHẴN",
odd_high: "LẺ",
red3: "3 ĐỎ",
red4: "4 ĐỎ",
white3: "3 TRẮNG",
white4: "4 TRẮNG"
};
o.loadFromBundle("Common_Bundle", "Prefabs/Pagination", cc.Prefab).then(function(t) {
var o = cc.instantiate(t);
e.pagination.addChild(o);
e.pagination = o.getComponent("Pagination");
e.pagination.init(e);
}).catch(function(t) {
return console.log("❌ Error loading:", t);
});
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !1;
this.getDataPage(1);
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !0;
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
onData: function(t) {
var e = this;
this.content.removeAllChildren();
if (void 0 !== t.sum) {
var o = t.sum;
void 0 !== o.total_bet && (this.total_bet.string = cc.CORE.UTIL.abbreviateNumber(o.total_bet, 2));
void 0 !== o.total_refurn && (this.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(o.total_refurn, 2));
void 0 !== o.total_fee && (this.total_fee.string = cc.CORE.UTIL.abbreviateNumber(o.total_fee, 2));
if (void 0 !== o.total_win && void 0 !== o.total_lose) {
var i = o.total_win - o.total_lose > 0 ? "#00FF00" : "#FF0000";
this.total_profit.string = cc.CORE.UTIL.abbreviateNumber(o.total_win - o.total_lose, 2);
this.total_profit.node.color = cc.color().fromHEX(i);
}
}
void 0 !== t.data && t.data.forEach(function(t) {
var o = cc.instantiate(e.ItemPrefab), i = o.getComponent("Xocdia.Popup.History_Bet.Item.Controller");
i.init(e);
var n = "...";
Object.keys(e.BET_DOOR_ENUM).forEach(function(o) {
t[o] && t[o] > 0 && (n = e.BET_DOOR_ENUM[o]);
});
i.fee.string = "..." == n ? cc.CORE.UTIL.abbreviateNumber(0, 2) : cc.CORE.UTIL.abbreviateNumber(t.fee, 2);
i.bet_door.string = n;
void 0 !== t.result && i.setResult(t.result);
void 0 !== t.is_win && (i.status.getComponent(cc.Sprite).spriteFrame = t.is_win ? e.sprite_status[0] : e.sprite_status[1]);
i.username.string = cc.CORE.USER.username.toUpperCase();
i.session.string = "#" + t.session;
i.time.string = cc.CORE.UTIL.getStringDateByTime(t.createdAt);
i.total_bet.string = cc.CORE.UTIL.abbreviateNumber(t.total_bet, 2);
i.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(t.total_refurn, 2);
i.total_win.string = cc.CORE.UTIL.abbreviateNumber(t.total_win, 2);
i.total_win.node.color = t.total_win > 0 ? cc.color().fromHEX("#00FF00") : cc.color().fromHEX("#FF0000");
e.content.addChild(o);
});
if (void 0 !== t.total && void 0 !== t.page && void 0 !== t.limit) {
var n = t;
this.pagination.onSet(n.page, n.limit, n.total);
}
},
getDataPage: function(t, e) {
void 0 === e && (e = 4);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
get_history_bet: {
get_list: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
page: t,
limit: e
}
}
}
}
});
},
update: function() {}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Xocdia.Popup.History_Bet.Item.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "051d0p353pLkppnvpstGOcA", "Xocdia.Popup.History_Bet.Item.Controller");
t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
username: cc.Label,
session: cc.Label,
time: cc.Label,
status: cc.Node,
total_bet: cc.Label,
bet_door: cc.Label,
total_refurn: cc.Label,
fee: cc.Label,
total_win: cc.Label,
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
setResult: function(t) {
var e = this;
this.result_dot.map(function(o, i) {
o.getComponent(cc.Sprite).spriteFrame = t[i] ? e.CORE.sprite_dices[0] : e.CORE.sprite_dices[1];
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
"Xocdia.Popup.LeaveGame.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "01cf0W4lBtDgbzMdvhIKlLI", "Xocdia.Popup.LeaveGame.Controller");
t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
text: cc.Label
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
if ("private" == cc.CORE.GAME_SCENCE.ROOM.room_type) {
var t = cc.CORE.GAME_SCENCE.ROOM.is_ended ? "" : " đăng ký";
this.text.string = "Bạn có chắc chắn muốn" + t + "\nthoát khỏi phòng không?";
} else this.text.string = "Bạn có chắc chắn muốn\nrời khỏi phòng không?";
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
clickLeave: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
leave: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
}
}
});
this.toggle();
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Xocdia.Popup.Owner_Leave.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "79ecahG+MtL7Lo4hxudHR0Y", "Xocdia.Popup.Owner_Leave.Controller");
t("LocalStorage");
cc.Class({
extends: cc.Component,
properties: {
text: cc.Label
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.AUDIO.playSound(cc.CORE.GAME_SCENCE.Audio.owner_leave);
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {
LocalStorage: void 0
} ],
"Xocdia.Popup.Request_Join_Room.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "7940birCl9JXorNVM8eng1P", "Xocdia.Popup.Request_Join_Room.Controller");
cc.Class({
extends: cc.Component,
properties: {
username_txt: cc.Label
},
init: function(t) {
this.CORE = t;
this.data = {};
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
clickConfirm: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
request_join: this.data
}
}
});
this.close();
},
show: function(t) {
this.data = t;
void 0 !== this.data.nickname && (this.username_txt.string = this.data.nickname);
this.node.active = !0;
},
close: function() {
this.node.active = !1;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.TipDealer.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "81716tRI39MuqAd7+DfZIOo", "Xocdia.Popup.TipDealer.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
this.inputAmount.string = "";
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
clickTip: function() {
if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1e3) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, !1);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
tip: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)
}
}
}
});
this.toggle();
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.Transfer.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "fb5d6pjsSZGl7zjYLRSYz+e", "Xocdia.Popup.Transfer.Controller");
cc.Class({
extends: cc.Component,
properties: {
inputAmount: cc.EditBox,
inputUsername: cc.EditBox,
inputOtp: cc.EditBox,
btn_check_on: cc.Node,
btn_check_off: cc.Node
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
this.btn_check_on.active = !1;
this.btn_check_off.active = !1;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
this.clean();
},
clean: function() {
this.inputAmount.string = "";
this.inputUsername.string = "";
this.inputOtp.string = "";
},
onChangerAmount: function(t) {
void 0 === t && (t = 0);
t = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(t));
this.inputAmount.string = 0 == t ? "" : t;
cc.sys.isBrowser && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
},
clickTransfer: function() {
if (this.inputUsername.string.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("ID người nhận không hợp lệ!", "info", 1, !1);
if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) < 1e3) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là 1000!", "info", 1, !1);
if (this.inputOtp.string.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, !1);
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
transfer: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
amount: cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string),
username: this.inputUsername.string,
otp: this.inputOtp.string
}
}
}
});
},
clickGetOtp: function() {
cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
get_otp: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
action: "transfer_balance"
}
}
}
});
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
onData: function(t) {
if (t) {
this.btn_check_on.active = !0;
this.btn_check_off.active = !1;
} else {
this.btn_check_on.active = !1;
this.btn_check_off.active = !0;
}
},
onChangerNickname: function(t) {
void 0 === t && (t = "");
if (t.length > 0) cc.CORE.NETWORK.APP.Send({
event: "game",
data: {
xocdia: {
check_transfer: {
room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
nickname: t
}
}
}
}); else {
this.btn_check_on.active = !1;
this.btn_check_off.active = !1;
}
},
update: function() {
cc.CORE.GAME_SCENCE.currentPopupOpen = "transfer";
}
});
cc._RF.pop();
}, {} ],
"Xocdia.Popup.Tutorial.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "5dc83svubRDBKFp4SDfvMaW", "Xocdia.Popup.Tutorial.Controller");
cc.Class({
extends: cc.Component,
properties: {},
init: function(t) {
this.CORE = t;
},
onLoad: function() {},
onEnable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !1;
cc.CORE.GAME_SCENCE.isPopupOpen = !0;
},
onDisable: function() {
cc.CORE.GAME_SCENCE.VideoStream.node.active = !0;
cc.CORE.GAME_SCENCE.isPopupOpen = !1;
},
toggle: function() {
this.node.active = !this.node.active;
cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
},
update: function() {}
});
cc._RF.pop();
}, {} ],
"Xocdia.ResultDotOverlayManager": [ function(t, e) {
"use strict";
cc._RF.push(e, "1bfe48/VCxDkaavDM6U6KW0", "Xocdia.ResultDotOverlayManager");
var o = {
id: "cocos-result-dot-overlay",
create: function() {},
updateFixedPosition: function(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
},
setResult: function() {},
hide: function() {},
show: function() {},
destroy: function() {}
};
window.ClockOverlayManager = o;
e.exports = o;
cc._RF.pop();
}, {} ],
"Xocdia.Sidebar.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "be80flQH1FGaoqIFcb1OIK0", "Xocdia.Sidebar.Controller");
var o = t("AssetManager");
cc.Class({
extends: cc.Component,
properties: {
Avatar: cc.Sprite,
sidebar: cc.Node,
sidebarBg: cc.Node,
audioSpriteframe: {
default: [],
type: cc.SpriteFrame
},
posXshow: 414,
posXhide: 758
},
init: function(t) {
this.CORE = t;
},
onLoad: function() {
this.isShowing = !1;
this.isAnimating = !1;
this.sidebar.active = !0;
this.sidebarBg.active = !1;
},
onEnable: function() {
this.setAvatar();
},
setAvatar: function() {
if (cc.CORE.IS_LOGIN) {
var t;
if (null != (t = cc.CORE.USER) && t.avatar) {
var e;
o.setAvatarToSprite(this.Avatar, null == (e = cc.CORE.USER) ? void 0 : e.avatar).then(function() {}).catch(function(t) {
console.error("Failed to set player avatar:", t);
});
}
}
},
toggleSidebar: function(t) {
var e = this;
if (!this.isAnimating) {
this.isShowing && (this.sidebarBg.active = !1);
this.isAnimating = !0;
this.sidebar.active = !0;
var o = this.isShowing ? this.posXhide : this.posXshow;
cc.tween(this.sidebar).to(.3, {
x: o
}, {
easing: "sineInOut"
}).call(function() {
e.isShowing = !e.isShowing;
cc.CORE.GAME_SCENCE.isPopupOpen = e.isShowing;
e.isAnimating = !1;
e.isShowing || (t.node.active = !0);
e.isShowing && (e.sidebarBg.active = !0);
}).start();
}
},
onClickContractor: function() {
cc.CORE.GAME_SCENCE.XocdiaPopup.show("contractor");
},
onClickTransfer: function() {
if ("private" != cc.CORE.GAME_SCENCE.ROOM.room_type) return cc.CORE.GAME_SCENCE.FastNotify("Tính năng chỉ áp dụng cho phòng riêng!", "info", 1, !1);
cc.CORE.GAME_SCENCE.XocdiaPopup.show("transfer");
},
onClickAudio: function() {
cc.CORE.GAME_SCENCE.PopupLobby.show("setting");
},
onClickHistoryBet: function() {
cc.CORE.GAME_SCENCE.PopupLobby.show("history_bet");
},
onClickTutorial: function() {
cc.CORE.GAME_SCENCE.XocdiaPopup.show("tutorial");
}
});
cc._RF.pop();
}, {
AssetManager: void 0
} ],
"Xocdia.ThongKe.SoiCau.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "4b8bc/kSxtBEppPGMKG5sYo", "Xocdia.ThongKe.SoiCau.Controller");
function o(t, e) {
var o = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (o) return (o = o.call(t)).next.bind(o);
if (Array.isArray(t) || (o = i(t)) || e && t && "number" == typeof t.length) {
o && (t = o);
var n = 0;
return function() {
return n >= t.length ? {
done: !0
} : {
done: !1,
value: t[n++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function i(t, e) {
if (t) {
if ("string" == typeof t) return n(t, e);
var o = Object.prototype.toString.call(t).slice(8, -1);
"Object" === o && t.constructor && (o = t.constructor.name);
return "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? n(t, e) : void 0;
}
}
function n(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var o = 0, i = new Array(e); o < e; o++) i[o] = t[o];
return i;
}
cc.Class({
extends: cc.Component,
properties: {
spriteChan: cc.SpriteFrame,
spriteLe: cc.SpriteFrame,
spriteSapdoi: cc.SpriteFrame,
total_chan: cc.Label,
total_le: cc.Label,
ChanLeCel: cc.Node,
total_row: 5,
total_colume: 11,
scrollView: {
default: null,
type: cc.Node
}
},
init: function(t) {
this.CORE = t;
this.ChanLeCel = this.ChanLeCel.children.map(function(t) {
t.CORE = t.children.map(function(t) {
return t.getComponent(cc.Sprite);
});
return t;
});
},
onScrollViewScrollToBottom: function() {
this.scrollView.getComponent(cc.ScrollView).scrollToRight(.5);
},
onLoad: function() {},
onData: function() {},
onClickDot: function(t) {
cc.log(t);
},
isEvenSum: function(t) {
for (var e, i = 0, n = o(t); !(e = n()).done; ) !0 === e.value && i++;
return i % 2 == 0;
},
isEqualFull: function(t) {
return 0 === t[0] && 0 === t[1] && 0 === t[2] && 0 === t[3] || 1 === t[0] && 1 === t[1] && 1 === t[2] && 1 === t[3];
},
countOccurrences: function(t, e) {
for (var i, n = 0, c = o(t); !(i = c()).done; ) i.value === e && n++;
return n;
},
toggle: function() {
this.node.active = !this.node.active;
this.onScrollViewScrollToBottom();
},
setThongKe: function() {
var t = this, e = this;
e.gameLogs = e.CORE.gameLogs;
e.gameLogCounts = e.CORE.gameLogCounts;
var i = -1, n = [], c = [];
new Promise(function(a) {
var r = e.gameLogs.slice();
r.reverse();
for (var s, u = o(r); !(s = u()).done; ) {
var l = s.value.result, d = e.countOccurrences(l, !0), h = !!e.isEvenSum(l);
-1 === i && (i = h);
if (h !== i || c.length >= t.total_row) {
i = h;
n.push(c);
c = [];
}
c.push([ h, d ]);
}
c.length > 0 && n.push(c);
a(n);
}).then(function(o) {
Promise.all(e.ChanLeCel.map(function(t) {
t.active = !0;
return Promise.all(t.CORE.map(function(t) {
t.active = !0;
t.getComponent(cc.Sprite).spriteFrame = null;
t.node.children[0].getComponent(cc.Label).string = "";
}));
})).then(function() {});
var i = o;
i.reverse();
(i = i.slice(0, t.total_colume)).reverse();
Promise.all(e.ChanLeCel.map(function(t, o) {
var n = i[o];
if (void 0 !== n) {
t.active = !0;
return Promise.all(t.CORE.map(function(t, o) {
var i = n[o];
if (void 0 !== i) {
var c = i[0], a = i[1], r = c ? e.spriteChan : e.spriteLe, s = a;
t.active = !0;
t.session = 123;
t.getComponent(cc.Sprite).spriteFrame = r;
t.node.setContentSize(35, 35);
t.node.children[0].getComponent(cc.Label).string = s;
} else t.active = !1;
}));
}
t.active = !1;
})).then(function() {
e.total_chan.string = e.gameLogCounts.even;
e.total_le.string = e.gameLogCounts.odd;
});
});
},
update: function() {}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Sicbo.Chat.Controller", "Sicbo.Chat.Item.Controller", "Sicbo.Chat.QuickEmoji.Item.Controller", "Sicbo.Chat.QuickText.Item.Controller", "Sicbo.Fast_Notify.Controller", "Sicbo.Notify.Controller", "Sicbo.Popup.Contractor.Confirm.Controller", "Sicbo.Popup.Contractor.Controller", "Sicbo.Popup.ContractorList.Controller.Item", "Sicbo.Popup.Customer_Tip.Controller", "Sicbo.Popup.Dealer_Confirm_Result.Controller", "Sicbo.Popup.History_Bet.Controller", "Sicbo.Popup.History_Bet.Item.Controller", "Sicbo.Popup.Owner_Leave.Controller", "Sicbo.Popup.Request_Join_Room.Controller", "Sicbo.Popup.Controller", "Sicbo.Popup.LeaveGame.Controller", "Sicbo.Popup.TipDealer.Controller", "Sicbo.Popup.Transfer.Controller", "Sicbo.Popup.Tutorial.Controller", "Sicbo.Audio.Controller", "Sicbo.Controller", "Sicbo.Sidebar.Controller", "Sicbo.ThongKe.SoiCau.Controller", "Sicbo.ThongKe.SoiCau.DiceLog.Item.Controller", "Sicbo.ClockOverlayManager", "Sicbo.Dealer.KeyBoardManager", "Sicbo.Init.Util", "Sicbo.KeyBoardManager", "Sicbo.PlayerCountOverlayManager", "Sicbo.ResultDotOverlayManager", "Xocdia.Chat.Controller", "Xocdia.Chat.Item.Controller", "Xocdia.Chat.QuickEmoji.Item.Controller", "Xocdia.Chat.QuickText.Item.Controller", "Xocdia.Fast_Notify.Controller", "Xocdia.Notify.Controller", "Xocdia.Popup.Contractor.Confirm.Controller", "Xocdia.Popup.Contractor.Controller", "Xocdia.Popup.ContractorList.Controller.Item", "Xocdia.Popup.Customer_Tip.Controller", "Xocdia.Popup.Dealer_Confirm_Result.Controller", "Xocdia.Popup.History_Bet.Controller", "Xocdia.Popup.History_Bet.Item.Controller", "Xocdia.Popup.Owner_Leave.Controller", "Xocdia.Popup.Request_Join_Room.Controller", "Xocdia.Popup.Controller", "Xocdia.Popup.LeaveGame.Controller", "Xocdia.Popup.TipDealer.Controller", "Xocdia.Popup.Transfer.Controller", "Xocdia.Popup.Tutorial.Controller", "Xocdia.Sidebar.Controller", "Xocdia.ThongKe.SoiCau.Controller", "Xocdia.ClockOverlayManager", "Xocdia.Dealer.KeyBoardManager", "Xocdia.Init.Util", "Xocdia.KeyBoardManager", "Xocdia.PlayerCountOverlayManager", "Xocdia.ResultDotOverlayManager", "Xocdia.Audio.Controller", "Xocdia.Controller" ]);