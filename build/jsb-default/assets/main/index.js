window.__require = function t(e, n, r) {
function o(s, a) {
if (!n[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var f = n[s] = {
exports: {}
};
e[s][0].call(f.exports, function(t) {
return o(e[s][1][t] || t);
}, f, f.exports, t, e, n, r);
}
return n[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < r.length; s++) o(r[s]);
return o;
}({
AssetManager: [ function(t, e) {
"use strict";
cc._RF.push(e, "737a1WrBUZP/LvLqcU6L4PE", "AssetManager");
function n(t, e) {
var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
if (n) return (n = n.call(t)).next.bind(n);
if (Array.isArray(t) || (n = r(t)) || e && t && "number" == typeof t.length) {
n && (t = n);
var o = 0;
return function() {
return o >= t.length ? {
done: !0
} : {
done: !1,
value: t[o++]
};
};
}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function r(t, e) {
if (t) {
if ("string" == typeof t) return o(t, e);
var n = Object.prototype.toString.call(t).slice(8, -1);
"Object" === n && t.constructor && (n = t.constructor.name);
return "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? o(t, e) : void 0;
}
}
function o(t, e) {
(null == e || e > t.length) && (e = t.length);
for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
return r;
}
var i = {
_loadedAssets: new Map(),
_bundles: new Map(),
_makeKey: function(t, e) {
return (t._uuid || t.uuid) + "_" + (e ? e.name : "unknown");
},
_track: function(t, e, n) {
void 0 === n && (n = "main");
var r = this._makeKey(t, e);
this._loadedAssets.has(r) ? this._loadedAssets.get(r).refCount++ : this._loadedAssets.set(r, {
asset: t,
refCount: 1,
category: n
});
return r;
},
loadMultipleBundles: function(t, e) {
var n = this;
return new Promise(function(r) {
var o = t.length, i = 0, s = [], a = t.map(function(t, r) {
return new Promise(function(a, c) {
cc.assetManager.loadBundle(t, function(u, f) {
i++;
"function" == typeof e && e(i, o);
if (u) {
console.warn("[AssetManager] ❌ Lỗi load bundle: " + t, u);
c({
name: t,
err: u
});
} else {
console.log("[AssetManager] ✅ Đã load bundle: " + t);
s[r] = f;
n._bundles.set(t, f);
a(f);
}
});
});
});
Promise.allSettled(a).then(function() {
var t = s.filter(Boolean);
console.log("[AssetManager] ✅ Load xong " + t.length + "/" + o + " bundles");
r(t);
});
});
},
loadMultipleBundlesWithAssetProgress: function(t, e) {
var n = this;
return new Promise(function(r, o) {
var i = 0, s = 0, a = [], c = function() {
var t = 0 === i ? 0 : Math.min(100, Math.floor(s / i * 100));
"function" == typeof e && e(t);
}, u = function(t, e) {
return new Promise(function(r, o) {
cc.assetManager.loadBundle(t, function(u, f) {
if (u) {
console.warn("[AssetManager] ❌ Lỗi load bundle: " + t, u);
o(u);
} else {
console.log("[AssetManager] ✅ Load bundle: " + t);
a[e] = f;
n._bundles.set(t, f);
var l = 0;
f.loadDir("", function(t, e) {
if (0 === l) {
l = e;
i += e;
}
s++;
c();
}, function(e, o) {
if (e) console.warn("[AssetManager] ❌ Lỗi load asset trong bundle: " + t, e); else {
console.log("[AssetManager] ✅ Load xong asset bundle: " + t);
o.forEach(function(e) {
return n._track(e, e.constructor, t || "main");
});
}
r(f);
});
}
});
});
}, f = t.map(function(t, e) {
return u(t, e);
});
Promise.allSettled(f).then(function() {
c();
var t = a.filter(Boolean);
console.log("[AssetManager] 🎉 Load xong tất cả asset trong các bundle!");
r(t);
}).catch(o);
});
},
loadAssetsFromMultipleBundles: function(t, e) {
var n = this;
return new Promise(function(r, o) {
var i = Object.keys(t);
n.loadMultipleBundles(i).then(function(s) {
var a = s.map(function(r, o) {
var s = i[o], a = t[s];
return Array.isArray(a) ? Promise.all(a.map(function(t) {
return new Promise(function(o, i) {
r.load(t, e, function(r, a) {
if (r) {
console.error("[AssetManager] Lỗi load asset: " + t + " từ " + s, r);
i(r);
} else {
n._track(a, e, s || "main");
o({
bundleName: s,
path: t,
asset: a
});
}
});
});
})) : new Promise(function(t, o) {
r.load(a, e, function(r, i) {
if (r) {
console.error("[AssetManager] Lỗi load asset: " + a + " từ " + s, r);
o(r);
} else {
n._track(i, e, s || "main");
t({
bundleName: s,
path: a,
asset: i
});
}
});
});
});
Promise.all(a).then(function(t) {
var e = {};
t.forEach(function(t) {
if (Array.isArray(t)) {
var n = t[0].bundleName;
e[n] = {};
t.forEach(function(t) {
var r = t.path, o = t.asset;
e[n][r] = o;
});
} else {
var r = t.bundleName, o = t.path, i = t.asset;
e[r] || (e[r] = {});
e[r][o] = i;
}
});
r(e);
}).catch(o);
}).catch(o);
});
},
loadFromResources: function(t, e, n) {
var r = this;
void 0 === n && (n = "main");
return new Promise(function(o, i) {
cc.resources.load(t, e, function(s, a) {
if (s) {
console.error("[AssetManager] Failed to load: " + t, s);
i(s);
} else {
r._track(a, e, n);
o(a);
}
});
});
},
loadFromBundle: function(t, e, n, r) {
var o = this;
void 0 === r && (r = "main");
return new Promise(function(i, s) {
cc.assetManager.loadBundle(t, function(a, c) {
if (a) {
console.error("[AssetManager] Failed to load bundle: " + t, a);
s(a);
} else {
o._bundles.set(t, c);
var u = r || "main";
c.load(e, n, function(r, a) {
if (r) {
console.error("[AssetManager] Failed to load: " + e + " from " + t, r);
s(r);
} else {
o._track(a, n, u);
i(a);
}
});
}
});
});
},
loadMultipleFromResources: function(t, e, n) {
var r = this;
void 0 === n && (n = "main");
return new Promise(function(o, i) {
cc.resources.loadDir(t, e, function(s, a) {
if (s) {
console.error("[AssetManager] Failed to load directory: " + t, s);
i(s);
} else {
a.forEach(function(t) {
return r._track(t, e, n);
});
o(a);
}
});
});
},
loadMultipleFromBundle: function(t, e, n, r) {
var o = this;
void 0 === r && (r = "main");
return new Promise(function(i, s) {
cc.assetManager.loadBundle(t, function(a, c) {
if (a) {
console.error("[AssetManager] Failed to load bundle: " + t, a);
s(a);
} else {
o._bundles.set(t, c);
var u = r || "main";
c.loadDir(e, n, function(r, a) {
if (r) {
console.error("[AssetManager] Failed to load directory: " + e + " from " + t, r);
s(r);
} else {
a.forEach(function(t) {
return o._track(t, n, u);
});
i(a);
}
});
}
});
});
},
release: function(t, e) {
if (!t) return !1;
var n = this._makeKey(t, e), r = this._loadedAssets.get(n);
if (!r) return !1;
r.refCount--;
if (r.refCount <= 0) {
cc.isValid(r.asset) && cc.assetManager.releaseAsset(r.asset);
this._loadedAssets.delete(n);
console.log("[AssetManager] 🗑 Released: " + n);
}
return !0;
},
releaseCategory: function(t) {
void 0 === t && (t = "main");
for (var e, r = n(this._loadedAssets.entries()); !(e = r()).done; ) {
var o = e.value, i = o[0], s = o[1];
console.log(s);
if (s && s.category === t) {
cc.isValid(s.asset) && cc.assetManager.releaseAsset(s.asset);
this._loadedAssets.delete(i);
console.log("[AssetManager] 🗑 Released category " + t + ": " + i);
}
}
},
releaseAll: function(t) {
void 0 === t && (t = !0);
console.log("[AssetManager] 🔥 Release all assets...");
this._loadedAssets.forEach(function(t) {
cc.isValid(t.asset) && cc.assetManager.releaseAsset(t.asset);
});
this._loadedAssets.clear();
this._bundles.forEach(function(t, e) {
cc.assetManager.removeBundle(t);
console.log("[AssetManager] 🗑 Released bundle: " + e);
});
this._bundles.clear();
t && this.forceGC();
},
getTrackedCount: function() {
return this._loadedAssets.size;
},
printStatus: function() {
var t = {};
this._loadedAssets.forEach(function(e) {
t[e.category] = (t[e.category] || 0) + 1;
});
console.table(t);
console.log("[AssetManager] Tracked assets: " + this._loadedAssets.size);
},
forceGC: function() {
cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("java/lang/System", "gc", "()V");
window.gc && window.gc();
console.log("[AssetManager] 🧹 Force GC");
},
setAvatarToSprite: function(t, e) {
var n = this;
return new Promise(function(r, o) {
if (!(t && t instanceof cc.Sprite)) {
console.warn("[AssetManager] Target sprite is invalid or not a cc.Sprite.");
return o(new Error("Invalid target sprite"));
}
if ("undefined" == typeof e || null === e) {
console.warn("[AssetManager] Avatar ID is invalid.");
return o(new Error("Invalid avatar ID"));
}
var i = "Images/Avatar/" + e;
n.loadFromBundle("Common_Bundle", i, cc.SpriteFrame).then(function(e) {
t.spriteFrame = e;
r(e);
}).catch(function(n) {
console.error("[AssetManager] Failed to set avatar " + e + ":", n);
t.spriteFrame = null;
o(n);
});
});
}
};
e.exports = i;
cc._RF.pop();
}, {} ],
"Audio.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "a223fy7KjJMQrTIOU/U5lOT", "Audio.Controller");
var n = t("howler"), r = n.Howl;
n.Howler;
e.exports = {
licensedAudio: !1,
checkLicensedAudio: function() {
if (cc.sys.isBrowser) {
cc.game.canvas.addEventListener("touchend", function() {
e.exports.licensedAudio = !0;
});
cc.game.canvas.addEventListener("mousedown", function() {
e.exports.licensedAudio = !0;
});
} else e.exports.licensedAudio = !0;
},
playSound: function(t, n) {
void 0 === n && (n = !1);
e.exports.checkLicensedAudio();
if (!e.exports.licensedAudio) return e.exports.stopSound(t);
n && e.exports.licensedAudio ? t.play() : cc.CORE.SETTING.SOUND && e.exports.licensedAudio && t.play();
},
stopSound: function(t) {
t.stop();
},
playMusic: function(t, n) {
void 0 === n && (n = !1);
e.exports.checkLicensedAudio();
n ? t.play() : cc.CORE.SETTING.MUSIC && t.play();
},
stopMusic: function(t) {
t.stop();
},
playSoundEffect: function(t, n) {
void 0 === n && (n = !1);
e.exports.checkLicensedAudio();
if (!e.exports.licensedAudio) return e.exports.stopSoundEffect(t);
n ? t.play() : cc.CORE.SETTING.SOUND && t.play();
},
stopSoundEffect: function(t) {
t.stop();
},
HOWLER: {
STORAGE: {},
createSound: function(t, n, o, i) {
void 0 === o && (o = !1);
void 0 === i && (i = 1);
e.exports.HOWLER.STORAGE[t] && e.exports.HOWLER.storage[t].unload();
return e.exports.HOWLER.STORAGE[t] = new r({
src: [ n ],
volume: i,
loop: o,
html5: !0
});
},
playSound: function(t, n) {
void 0 === n && (n = !1);
e.exports.checkLicensedAudio();
if (e.exports.licensedAudio && e.exports.HOWLER.STORAGE[t]) if (n) {
e.exports.HOWLER.STORAGE[t].stop();
e.exports.HOWLER.STORAGE[t].play();
} else cc.CORE.SETTING.SOUND && e.exports.HOWLER.STORAGE[t].play();
},
stopSound: function(t) {
e.exports.HOWLER.STORAGE[t] && e.exports.HOWLER.STORAGE[t].stop();
},
unloadSound: function(t) {
if (e.exports.HOWLER.STORAGE[t]) {
e.exports.HOWLER.STORAGE[t].unload();
delete e.exports.HOWLER.STORAGE[t];
}
},
getSound: function(t) {
return e.exports.HOWLER.STORAGE[t];
}
}
};
cc._RF.pop();
}, {
howler: void 0
} ],
BrowserUtil: [ function(t, e) {
"use strict";
cc._RF.push(e, "c12bdGZ88xIg6TmDDlOd8ui", "BrowserUtil");
e.exports = {
showCursorText: function() {
this.isCursorAuto() || this.setCursor("text");
},
showCursorPointer: function() {
this.isCursorAuto() || this.setCursor("pointer");
},
showCursorMove: function() {
this.isCursorAuto() || this.setCursor("move");
},
showCursorAuto: function() {
this.isCursorAuto() || this.setCursor("auto");
},
showCursorFish: function() {
cc.sys.isBrowser && (cc.game.canvas.style.cursor = "url('https://i.imgur.com/ZzGopph.png'), auto");
},
showCursorAutoForce: function() {
cc.sys.isBrowser && this.setCursor("auto");
},
isCursorAuto: function() {
return !!cc.sys.isBrowser && "auto" === document.getElementById("GameDiv").style.cursor;
},
setCursor: function(t) {
cc.sys.isBrowser && (cc.game.canvas.style.cursor = t);
},
showTooltip: function(t) {
cc.sys.isBrowser && (document.body.title = t);
},
focusGame: function() {
cc.sys.isBrowser && cc.game.canvas.focus();
},
getHTMLElementByEditBox: function(t) {
return t._impl._elem;
},
checkEditBoxFocus: function(t) {
return t.isFocused();
},
focusEditBox: function(t) {
t._impl._elem.focus();
t.focus();
},
unFocusEditBox: function() {},
inputAddEvent: function(t, e, n) {
t._impl._elem.addEventListener(e, n);
},
inputRemoveEvent: function(t, e, n) {
t._impl._elem.removeEventListener(e, n);
},
readOnlyEditBox: function(t) {
t.readOnly = !0;
},
setValueEditBox: function(t) {
for (var e = document.getElementsByClassName("cocosEditBox"), n = 0; n < e.length; n++) {
var r = e[n];
if ("none" != r.style.display) {
e = r;
break;
}
}
e.value = t;
},
isVisibleTab: function() {
cc.IS_VISIBLE = !0;
try {
document.addEventListener("visibilitychange", function() {
cc.IS_VISIBLE = !document.hidden;
});
} catch (t) {
cc.log(t);
}
}
};
cc._RF.pop();
}, {} ],
CanvasResizer: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "fc490PZr9lEt5uw5JJ7078Z", "CanvasResizer");
var r, o = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
r(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), i = this && this.__decorate || function(t, e, n, r) {
var o, i = arguments.length, s = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, r); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, n, s) : o(e, n)) || s);
return i > 3 && s && Object.defineProperty(e, n, s), s;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var s = cc._decorator, a = s.ccclass, c = s.property, u = s.requireComponent, f = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.designResolution = new cc.Size(828, 1400);
e.lastWitdh = 0;
e.lastHeight = 0;
return e;
}
e.prototype.onLoad = function() {
this.canvas = this.node.getComponent(cc.Canvas);
this.updateCanvas();
};
e.prototype.update = function() {
this.updateCanvas();
};
e.prototype.updateCanvas = function() {
var t = cc.view.getFrameSize();
if (this.lastWitdh !== t.width || this.lastHeight !== t.height) {
this.lastWitdh = t.width;
this.lastHeight = t.height;
if (this.designResolution.width / this.designResolution.height > t.width / t.height) {
var e = cc.size(this.designResolution.width, this.designResolution.width * (t.height / t.width));
this.canvas.designResolution = e;
cc.log("CanvasResizer: Update canvas size: " + e);
} else {
e = cc.size(this.designResolution.height * (t.width / t.height), this.designResolution.height);
this.canvas.designResolution = e;
cc.log("CanvasResizer: Update canvas size: " + e);
}
}
};
i([ c ], e.prototype, "designResolution", void 0);
return i([ a, u(cc.Canvas) ], e);
}(cc.Component);
n.default = f;
cc._RF.pop();
}, {} ],
"Config.Dev": [ function(t, e) {
"use strict";
cc._RF.push(e, "4e8b1Evn0ZItL4Ho5ZDVCYw", "Config.Dev");
var n = t("Environment_Enum");
e.exports = {
ENVIRONMENT: n.DEVELOPMENT,
WEBSOCKET: {
APP: {
IS_SSL: !1,
URL: "localhost:8009/app"
},
DEALER: {
IS_SSL: !1,
URL: "localhost:8009/dealer"
}
},
SERVER_API: "http://localhost:8009"
};
cc._RF.pop();
}, {
Environment_Enum: "Environment_Enum"
} ],
"Config.Prod": [ function(t, e) {
"use strict";
cc._RF.push(e, "c7eafydLOVKdYQfktJ0jOEz", "Config.Prod");
var n = t("Environment_Enum");
e.exports = {
ENVIRONMENT: n.PRODUCTION,
WEBSOCKET: {
APP: {
IS_SSL: !0,
URL: "signal.xokvip.net/app"
},
DEALER: {
IS_SSL: !0,
URL: "signal.xokvip.net/dealer"
}
},
SERVER_API: "https://signal.xokvip.net"
};
cc._RF.pop();
}, {
Environment_Enum: "Environment_Enum"
} ],
Config: [ function(t, e) {
"use strict";
cc._RF.push(e, "d8531ATuVlBx4aGgfC0GHnr", "Config");
var n = t("Environment_Enum"), r = t("Config.Dev"), o = t("Config.Prod"), i = n.PRODUCTION == n.PRODUCTION ? o : r;
e.exports = i;
cc._RF.pop();
}, {
"Config.Dev": "Config.Dev",
"Config.Prod": "Config.Prod",
Environment_Enum: "Environment_Enum"
} ],
DeviceInfo: [ function(t, e) {
"use strict";
cc._RF.push(e, "7b3cbrCfUlIgYsV9JrPRktx", "DeviceInfo");
var n = t("Helper"), r = {
Get: function() {
var t = {
play_platform: null,
user_agent: null,
isMobile: null,
resolution: null,
device_name: null,
version: null
};
try {
setTimeout(function() {
if ("undefined" != typeof cc && cc.view && cc.view.getFrameSize) {
var e = cc.view.getFrameSize();
t.resolution = e.width + "x" + e.height;
} else "undefined" != typeof window && (t.resolution = window.innerWidth + "x" + window.innerHeight);
}, 300);
if (cc && cc.sys && cc.sys.isNative) {
var e, r;
t.play_platform = "native_app";
t.user_agent = "native";
t.isMobile = !1;
t.device_name = (null == (e = cc.sys) ? void 0 : e.os) || null;
t.version = (null == (r = cc.sys) ? void 0 : r.osVersion) || null;
} else if ("undefined" != typeof navigator) {
var o, i;
t.play_platform = "browser";
t.user_agent = navigator.userAgent || null;
t.isMobile = n.isMobile();
t.device_name = (null == (o = navigator) ? void 0 : o.platform) || null;
t.version = (null == (i = navigator) ? void 0 : i.appVersion) || null;
}
} catch (t) {
cc && cc.error && cc.error("[DeviceInfo Error]", t);
}
return t;
}
};
e.exports = r;
cc._RF.pop();
}, {
Helper: "Helper"
} ],
DisableClick: [ function(t, e) {
"use strict";
cc._RF.push(e, "2f5ccV6iwNHHJn0oScxaPv7", "DisableClick");
cc.Class({
extends: cc.Component,
onEnable: function() {
this.node.on("touchstart", function(t) {
t.stopPropagation();
});
this.node.on("touchend", function(t) {
t.stopPropagation();
});
this.node.on("touchmove", function(t) {
t.stopPropagation();
});
this.node.on("touchcancel", function(t) {
t.stopPropagation();
});
},
onDisable: function() {
this.node.off("touchstart", function(t) {
t.stopPropagation();
});
this.node.off("touchend", function(t) {
t.stopPropagation();
});
this.node.on("touchmove", function(t) {
t.stopPropagation();
});
this.node.on("touchcancel", function(t) {
t.stopPropagation();
});
}
});
cc._RF.pop();
}, {} ],
EasingEffect: [ function(t, e) {
"use strict";
cc._RF.push(e, "bc7fe8EI2pM8rNBJGb7SeFA", "EasingEffect");
cc.Class({
extends: cc.Component,
properties: {
timeEffect: .8,
opacityStart: 0,
opacityFinish: 255,
nodeScaleStart: .6,
nodeScaleFinish: 1,
moveNode: !1,
moveFromX: 0,
moveFromY: 0,
moveToX: 0,
moveToY: 0
},
onEnable: function() {
this.node.opacity = this.opacityStart;
this.node.scale = this.nodeScaleStart;
this.node.position = this.moveNode ? cc.v2(this.moveFromX, this.moveFromY) : this.node.position;
this.moveToPos = this.moveNode ? cc.v2(this.moveToX, this.moveToY) : this.node.position;
cc.tween(this.node).to(this.timeEffect, {
scale: this.nodeScaleFinish,
opacity: this.opacityFinish,
position: this.moveToPos
}, {
easing: "quartInOut"
}).start();
},
onDisable: function() {
this.moveFromPos = this.moveNode ? cc.v2(this.moveFromX, this.moveFromY) : this.node.position;
cc.tween(this.node).to(this.timeEffect, {
scale: this.nodeScaleStart,
opacity: this.opacityStart,
position: this.moveFromPos
}, {
easing: "quartInOut"
}).call(function() {}).start();
}
});
cc._RF.pop();
}, {} ],
Environment_Enum: [ function(t, e) {
"use strict";
cc._RF.push(e, "84c79R3VfRPyJydr6kLiHPn", "Environment_Enum");
e.exports = {
DEVELOPMENT: "development",
PRODUCTION: "production"
};
cc._RF.pop();
}, {} ],
FadeBlur: [ function(t, e) {
"use strict";
cc._RF.push(e, "df70eP51YVDHKa7Zd3u09dZ", "FadeBlur");
cc.Class({
extends: cc.Component,
properties: {
timeShow: 1
},
onLoad: function() {
this.node.opacity = 10;
cc.tween(this.node).to(Number(this.timeShow), {
opacity: 255
}).call(function() {}).start();
},
onEnable: function() {
this.node.opacity = 10;
cc.tween(this.node).to(Number(this.timeShow), {
opacity: 255
}).call(function() {}).start();
}
});
cc._RF.pop();
}, {} ],
Flicker: [ function(t, e) {
"use strict";
cc._RF.push(e, "ad57b2tVdJJnIFT+ld3NfBp", "Flicker");
cc.Class({
extends: cc.Component,
properties: {
time: .3
},
onLoad: function() {
this.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(this.time), cc.fadeOut(this.time))));
},
onEnable: function() {
this.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(this.time), cc.fadeOut(this.time))));
}
});
cc._RF.pop();
}, {} ],
FullResponsive: [ function(t, e) {
"use strict";
cc._RF.push(e, "4cbb00dqCxK9KXyuDIji3+u", "FullResponsive");
cc.Class({
extends: cc.Component,
onLoad: function() {
try {
this.node.width = cc.CORE.GAME_SCENCE.node.width;
this.node.height = cc.CORE.GAME_SCENCE.node.height;
} catch (t) {
cc.log(t);
}
},
onEnable: function() {
try {
this.node.width = cc.CORE.GAME_SCENCE.node.width;
this.node.height = cc.CORE.GAME_SCENCE.node.height;
cc.log(this.node.width, this.node.height, cc.CORE.GAME_SCENCE.node.width, cc.CORE.GAME_SCENCE.node.height);
} catch (t) {
cc.log(t);
}
}
});
cc._RF.pop();
}, {} ],
GameApiOverlayIframe: [ function(t, e) {
"use strict";
cc._RF.push(e, "5ab11pby69C4YJCGkb1PQ2M", "GameApiOverlayIframe");
var n = {
id: "GameOverlayDiv",
buttonId: "GameOverlayButton",
isDragging: !1,
wasDragging: !1,
dragStartPos: {
x: 0,
y: 0
},
dragThreshold: 10,
dragOffset: {
x: 0,
y: 0
},
customCallback: null,
create: function(t) {
void 0 === t && (t = null);
this.customCallback = t;
if (!document.getElementById(this.id)) {
var e = document.createElement("div");
e.id = this.id;
e.className = "GameOverlay";
e.style.cssText = "\n            position: absolute;\n            z-index: 5;\n            margin: auto;\n            width: 100% !important;\n            height: 100% !important;\n            top: 50%;\n            left: 50%;\n            transform: translateX(-50%) translateY(-50%);\n            overflow: hidden;\n            background-color: #000;\n        ";
var n = document.createElement("iframe");
n.id = "GameOverlayIframe";
n.style.cssText = "\n            display: block;\n            width: 100%;\n            height: 100%;\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translateX(-50%) translateY(-50%);\n            border: none;\n            width: calc(100% + 35px);\n            width: 100%;\n            height: 100%;\n            overflow: auto;\n        ";
var r = document.createElement("button");
r.id = this.buttonId;
r.className = "GameOverlayButton";
r.style.cssText = "\n            display: block;\n            background-image: url('https://kunkey.github.io/demo-bestgate/web/public/image-removebg-preview.png');\n            background-repeat: no-repeat;\n            background-size: contain;\n            background-color: rgba(255, 255, 255, 0);\n            position: absolute;\n            top: 10vh;\n            right: 4vh;\n            border: none;\n            width: 6vh;\n            height: 6vh;\n            z-index: 6;\n        ";
r.innerHTML = "";
e.appendChild(n);
e.appendChild(r);
document.body.appendChild(e);
this.setupButtonEvents(r);
return e;
}
},
setupButtonEvents: function(t) {
var e = this;
t.addEventListener("mousedown", function(t) {
e.startDragging(t);
});
t.addEventListener("touchstart", function(t) {
t.preventDefault();
e.startDragging(t.touches[0]);
});
document.addEventListener("mousemove", function(t) {
0 === e.dragStartPos.x && 0 === e.dragStartPos.y || e.checkAndStartDragging(t);
});
document.addEventListener("touchmove", function(t) {
if (0 !== e.dragStartPos.x || 0 !== e.dragStartPos.y) {
t.preventDefault();
e.checkAndStartDragging(t.touches[0]);
}
});
document.addEventListener("mouseup", function() {
e.stopDragging();
});
document.addEventListener("touchend", function() {
e.stopDragging();
});
t.addEventListener("click", function(t) {
t.preventDefault();
e.isDragging || e.wasDragging || e.onButtonClick(t);
});
t.addEventListener("touchend", function(t) {
t.preventDefault();
e.isDragging || e.wasDragging || e.onButtonClick(t);
});
},
startDragging: function(t) {
this.dragStartPos.x = t.clientX;
this.dragStartPos.y = t.clientY;
this.isDragging = !1;
this.wasDragging = !1;
var e = document.getElementById(this.buttonId);
if (e) {
var n = e.getBoundingClientRect();
this.dragOffset.x = t.clientX - n.left;
this.dragOffset.y = t.clientY - n.top;
e.style.transition = "none";
e.style.transform = "scale(1.1)";
}
},
checkAndStartDragging: function(t) {
if (this.isDragging) this.drag(t); else {
var e = Math.abs(t.clientX - this.dragStartPos.x), n = Math.abs(t.clientY - this.dragStartPos.y);
if (e > this.dragThreshold || n > this.dragThreshold) {
this.isDragging = !0;
this.drag(t);
}
}
},
drag: function(t) {
if (this.isDragging) {
var e = document.getElementById(this.buttonId);
if (e) {
var n = t.clientX - this.dragOffset.x, r = t.clientY - this.dragOffset.y, o = window.innerWidth - e.offsetWidth, i = window.innerHeight - e.offsetHeight;
e.style.left = Math.max(0, Math.min(n, o)) + "px";
e.style.top = Math.max(0, Math.min(r, i)) + "px";
}
}
},
stopDragging: function() {
var t = this, e = this.isDragging;
this.isDragging = !1;
this.dragStartPos.x = 0;
this.dragStartPos.y = 0;
if (e) {
this.wasDragging = !0;
setTimeout(function() {
t.wasDragging = !1;
}, 100);
}
var n = document.getElementById(this.buttonId);
if (n) {
n.style.transition = "all 0.3s ease";
n.style.transform = "scale(1)";
}
},
onButtonClick: function() {
this.customCallback && this.customCallback();
},
show: function() {
var t = document.getElementById(this.id);
t && (t.style.display = "block");
},
hide: function() {
var t = document.getElementById(this.id);
t && (t.style.display = "none");
},
toggle: function() {
var t = document.getElementById(this.id);
t && ("none" === t.style.display ? this.show() : this.hide());
},
destroy: function() {
var t = document.getElementById(this.id);
t && document.body.removeChild(t);
},
setButtonPosition: function(t, e) {
var n = document.getElementById(this.buttonId);
if (n) {
n.style.right = t + "px";
n.style.top = e + "px";
}
},
setIframeSrc: function(t) {
var e = document.getElementById("GameOverlayIframe");
e && (e.src = t);
},
setButtonContent: function(t) {
var e = document.getElementById(this.buttonId);
e && (e.innerHTML = t);
},
setCustomCallback: function(t) {
this.customCallback = t;
},
getCustomCallback: function() {
return this.customCallback;
},
removeCustomCallback: function() {
this.customCallback = null;
},
debug: function() {
var t = document.getElementById(this.id), e = document.getElementById(this.buttonId);
console.log("=== GameOverlay Debug ===");
console.log("Overlay exists:", !!t);
console.log("Button exists:", !!e);
if (t) {
console.log("Overlay display:", t.style.display);
console.log("Overlay pointer-events:", t.style.pointerEvents);
console.log("Overlay z-index:", t.style.zIndex);
}
if (e) {
console.log("Button display:", e.style.display);
console.log("Button pointer-events:", e.style.pointerEvents);
console.log("Button z-index:", e.style.zIndex);
console.log("Button position:", {
left: e.style.left,
top: e.style.top
});
}
console.log("Is dragging:", this.isDragging);
console.log("Was dragging:", this.wasDragging);
console.log("Drag start pos:", this.dragStartPos);
console.log("Custom callback:", this.customCallback);
console.log("========================");
}
};
"undefined" != typeof e && e.exports ? e.exports = n : "undefined" != typeof cc ? cc.GameOverlay = n : window.GameOverlay = n;
cc._RF.pop();
}, {} ],
"GameInit.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "cdee6hyU7tNv7n2enVcev1W", "GameInit.Controller");
var n = t("AssetManager"), r = t("Config"), o = t("Helper"), i = t("DeviceInfo"), s = t("Server.WebSocket.App"), a = t("Server.WebSocket.Dealer"), c = t("Audio.Controller");
e.exports = {
initState: function() {
cc.CORE = {
initState: function() {},
ASSET_MANAGER: n,
CONFIG: r,
UTIL: o,
NETWORK: {
APP: s,
DEALER: a
},
TASK_REGISTRY: {},
SETTING: {
MUSIC: !0,
SOUND: !0
},
AUDIO: c,
GAME_CONFIG: {},
GAME_SCENCE: {},
GAME_ROOM: {
clean: function() {
var t = this.clean;
for (var e in this) "clean" !== e && delete this[e];
this.clean = t;
}
},
IS_LOGIN: !1,
USER: {},
PAYMENT: {
USER_BANK_ACCOUNT: null
},
DEALER: {
IS_LOGIN: !1
},
IP_ADDRESS: null,
DEVICE_INFO: i.Get() || {}
};
o.getClientIp(function(t, e) {
if (e) setTimeout(function() {
o.getClientIp(function(t, e) {
if (e) {
console.error("[GameInit] Vẫn không thể lấy IP address:", e.message);
cc.CORE.IP_ADDRESS = "unknown";
} else {
cc.CORE.IP_ADDRESS = t;
cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.triggerEvent && cc.CORE.UTIL.triggerEvent("IP_READY", {
ip: t
});
}
}, {
timeout: 5e3,
useWebRTC: !1,
useAPI: !0
});
}, 5e3); else {
cc.CORE.IP_ADDRESS = t;
cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.triggerEvent && cc.CORE.UTIL.triggerEvent("IP_READY", {
ip: t
});
}
}, {
timeout: 8e3,
useWebRTC: !0,
useAPI: !0
});
}
};
e.exports.getCurrentIP = function() {
return cc.CORE ? cc.CORE.IP_ADDRESS : null;
};
e.exports.waitForIP = function(t, e) {
void 0 === e && (e = 1e4);
if (t) if (cc.CORE && cc.CORE.IP_ADDRESS && "unknown" !== cc.CORE.IP_ADDRESS) t(cc.CORE.IP_ADDRESS); else {
var n = function e(n) {
if (n.detail && n.detail.ip) {
t(n.detail.ip);
cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.off && cc.CORE.UTIL.off("IP_READY", e);
}
};
cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.on && cc.CORE.UTIL.on("IP_READY", n);
setTimeout(function() {
cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.off && cc.CORE.UTIL.off("IP_READY", n);
t(null);
}, e);
}
};
cc._RF.pop();
}, {
AssetManager: "AssetManager",
"Audio.Controller": "Audio.Controller",
Config: "Config",
DeviceInfo: "DeviceInfo",
Helper: "Helper",
"Server.WebSocket.App": "Server.WebSocket.App",
"Server.WebSocket.Dealer": "Server.WebSocket.Dealer"
} ],
"GameLoad.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "acbe32FMVtESoeoxyTMdf5/", "GameLoad.Controller");
var n = t("LocalStorage"), r = function(t, e, n, r, o) {
void 0 === t && (t = !0);
void 0 === e && (e = "Lobby");
void 0 === n && (n = null);
void 0 === r && (r = null);
void 0 === o && (o = null);
return {
resource_type: t,
resource_name: e,
resource_bundle: n,
resource_path: r,
resource_script: o
};
};
e.exports = {
initState: function() {
cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function() {
setTimeout(function() {
return cc.CORE.UTIL.setFrameRate(120);
}, 100);
});
cc.view.enableAutoFullScreen(!1);
cc.CORE.RESOURCE = {
LOBBY: r(!0, "Lobby", "Lobby_Bundle"),
SICBO: r(!0, "Sicbo", [ "Sicbo_Bundle", "Xocdia_Bundle" ]),
XOCDIA: r(!0, "Xocdia", [ "Xocdia_Bundle" ])
};
},
GetGameOpen: function(t) {
void 0 === t && (t = null);
var e = null !== t ? t : n.getItem("GAME_OPEN");
if (!e) return r(!0, "Lobby", "Lobby_Bundle");
e = e.toUpperCase();
return cc.CORE.RESOURCE.hasOwnProperty(e) ? cc.CORE.RESOURCE[e] : r(!0, "Lobby", "Lobby_Bundle");
}
};
cc._RF.pop();
}, {
LocalStorage: "LocalStorage"
} ],
Helper: [ function(t, e) {
"use strict";
cc._RF.push(e, "ca5bbLCS39M+adpLD4kVa50", "Helper");
var n = t("md5"), r = t("BrowserUtil"), o = t("HttpRequest");
function i(t) {
if (t) {
var e = (t = parseInt(t)).toString().split(".");
return e[0] = e[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."), e.join(".");
}
return "0";
}
function s(t) {
if (t) {
var e = parseFloat(t).toFixed(2).split(".");
e[0] = e[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return e.join(".");
}
return "0";
}
function a(t, e) {
for (var n = "" + t; n.length < e; ) n = "0" + n;
return n;
}
function c(t) {
return !!/^(\d{1,3}\.){3}\d{1,3}$/.test(t) && t.split(".").every(function(t) {
var e = parseInt(t, 10);
return e >= 0 && e <= 255;
});
}
function u(t, e, n) {
var r = 0;
(function o() {
if (r >= t.length) n && n(null, new Error("All methods failed")); else {
var i = t[r];
r++;
var s = setTimeout(function() {
o();
}, e);
i().then(function(t) {
clearTimeout(s);
cc.CORE && (cc.CORE.IP_ADDRESS = t);
n && n(t, null);
}).catch(function(t) {
clearTimeout(s);
console.log("Method " + r + " failed:", t.message);
o();
});
}
})();
}
e.exports = {
BrowserUtil: r,
setFrameRate: function(t) {
var e = !1;
[ "iPhone OS 14", "iPhone OS 15", "iPhone OS 16", "Android 10", "Android 11", "Android 12", "iPad", "Macintosh" ].forEach(function(t) {
if (cc.sys.isBrowser && window.navigator.userAgent.includes(t)) {
console.log("Detected " + t + " Is Low GPU Device! ...");
return e = !0;
}
});
e ? cc.game.setFrameRate(60) : cc.game.setFrameRate(t);
},
isDynamicDevice: function() {
var t = cc.sys.getSafeAreaRect(), e = cc.winSize;
return t.width < e.width || t.height < e.height || 0 !== t.x || 0 !== t.y;
},
forceEnableAudio: function() {
if (cc.sys.isBrowser) {
var t = cc.audioEngine._audioID || cc.audioEngine._context;
t || (t = new (window.AudioContext || window.webkitAudioContext)());
"running" === t.state ? cc.CORE.AUDIO.licensedAudio = !0 : t.state;
}
},
isMobile: function() {
if (cc.sys.isNative) return !0;
if (cc.sys.isBrowser) {
var t = navigator.userAgent.toLowerCase();
return !!/android|iphone|ipod|ipad|windows phone/i.test(t);
}
return !1;
},
initSpriteBase64: function(t, e) {
var n = new Image();
n.src = e;
setTimeout(function() {
var e = new cc.Texture2D();
e.initWithElement(n);
e.handleLoadedTexture();
var r = new cc.SpriteFrame(e);
t.spriteFrame = r;
}.bind(this), 10);
},
signHash: function(t) {
return n(t + "3DsGqAndp32mErJjzflz6Uvz0ni1HYuP");
},
getQueryValue: function(t) {
for (var e = null, n = decodeURI(window.location.search.substring(1)).split("&"), r = 0; r < n.length; r++) {
var o = n[r].split("=");
if (o[0] == t) return "" == o[1] ? e : e = o[1];
}
return e;
},
checkPhoneValid: function(t) {
return /^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))[0-9]{7,10}$/im.test(t);
},
nFormatter: function(t, e) {
for (var n = [ {
value: 1e18,
symbol: "E"
}, {
value: 1e15,
symbol: "P"
}, {
value: 1e12,
symbol: "T"
}, {
value: 1e9,
symbol: "G"
}, {
value: 1e6,
symbol: "M"
}, {
value: 1e3,
symbol: "K"
} ], r = /\.0+$|(\.[0-9]*[1-9])0+$/, o = 0; o < n.length; o++) if (t >= n[o].value) return (t / n[o].value).toFixed(e).replace(r, "$1") + n[o].symbol;
return t.toFixed(e).replace(r, "$1");
},
abbreviateNumber: function(t) {
if (t < 1e3) return t;
var e, n = [ "", "K", "M", "B", "T" ], r = Math.floor(Math.log10(t) / 3), o = t / Math.pow(1e3, r);
if ("K" === n[r]) e = o.toFixed(0); else if ("M" === n[r] || "B" === n[r]) {
var i = (e = o.toFixed(3)).split(".");
i[1] && 0 == Number(i[1]) && (e = o.toFixed(0));
} else e = o;
return "" + e + n[r];
},
abbreviateNumber_2: function(t) {
if (t < 1e3) return t;
var e = Math.floor(Math.log10(t) / 3), n = t / Math.pow(1e3, e);
return "" + Math.floor(100 * n) / 100 + [ "", "K", "M", "B", "T" ][e];
},
numberWithCommas: i,
numberWithCommasReal: s,
isEmpty: function(t) {
return !t || 0 === t.length;
},
isNumber: function(t) {
return "number" == typeof t;
},
getOnlyNumberInString: function(t) {
var e = t.match(/\d+/g);
return e ? e.join("") : "";
},
nonAccentVietnamese: function(t) {
return (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = t.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A")).replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")).replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E")).replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")).replace(/I|Í|Ì|Ĩ|Ị/g, "I")).replace(/ì|í|ị|ỉ|ĩ/g, "i")).replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O")).replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")).replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U")).replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")).replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y")).replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")).replace(/Đ/g, "D")).replace(/đ/g, "d")).replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "")).replace(/\u02C6|\u0306|\u031B/g, "");
},
getStringDateByTimeNoYear: function(t) {
var e = new Date(t), n = e.getHours(), r = e.getMinutes(), o = e.getDate(), i = e.getMonth() + 1;
return n < 10 && (n = "0" + n), r < 10 && (r = "0" + r), o < 10 && (o = "0" + o), 
i < 10 && (i = "0" + i), n + ":" + r + " " + o + "/" + i;
},
getDayOfWeek: function(t, e) {
void 0 === e && (e = "DD-MM-YYYY");
var n;
if ("DD-MM-YYYY" === e) {
var r = t.split("-"), o = r[0], i = r[1], s = r[2];
n = new Date(s + "-" + i + "-" + o);
} else {
if ("MM-DD-YYYY" !== e) throw new Error("Invalid format. Supported formats: 'DD-MM-YYYY', 'MM-DD-YYYY'");
var a = t.split("-"), c = a[0], u = a[1], f = a[2];
n = new Date(f + "-" + c + "-" + u);
}
return [ "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" ][n.getDay()];
},
getDateByTime: function(t) {
var e = new Date(t);
return e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear();
},
divideEqually: function(t, e) {
for (var n = Math.floor(t.length / e.length), r = [], o = 0, i = 0; i < e.length; i++) {
var s = o + n;
r.push(t.slice(o, s));
o = s;
}
var a = t.slice(o);
if (a.length > 0) for (var c = 0; c < a.length; c++) r[c].push(a[c]);
return r;
},
numberPad: a,
inputNumber: function(t) {
var e = !1;
t.addEventListener("keydown", function(t) {
if (16 === t.keyCode) {
t.preventDefault();
e = !0;
}
});
t.addEventListener("keyup", function(t) {
if (16 === t.keyCode) {
t.preventDefault();
e = !1;
}
});
t.addEventListener("keydown", function(t) {
!e && (t.keyCode >= 48 && t.keyCode <= 57 || t.keyCode >= 96 && t.keyCode <= 105 || t.keyCode >= 37 && t.keyCode <= 40 || 107 === t.keyCode || 109 === t.keyCode || 189 === t.keyCode || 8 === t.keyCode || 13 === t.keyCode) || t.preventDefault();
});
},
getDateRange: function(t) {
var e, n, r = new Date(), o = function(t) {
return String(t.getDate()).padStart(2, "0") + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + t.getFullYear();
};
switch (t) {
case "today":
e = n = r;
break;

case "this_week":
var i = r.getDay(), s = new Date(r);
s.setDate(r.getDate() - i + 1);
var a = new Date(r);
a.setDate(r.getDate() - i + 7);
e = s;
n = a;
break;

case "this_month":
e = new Date(r.getFullYear(), r.getMonth(), 1);
n = new Date(r.getFullYear(), r.getMonth() + 1, 0);
break;

case "this_year":
e = new Date(r.getFullYear(), 0, 1);
n = new Date(r.getFullYear(), 11, 31);
break;

default:
throw new Error("Invalid type");
}
return {
from: o(e),
to: o(n)
};
},
anPhanTram: function(t, e, n, r) {
void 0 === r && (r = !1);
var o = r ? v1 : t;
return t * e - Math.ceil(o * n / 100);
},
numberTo: function(t, e, n, r, o) {
void 0 === o && (o = !1);
clearInterval(t.timer);
var s = n - e, a = Math.abs(Math.floor(r / s));
a = Math.max(a, 50);
var c = new Date().getTime() + r;
t.timer = setInterval(function() {
if (t.node) {
var e = new Date().getTime(), a = Math.max((c - e) / r, 0), u = n - a * s >> 0;
t.string = o ? i(u) : u;
u == n && clearInterval(t.timer);
} else clearInterval(t.timer);
}, a);
},
numberToReal: function(t, e, n, r, o) {
void 0 === o && (o = !1);
clearInterval(t.timer);
var i = n - e, a = Math.abs(Math.floor(r / i));
a = Math.max(a, 50);
var c = new Date().getTime() + r;
t.timer = setInterval(function() {
if (t.node) {
var e = new Date().getTime(), a = Math.max((c - e) / r, 0), u = (n - a * i).toFixed(2);
t.string = o ? s(u) : u;
u == n && clearInterval(t.timer);
} else clearInterval(t.timer);
}, a);
},
getStringDateByTime: function(t) {
var e = new Date(t), n = e.getHours(), r = e.getMinutes(), o = e.getSeconds(), i = e.getDate(), s = e.getMonth() + 1;
return n < 10 && (n = "0" + n), r < 10 && (r = "0" + r), i < 10 && (i = "0" + i), 
s < 10 && (s = "0" + s), n + ":" + r + ":" + a(o, 2) + " " + i + "/" + s + "/" + e.getFullYear();
},
getStringHourByTime: function(t) {
var e = new Date(t), n = e.getHours(), r = e.getMinutes(), o = e.getSeconds();
return n < 10 && (n = "0" + n), r < 10 && (r = "0" + r), o < 10 && (o = "0" + o), 
n + ":" + r + ":" + o;
},
numberToTime: function(t) {
t < 0 && (t = 0), t = parseInt(t);
var e = parseInt(t / 60), n = t % 60;
return e < 10 && (e = "0" + e), n < 10 && (n = "0" + n), e + ":" + n;
},
validateEmail: function(t) {
return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t);
},
addZero10: function(t) {
t < 10 && (t = "0" + t);
return t;
},
copyToClipboard: function(t) {
if (cc.sys.isNative) {
if (jsb) {
jsb.copyTextToClipboard(t);
return !0;
}
return !1;
}
var e = document.createElement("input");
e.value = t;
e.id = "inputID";
document.body.appendChild(e);
e.select();
document.execCommand("copy");
document.body.removeChild(e);
return !0;
},
getRandomInt: function(t, e) {
t = Math.ceil(t);
e = Math.floor(e);
return Math.floor(Math.random() * (e - t + 1)) + t;
},
jsUcfirst: function(t) {
return t.charAt(0).toUpperCase() + t.slice(1);
},
serializeObject: function(t) {
var e = [];
for (var n in t) t.hasOwnProperty(n) && e.push(encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
return e.join("&");
},
LoadImgFromUrl: function(t, e, n, r, o) {
void 0 === n && (n = null);
void 0 === r && (r = null);
void 0 === o && (o = "png");
if (e) {
var i = t;
cc.assetManager.loadRemote(e, {
ext: "." + o
}, function(t, e) {
if (t) {
console.error("Error loading image from URL:", t);
r && r(t, null);
} else {
var o = new cc.SpriteFrame(e);
i.spriteFrame = o;
n && i.node.setPosition(n);
r && r(null, o);
}
});
}
},
LoadImgFromBase64: function(t, e, n) {
void 0 === n && (n = null);
if (e) {
var r, o = e.split(",")[1] || e, i = (r = o).startsWith("iVBOR") ? "png" : r.startsWith("/9j/") ? "jpg" : (r.startsWith("R0lGOD"), 
"png");
if (cc.sys.isNative) try {
for (var s = atob(o), a = s.length, c = new Uint8Array(a), u = 0; u < a; u++) c[u] = s.charCodeAt(u);
var f = jsb.fileUtils.getWritablePath() + "temp_img." + i;
jsb.fileUtils.isFileExist(f) && jsb.fileUtils.removeFile(f);
jsb.fileUtils.writeDataToFile(c, f);
console.log("FilePath saved:", f, "Size:", c.length);
console.log("File exist:", jsb.fileUtils.isFileExist(f));
cc.assetManager.loadRemote(f, function(e, r) {
if (e) console.error("Error load base64 (native):", e); else {
console.log("Texture loaded:", r);
t.spriteFrame = new cc.SpriteFrame(r);
n && t.node.setPosition(n);
}
});
} catch (t) {
console.error("Exception Base64->Native:", t);
} else {
var l = new Image();
l.src = "data:image/" + i + ";base64," + o;
l.onload = function() {
var e = new cc.Texture2D();
e.initWithElement(l);
e.handleLoadedTexture();
t.spriteFrame = new cc.SpriteFrame(e);
n && t.node.setPosition(n);
};
l.onerror = function(t) {
return console.error("Error load base64 (web):", t);
};
}
}
},
cutText: function(t, e) {
void 0 === e && (e = 20);
return t.length > e ? t.substring(0, e) + "..." : t;
},
createTypingString: function(t, e, n) {
void 0 === t && (t = "");
void 0 === e && (e = 100);
void 0 === n && (n = null);
return new Promise(function(r) {
for (var o = function(o) {
setTimeout(function() {
n.string += t[o];
o == t.length - 1 && r(!0);
}, e * o);
}, i = 0; i < t.length; i++) o(i);
});
},
removeTypingString: function(t, e, n) {
void 0 === t && (t = "");
void 0 === e && (e = 100);
void 0 === n && (n = null);
},
stringToBoolean: function(t) {
var e;
switch (null == t ? void 0 : null == (e = t.toLowerCase()) ? void 0 : e.trim()) {
case "true":
case "yes":
case "1":
return !0;

case "false":
case "no":
case "0":
case null:
case void 0:
return !1;

default:
return null;
}
},
sliceLastArrayByLimit: function(t, e) {
if (t.length <= e) return t;
var n = t.length - e;
return t.slice(n);
},
getClientIp: function(t, e) {
void 0 === t && (t = null);
void 0 === e && (e = {});
var n = Object.assign({
timeout: 5e3,
useWebRTC: !0,
useAPI: !0
}, e);
if (cc.CORE && cc.CORE.IP_ADDRESS && !t) return cc.CORE.IP_ADDRESS;
var r = [];
cc.sys && cc.sys.isNative && r.push(function() {
return new Promise(function(t, e) {
try {
if ("undefined" != typeof jsb) {
if (jsb.reflection) try {
if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod("java/net/NetworkInterface", "getNetworkInterfaces", "()Ljava/util/Enumeration;"); else if (cc.sys.os === cc.sys.OS_IOS) {
var n = jsb.reflection.callStaticMethod("NetworkHelper", "getLocalIPAddress", "()Ljava/lang/String;");
if (n && "0.0.0.0" !== n) {
t(n);
return;
}
}
} catch (t) {
console.log("JSB reflection method failed:", t);
}
if (jsb.fileUtils) try {
var r = jsb.fileUtils.getStringFromFile("network_info.txt");
if (r) {
var o = r.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
if (o) {
t(o[1]);
return;
}
}
} catch (t) {
console.log("JSB fileUtils method failed:", t);
}
}
if (cc.sys && cc.sys.getNetworkType) try {
var i = cc.sys.getNetworkType();
if (i && "object" == typeof i && i.ip) {
t(i.ip);
return;
}
} catch (t) {
console.log("cc.sys.getNetworkType failed:", t);
}
e(new Error("JSB methods failed"));
} catch (t) {
e(t);
}
});
});
n.useWebRTC && cc.sys && cc.sys.isBrowser && r.push(function() {
return new Promise(function(t, e) {
try {
if ("undefined" == typeof RTCPeerConnection) {
e(new Error("WebRTC not supported"));
return;
}
var n = new RTCPeerConnection({
iceServers: [ {
urls: "stun:stun.l.google.com:19302"
} ]
});
n.createDataChannel("");
n.onicecandidate = function(e) {
if (e.candidate) {
var r = e.candidate.candidate.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
if (r && !(o = r[1], [ /^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./, /^127\./, /^169\.254\./ ].some(function(t) {
return t.test(o);
}))) {
n.close();
t(r[1]);
return;
}
}
var o;
};
n.createOffer().then(function(t) {
return n.setLocalDescription(t);
}).catch(e);
setTimeout(function() {
n.close();
e(new Error("WebRTC timeout"));
}, 3e3);
} catch (t) {
e(t);
}
});
});
n.useAPI && r.push(function() {
return new Promise(function(t, e) {
var n = [ "https://api.ipify.org?format=json", "https://ipapi.co/json/", "https://api.ip.sb/geoip", "https://ipinfo.io/json", "https://api.myip.com" ], r = 0;
(function i() {
if (r >= n.length) e(new Error("All APIs failed")); else {
var s = n[r];
r++;
o.Get(s, {}, {
timeout: 3e3
}).then(function(e) {
var n = null;
if (e.ip) n = e.ip; else if (e.query) n = e.query; else if (e.ipAddress) n = e.ipAddress; else if ("string" == typeof e) {
var r = e.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
r && (n = r[1]);
}
n && c(n) ? t(n) : i();
}).catch(function() {
i();
});
}
})();
});
});
u(r, n.timeout, t);
},
maskPhoneNumber: function(t) {
if (!t || t.length < 7) return t;
var e = t.slice(0, 3), n = t.slice(-2);
return "" + e + "*".repeat(t.length - 7) + n;
},
togglePopup: function(t, e, n) {
void 0 === n && (n = {});
if (t && cc.isValid(t)) {
var r = n, o = r.time, i = void 0 === o ? .3 : o, s = r.scaleFrom, a = void 0 === s ? .6 : s, c = r.scaleTo, u = void 0 === c ? 1 : c, f = r.opacityFrom, l = void 0 === f ? 0 : f, h = r.opacityTo, d = void 0 === h ? 255 : h, p = r.easingIn, g = void 0 === p ? "backOut" : p, v = r.easingOut, y = void 0 === v ? "quartInOut" : v, m = r.callback, E = void 0 === m ? null : m;
if (e) {
t.active = !0;
t.opacity = l;
t.scale = a;
cc.tween(t).to(i, {
scale: u,
opacity: d
}, {
easing: g
}).call(function() {
"function" == typeof E && E();
}).start();
} else {
if (!t.active) return;
cc.tween(t).to(i, {
scale: a,
opacity: l
}, {
easing: y
}).call(function() {
t.active = !1;
"function" == typeof E && E();
}).start();
}
}
},
setNodeZOrder: {
setToFront: function(t) {
if (t && t.parent) {
var e = t.parent;
t.setSiblingIndex(e.children.length - 1);
}
},
setToBack: function(t) {
t && t.parent && t.setSiblingIndex(0);
}
},
ensurePaymentReady: function(t, e) {
void 0 === t && (t = null);
void 0 === e && (e = 5e3);
if (cc.CORE && cc.CORE.PAYMENT) {
t && t();
return !0;
}
var n = 0, r = e / 100, o = setInterval(function() {
n++;
if (cc.CORE && cc.CORE.PAYMENT) {
clearInterval(o);
t && t();
} else if (n >= r) {
clearInterval(o);
console.error("cc.CORE.PAYMENT is not ready after timeout");
t && t(null, new Error("PAYMENT not ready"));
}
}, 100);
return !1;
},
safeSetUserBankAccount: function(t) {
if (!cc.CORE || !cc.CORE.PAYMENT) {
console.error("cc.CORE.PAYMENT is not initialized");
return !1;
}
try {
cc.CORE.PAYMENT.USER_BANK_ACCOUNT = t;
return !0;
} catch (t) {
console.error("Error setting USER_BANK_ACCOUNT:", t);
return !1;
}
},
safeGetUserBankAccount: function() {
return cc.CORE && cc.CORE.PAYMENT && cc.CORE.PAYMENT.USER_BANK_ACCOUNT ? cc.CORE.PAYMENT.USER_BANK_ACCOUNT : null;
}
};
cc._RF.pop();
}, {
BrowserUtil: "BrowserUtil",
HttpRequest: "HttpRequest",
md5: "md5"
} ],
HttpRequest: [ function(t, e) {
"use strict";
cc._RF.push(e, "851b6I6rhFPZ5mj2fVzFYWY", "HttpRequest");
function n() {
return (n = Object.assign ? Object.assign.bind() : function(t) {
for (var e = 1; e < arguments.length; e++) {
var n = arguments[e];
for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
}
return t;
}).apply(this, arguments);
}
e.exports = {
Get: function(t, e, n) {
void 0 === t && (t = "");
void 0 === e && (e = {});
void 0 === n && (n = {});
var r = Object.keys(e).map(function(t) {
return encodeURIComponent(t) + "=" + encodeURIComponent(e[t]);
}).join("&"), o = t + (r ? "?" + r : "");
return cc.sys.isBrowser ? new Promise(function(t, e) {
fetch(o, {
method: "GET",
headers: n,
redirect: "follow"
}).then(function(e) {
t(e.json());
}).catch(function(t) {
cc.log(t);
e(t);
});
}) : cc.sys.isBrowser ? void 0 : new Promise(function(t, e) {
var r = new XMLHttpRequest();
r.open("GET", o, !0);
for (var i in n) r.setRequestHeader(i, n[i]);
r.onreadystatechange = function() {
if (4 == r.readyState && 200 == r.status) try {
var n = JSON.parse(r.responseText);
t(n);
} catch (t) {
e({
status: r.status,
statusText: "Failed to parse JSON"
});
} else e({
status: r.status,
statusText: r.statusText
});
};
r.onerror = function() {
e({
status: r.status,
statusText: r.statusText
});
};
r.send();
});
},
Post: function(t, e, r, o) {
void 0 === t && (t = "");
void 0 === e && (e = {});
void 0 === r && (r = {});
void 0 === o && (o = {});
var i = Object.keys(e).map(function(t) {
return encodeURIComponent(t) + "=" + encodeURIComponent(e[t]);
}).join("&"), s = t + (i ? "?" + i : "");
return cc.sys.isBrowser ? new Promise(function(t, e) {
fetch(s, {
method: "POST",
headers: n({
"Content-Type": "application/json"
}, o),
body: JSON.stringify(r)
}).then(function(e) {
t(e.json());
}).catch(function(t) {
cc.log(t);
e(t);
});
}) : cc.sys.isBrowser ? void 0 : new Promise(function(t, e) {
var n = new XMLHttpRequest();
n.open("POST", s, !0);
for (var i in o) n.setRequestHeader(i, o[i]);
n.setRequestHeader("Content-Type", "application/json");
n.onreadystatechange = function() {
if (4 == n.readyState && 200 == n.status) try {
var r = JSON.parse(n.responseText);
t(r);
} catch (t) {
e({
status: n.status,
statusText: "Failed to parse JSON"
});
} else e({
status: n.status,
statusText: n.statusText
});
};
n.onerror = function() {
e({
status: n.status,
statusText: n.statusText
});
};
n.send(JSON.stringify(r));
});
}
};
cc._RF.pop();
}, {} ],
"Loading.Controller": [ function(t, e) {
"use strict";
cc._RF.push(e, "d191bjsVVxAfrQhpUsj68K1", "Loading.Controller");
var n = t("Config"), r = t("Environment_Enum"), o = t("HttpRequest"), i = t("AssetManager");
t("BrowserUtil").isVisibleTab();
t("GameInit.Controller").initState();
t("LocalStorage").initState();
t("GameLoad.Controller").initState();
t("GameInit.Controller").getCurrentIP();
cc.Class({
extends: cc.Component,
properties: {
messageLabel: cc.Label,
descriptionLabel: cc.Label,
versionLabel: cc.Label,
manifestUrl: {
default: null,
type: cc.Asset
},
retryButtonNode: cc.Node,
processBarLine: cc.Node,
startIcon: cc.Node,
debugPanel: cc.Node,
debugPanel_current_load: cc.Label,
debugPanel_total_count: cc.Label,
debugPanel_percent: cc.Label,
maintance_text: cc.Label,
_currentPercentLoaded: 0,
_am: null,
_updating: !1,
_canRetry: !1,
_storagePath: ""
},
onLoad: function() {
cc.inGame = this;
this.isLoadScene = !1;
this.isLoadConfig = !1;
this.initGamePlay();
this.initOneSign();
this.initClientIp();
},
initGamePlay: function() {
var t = this;
cc.log("Environment: " + n.ENVIRONMENT);
var e = this;
cc.ProjectAsset = JSON.parse(this.manifestUrl._nativeAsset);
o.Get(n.SERVER_API + "/setting?keys=maintenance_status,maintenance_text,application_version", {}, {}, {}).then(function(o) {
if (0 == (null == o ? void 0 : o.error_code)) {
var i = t.getSettingByKey(o.data, "maintenance_status"), s = t.getSettingByKey(o.data, "maintenance_text"), a = t.getSettingByKey(o.data, "application_version");
localStorage.setItem("APP_VERSION", a);
t.versionLabel.node.active = !0;
t.versionLabel.string = a;
if ("1" == i) {
t.maintance_text.string = s;
t.maintance_text.node.active = !0;
} else {
t.maintance_text.node.active = !1;
n.ENVIRONMENT == r.DEVELOPMENT ? e.loadAssets() : setTimeout(function() {
cc.sys.isBrowser ? e.loadAssets() : (e.initHotUpdate(), e.checkUpdate());
}.bind(t), 2e3);
}
}
}).catch(function(e) {
console.log(e);
t.maintance_text.string = "Lỗi: " + e.message;
t.maintance_text.node.active = !0;
});
},
initClientIp: function() {
cc.CORE.UTIL.getClientIp();
},
initOneSign: function() {
this.checkPlugin() && (sdkbox.PluginOneSignal.init(), sdkbox.PluginOneSignal.setListener({
onSendTag: function() {},
onGetTags: function() {},
onIdsAvailable: function() {},
onPostNotification: function() {},
onNotification: function() {}
}));
},
checkPlugin: function() {
return "undefined" != typeof sdkbox && (void 0 !== sdkbox.PluginOneSignal || (console.log("sdkbox.PluginFacebook is undefined"), 
!1));
},
loadAssets: function() {
this.updateProgress(0, 0);
this.messageLabel.string = "Đang tải trò chơi...";
setTimeout(function() {
this.loadCommonResource();
}.bind(this), 1e3);
},
loadCommonResource: function() {
var t = this, e = this;
this.messageLabel.string = "Đang tải gói tài nguyên chung...";
var n = 0;
cc.assetManager.loadBundle("Common_Bundle", function(e, r) {
var o = Math.round(100 * e / r);
o > n && (n = o);
t.updateProgress(r, percent);
}, function(n) {
if (n) {
cc.log(n);
return e.messageLabel.string = "Lỗi: Tải gói tài nguyên chung thất bại!";
}
t.loadGameResource();
});
},
loadGameResource: function() {
var e = this, n = this;
n.messageLabel.string = "Đang tải gói tài nguyên trò chơi...";
var r = t("GameLoad.Controller").GetGameOpen();
console.log("Open Game: ", r);
if (null !== r.resource_bundle) {
var o = 0;
cc.assetManager.loadBundle(r.resource_bundle, function(t, e) {
var r = Math.round(100 * t / e);
r > o && (o = r);
n.updateProgress(e, t);
}, function(t) {
if (t) {
cc.log(t);
return n.messageLabel.string = "Lỗi: Tải gói tài nguyên trò chơi thất bại!";
}
if (r.resource_type) {
var o = 0;
cc.director.preloadScene(r.resource_name, function(t, r) {
n.debugPanel.active = !1;
n.debugPanel_current_load.string = t;
n.debugPanel_total_count.string = r;
var i = Math.round(100 * t / r);
i > o && (o = i);
e.updateProgress(r, o);
n.debugPanel_percent.string = o + "%";
}, function(t) {
if (t) {
cc.log(t);
return n.messageLabel.string = "Lỗi: Mở trò chơi thất bại!";
}
n.messageLabel.string = "Đang khởi động trò chơi...";
i.loadFromBundle(r.resource_bundle, "Prefabs/Popup/Lobby.Popup", cc.Prefab).then(function() {
cc.director.loadScene(r.resource_name);
}).catch(function(t) {
console.error("❌ Error loading prefab:", t);
n.messageLabel.string = "Lỗi: Khởi động trò chơi thất bại!";
});
});
}
});
}
},
onDestroy: function() {
if (this._updateListener) {
this._am.setEventCallback(null);
this._updateListener = null;
}
},
initHotUpdate: function() {
this.updateProgress(0, 0);
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/";
cc.log("[HotUpdate] storagePath:", this._storagePath);
this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, this._storagePath, this.versionCompareHandle);
this._am.setVerifyCallback(function(t) {
cc.log("[HotUpdate] Verifying asset:", t);
return !0;
});
cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
},
checkUpdate: function() {
if (this._updating) this.messageLabel.string = "Kiểm tra phiên bản mới..."; else {
this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
this._am.setEventCallback(this.checkCb.bind(this));
this._am.checkUpdate();
this._updating = !0;
}
},
hotUpdate: function() {
if (this._am && !this._updating) {
this._am.setEventCallback(this.updateCb.bind(this));
this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
this._failCount = 0;
this._am.update();
this._updating = !0;
}
},
retry: function() {
!this._updating && this._canRetry && (this.retryButtonNode.active = !1, this._canRetry = !1, 
this.messageLabel.string = "Thử lại...", this._am.downloadFailedAssets());
},
checkCb: function(t) {
var e = !1, n = !1;
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.messageLabel.string = "Không tìm thấy bảng kê khai cục bộ.";
this.descriptionLabel.string = "Code: Đã xảy ra lỗi với bản kê khai từ xa!";
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.messageLabel.string = "Không thể phân tích cú pháp manifest máy chủ.";
this.descriptionLabel.string = "Code: Đã xảy ra lỗi với bản kê khai từ xa!";
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.updateProgress(0, 100);
this.messageLabel.string = "Bạn đang sử dụng phiên bản mới nhất.";
this.descriptionLabel.string = "Code: 200";
e = !0;
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.messageLabel.string = "Đã tìm thấy phiên bản mới!";
this.messageLabel.string = "Đã tìm thấy bản cập nhật mới.";
this.descriptionLabel.string = "Code: 100 Đang cập nhật...";
this.updateProgress(0, 0);
n = !0;
break;

default:
return;
}
this._am.setEventCallback(null);
this._checkListener = null;
this._updating = !1;
n && this.hotUpdate();
e && this.loadAssets();
},
updateCb: function(t) {
var e = !1, n = !1;
cc.log("[HotUpdate] Event code:", t.getEventCode(), t.getMessage ? t.getMessage() : "");
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.messageLabel.string = "Không tìm thấy bảng kê khai cục bộ.";
this.updateProgress(0, 0);
this.descriptionLabel.string = "Code: 1007";
this.retryButtonNode.active = !0;
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var r = 100 * t.getPercent() >> 0;
this.messageLabel.string = "Đang tải: " + r + "%";
this.updateProgress(0, r, 1);
this.descriptionLabel.string = "Code: 1006";
cc.log("[HotUpdate] Progress:", r + "%", "downloaded:", t.getDownloadedFiles(), "/", t.getTotalFiles(), t.getDownloadedBytes(), "/", t.getTotalBytes());
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this.messageLabel.string = "Cập nhật hoàn tất.\nTrò chơi sẽ được khởi động lại.";
this.updateProgress(0, 100);
this.descriptionLabel.string = "Code: 1003";
this.retryButtonNode.active = !1;
e = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this.messageLabel.string = "Cập nhật phiên bản không thành công.";
this.updateProgress(0, 100);
this.descriptionLabel.string = "Code: 1002";
this.retryButtonNode.active = !0;
this._updating = !1;
this._canRetry = !0;
}
if (n) {
this._am.setEventCallback(null);
this._updateListener = null;
this._updating = !1;
}
if (e) {
this._am.setEventCallback(null);
this._updateListener = null;
var o = jsb.fileUtils.getSearchPaths(), i = this._am.getLocalManifest().getSearchPaths();
Array.prototype.unshift.apply(o, i);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(o));
jsb.fileUtils.setSearchPaths(o);
setTimeout(function() {
cc.log("[HotUpdate] Đang khởi động lại trò chơi...");
cc.audioEngine.stopAll();
cc.game.restart();
}, 5e3);
}
},
onRetryClick: function() {
this.retry();
cc.sys.isBrowser ? this.loadAssets() : (this.initHotUpdate(), this.checkUpdate());
},
versionCompareHandle: function(t, e) {
console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e), 
console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e);
localStorage.setItem("VERSION", e);
for (var n = t.split("."), r = e.split("."), o = 0; o < n.length; ++o) {
var i = parseInt(n[o]), s = parseInt(r[o] || 0);
if (i !== s) return i - s;
}
return r.length > n.length ? -1 : 0;
},
updateProgress: function(t, e, n) {
void 0 === t && (t = 0);
void 0 === e && (e = 0);
void 0 === n && (n = !1);
var r = this.processBarLine.getComponent(cc.Sprite), o = (r.fillRange, e / 100);
r.fillRange = o;
var i = r.node.width * r.fillRange, s = -r.node.width / 2 + i - 40, a = cc.v2(s, 0), c = r.node.parent.convertToWorldSpaceAR(a);
if (n) {
this.startIcon.active = !0;
this.startIcon.setPosition(cc.v2(c.x, this.startIcon.y));
} else this.startIcon.active = !1;
},
getSettingByKey: function(t, e) {
if (!Array.isArray(t)) return null;
for (var n = 0; n < t.length; n++) if (t[n].key === e) return t[n].value;
return null;
}
});
cc._RF.pop();
}, {
AssetManager: "AssetManager",
BrowserUtil: "BrowserUtil",
Config: "Config",
Environment_Enum: "Environment_Enum",
"GameInit.Controller": "GameInit.Controller",
"GameLoad.Controller": "GameLoad.Controller",
HttpRequest: "HttpRequest",
LocalStorage: "LocalStorage"
} ],
LocalStorage: [ function(t, e) {
"use strict";
cc._RF.push(e, "a894e50s7FPqa+8sJ2cLmLs", "LocalStorage");
var n = function(t) {
return cc.sys.localStorage.getItem(t);
}, r = function(t, e) {
return cc.sys.localStorage.setItem(t, e);
};
e.exports = {
initState: function() {
n("MUSIC") ? cc.CORE.SETTING.MUSIC = cc.CORE.UTIL.stringToBoolean(n("MUSIC")) : r("MUSIC", "true");
n("SOUND") ? cc.CORE.SETTING.SOUND = cc.CORE.UTIL.stringToBoolean(n("SOUND")) : r("SOUND", "true");
},
getItem: n,
setItem: r,
removeItem: function(t) {
return cc.sys.localStorage.removeItem(t);
}
};
cc._RF.pop();
}, {} ],
Pagination_item: [ function(t, e) {
"use strict";
cc._RF.push(e, "68817bJsQ1AIafbmivSylEp", "Pagination_item");
cc.Class({
extends: cc.Component,
properties: {
bg: cc.Node,
bg_select: cc.Node,
number: cc.Label
},
start: function() {}
});
cc._RF.pop();
}, {} ],
Pagination: [ function(t, e) {
"use strict";
cc._RF.push(e, "e1f557HdRdLuZ3k0JZaQDlX", "Pagination");
cc.Class({
extends: cc.Component,
properties: {
nodeFirst: cc.Node,
nodePrevious: cc.Node,
nodePage1: cc.Node,
nodePage2: cc.Node,
nodePage3: cc.Node,
nodePage4: cc.Node,
nodePage5: cc.Node,
nodeNext: cc.Node,
nodeLast: cc.Node,
page: 1,
limit: 10,
total: 0
},
init: function(t) {
this.CORE = t;
this.node.active = !1;
this.objSelect = null;
this.nodePage1 = this.nodePage1.getComponent("Pagination_item");
this.nodePage2 = this.nodePage2.getComponent("Pagination_item");
this.nodePage3 = this.nodePage3.getComponent("Pagination_item");
this.nodePage4 = this.nodePage4.getComponent("Pagination_item");
this.nodePage5 = this.nodePage5.getComponent("Pagination_item");
this.arrO = [ this.nodePage1, this.nodePage2, this.nodePage3, this.nodePage4, this.nodePage5 ];
},
select: function(t) {
t.number.string = this.page;
t.bg.active = !1;
t.bg_select.active = !0;
this.objSelect = t;
t.node.pauseSystemEvents();
},
unSelect: function(t, e) {
t.number.string = e;
t.number.node.color = cc.Color.WHITE;
t.bg.active = !0;
t.bg_select.active = !1;
t.node.page = e;
t.node.resumeSystemEvents();
},
onSet: function(t, e, n) {
var r = this;
this.node.active = !0;
var o = this;
this.page = t;
this.limit = e;
this.total = n;
this.totalPage = Math.ceil(this.total / this.limit);
this.pageRed = this.totalPage - this.page;
if (n > 0) {
this.node.active = !0;
Promise.all(this.arrO.map(function(t, e) {
o.totalPage > 4 ? t.node.active = !0 : e < o.totalPage ? t.node.active = !0 : t.node.active = !1;
o.page > 2 ? o.nodeFirst.active = !0 : o.nodeFirst.active = !1;
o.pageRed > 1 ? o.nodeLast.active = !0 : o.nodeLast.active = !1;
o.page > 1 ? o.nodePrevious.active = !0 : o.nodePrevious.active = !1;
o.pageRed > 0 ? o.nodeNext.active = !0 : o.nodeNext.active = !1;
return 0 == e && 1 == o.page ? o.select(t) : 1 == e && 2 == o.page ? o.select(t) : 2 == e && (3 == o.page || o.totalPage > 5 && 1 !== o.page && 2 !== o.page && o.totalPage - 2 >= o.page) ? o.select(t) : 3 == e && (4 == o.totalPage && 4 == o.page || o.totalPage > 4 && o.totalPage - 1 == o.page) ? o.select(t) : 4 == e && o.totalPage > 4 && o.page == o.totalPage ? o.select(t) : void 0;
})).then(function() {
Promise.all(r.arrO.map(function(t, e) {
t !== o.objSelect && (0 == e ? "page2" == o.objSelect.node.name ? o.unSelect(t, o.objSelect.number.string - 1) : "page3" == o.objSelect.node.name ? o.unSelect(t, o.objSelect.number.string - 2) : "page4" == o.objSelect.node.name ? o.unSelect(t, o.objSelect.number.string - 3) : "page5" == o.objSelect.node.name && o.unSelect(t, o.objSelect.number.string - 4) : 1 == e ? "page1" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 1) : "page3" == o.objSelect.node.name ? o.unSelect(t, o.objSelect.number.string - 1) : "page4" == o.objSelect.node.name ? o.unSelect(t, o.objSelect.number.string - 2) : "page5" == o.objSelect.node.name && o.unSelect(t, o.objSelect.number.string - 3) : 2 == e ? "page1" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 2) : "page2" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 1) : "page4" == o.objSelect.node.name ? o.unSelect(t, o.objSelect.number.string - 1) : "page5" == o.objSelect.node.name && o.unSelect(t, o.objSelect.number.string - 2) : 3 == e ? "page1" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 3) : "page2" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 2) : "page3" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 1) : "page5" == o.objSelect.node.name && o.unSelect(t, o.objSelect.number.string - 1) : 4 == e && ("page1" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 4) : "page2" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 3) : "page3" == o.objSelect.node.name ? o.unSelect(t, 1 * o.objSelect.number.string + 2) : "page4" == o.objSelect.node.name && o.unSelect(t, 1 * o.objSelect.number.string + 1)));
}));
});
} else this.node.active = !1;
},
onClickFirst: function() {
this.CORE.getDataPage(1);
},
onClickPrevious: function() {
var t = this.objSelect.number.string - 1;
t > 0 && this.CORE.getDataPage(t);
},
onClickPage: function(t) {
this.CORE.getDataPage(t.target.page);
},
onClickNext: function() {
var t = 1 * this.objSelect.number.string + 1;
t <= Math.ceil(this.total / this.limit) && this.CORE.getDataPage(t);
},
onClickLast: function() {
this.CORE.getDataPage(Math.ceil(this.total / this.limit));
}
});
cc._RF.pop();
}, {} ],
ProcessBar: [ function(t, e) {
"use strict";
cc._RF.push(e, "a9a12JXKnJNpYuu4riNBrTa", "ProcessBar");
cc.Class({
extends: cc.Component,
properties: {
progressBar: cc.Sprite,
percent: cc.Label
},
onLoad: function() {},
progressBarTo: function(t) {
t < 0 || t > 1 || (this.progressBar.fillRange = Number(t));
},
progressLabelTo: function(t) {
t < 0 || t > 1 || (this.percent.string = t);
}
});
cc._RF.pop();
}, {} ],
SAT: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "0fab7Kj0uRMOKmSlZbq+p6k", "SAT");
r = function() {
var t = {};
function e(t, e) {
this.x = t || 0;
this.y = e || 0;
}
t.Vector = e;
t.V = e;
e.prototype.copy = e.prototype.copy = function(t) {
this.x = t.x;
this.y = t.y;
return this;
};
e.prototype.clone = e.prototype.clone = function() {
return new e(this.x, this.y);
};
e.prototype.perp = e.prototype.perp = function() {
var t = this.x;
this.x = this.y;
this.y = -t;
return this;
};
e.prototype.rotate = e.prototype.rotate = function(t) {
var e = this.x, n = this.y;
this.x = e * Math.cos(t) - n * Math.sin(t);
this.y = e * Math.sin(t) + n * Math.cos(t);
return this;
};
e.prototype.reverse = e.prototype.reverse = function() {
this.x = -this.x;
this.y = -this.y;
return this;
};
e.prototype.normalize = e.prototype.normalize = function() {
var t = this.len();
if (t > 0) {
this.x = this.x / t;
this.y = this.y / t;
}
return this;
};
e.prototype.add = e.prototype.add = function(t) {
this.x += t.x;
this.y += t.y;
return this;
};
e.prototype.sub = e.prototype.sub = function(t) {
this.x -= t.x;
this.y -= t.y;
return this;
};
e.prototype.scale = e.prototype.scale = function(t, e) {
this.x *= t;
this.y *= "undefined" != typeof e ? e : t;
return this;
};
e.prototype.project = e.prototype.project = function(t) {
var e = this.dot(t) / t.len2();
this.x = e * t.x;
this.y = e * t.y;
return this;
};
e.prototype.projectN = e.prototype.projectN = function(t) {
var e = this.dot(t);
this.x = e * t.x;
this.y = e * t.y;
return this;
};
e.prototype.reflect = e.prototype.reflect = function(t) {
var e = this.x, n = this.y;
this.project(t).scale(2);
this.x -= e;
this.y -= n;
return this;
};
e.prototype.reflectN = e.prototype.reflectN = function(t) {
var e = this.x, n = this.y;
this.projectN(t).scale(2);
this.x -= e;
this.y -= n;
return this;
};
e.prototype.dot = e.prototype.dot = function(t) {
return this.x * t.x + this.y * t.y;
};
e.prototype.len2 = e.prototype.len2 = function() {
return this.dot(this);
};
e.prototype.len = e.prototype.len = function() {
return Math.sqrt(this.len2());
};
function n(t, n) {
this.pos = t || new e();
this.r = n || 0;
this.offset = new e();
}
t.Circle = n;
n.prototype.getAABB = n.prototype.getAABB = function() {
var t = this.r;
return new o(this.pos.clone().add(this.offset).sub(new e(t, t)), 2 * t, 2 * t).toPolygon();
};
n.prototype.setOffset = n.prototype.setOffset = function(t) {
this.offset = t;
return this;
};
function r(t, n) {
this.pos = t || new e();
this.angle = 0;
this.offset = new e();
this.setPoints(n || []);
}
t.Polygon = r;
r.prototype.setPoints = r.prototype.setPoints = function(t) {
if (!this.points || this.points.length !== t.length) {
var n, r = this.calcPoints = [], o = this.edges = [], i = this.normals = [];
for (n = 0; n < t.length; n++) {
var s = t[n], a = n < t.length - 1 ? t[n + 1] : t[0];
if (s === a || s.x !== a.x || s.y !== a.y) {
r.push(new e());
o.push(new e());
i.push(new e());
} else {
t.splice(n, 1);
n -= 1;
}
}
}
this.points = t;
this._recalc();
return this;
};
r.prototype.setAngle = r.prototype.setAngle = function(t) {
this.angle = t;
this._recalc();
return this;
};
r.prototype.setOffset = r.prototype.setOffset = function(t) {
this.offset = t;
this._recalc();
return this;
};
r.prototype.rotate = r.prototype.rotate = function(t) {
for (var e = this.points, n = e.length, r = 0; r < n; r++) e[r].rotate(t);
this._recalc();
return this;
};
r.prototype.translate = r.prototype.translate = function(t, e) {
for (var n = this.points, r = n.length, o = 0; o < r; o++) {
n[o].x += t;
n[o].y += e;
}
this._recalc();
return this;
};
r.prototype._recalc = function() {
var t, e = this.calcPoints, n = this.edges, r = this.normals, o = this.points, i = this.offset, s = this.angle, a = o.length;
for (t = 0; t < a; t++) {
var c = e[t].copy(o[t]);
c.x += i.x;
c.y += i.y;
0 !== s && c.rotate(s);
}
for (t = 0; t < a; t++) {
var u = e[t], f = t < a - 1 ? e[t + 1] : e[0], l = n[t].copy(f).sub(u);
r[t].copy(l).perp().normalize();
}
return this;
};
r.prototype.getAABB = r.prototype.getAABB = function() {
for (var t = this.calcPoints, n = t.length, r = t[0].x, i = t[0].y, s = t[0].x, a = t[0].y, c = 1; c < n; c++) {
var u = t[c];
u.x < r ? r = u.x : u.x > s && (s = u.x);
u.y < i ? i = u.y : u.y > a && (a = u.y);
}
return new o(this.pos.clone().add(new e(r, i)), s - r, a - i).toPolygon();
};
r.prototype.getCentroid = r.prototype.getCentroid = function() {
for (var t = this.calcPoints, n = t.length, r = 0, o = 0, i = 0, s = 0; s < n; s++) {
var a = t[s], c = s === n - 1 ? t[0] : t[s + 1], u = a.x * c.y - c.x * a.y;
r += (a.x + c.x) * u;
o += (a.y + c.y) * u;
i += u;
}
return new e(r /= i *= 3, o /= i);
};
function o(t, n, r) {
this.pos = t || new e();
this.w = n || 0;
this.h = r || 0;
}
t.Box = o;
o.prototype.toPolygon = o.prototype.toPolygon = function() {
var t = this.pos, n = this.w, o = this.h;
return new r(new e(t.x, t.y), [ new e(), new e(n, 0), new e(n, o), new e(0, o) ]);
};
function i() {
this.a = null;
this.b = null;
this.overlapN = new e();
this.overlapV = new e();
this.clear();
}
t.Response = i;
i.prototype.clear = i.prototype.clear = function() {
this.aInB = !0;
this.bInA = !0;
this.overlap = Number.MAX_VALUE;
return this;
};
for (var s = [], a = 0; a < 10; a++) s.push(new e());
var c = [];
for (a = 0; a < 5; a++) c.push([]);
var u = new i(), f = new o(new e(), 1e-6, 1e-6).toPolygon();
function l(t, e, n) {
for (var r = Number.MAX_VALUE, o = -Number.MAX_VALUE, i = t.length, s = 0; s < i; s++) {
var a = t[s].dot(e);
a < r && (r = a);
a > o && (o = a);
}
n[0] = r;
n[1] = o;
}
function h(t, e, n, r, o, i) {
var a = c.pop(), u = c.pop(), f = s.pop().copy(e).sub(t), h = f.dot(o);
l(n, o, a);
l(r, o, u);
u[0] += h;
u[1] += h;
if (a[0] > u[1] || u[0] > a[1]) {
s.push(f);
c.push(a);
c.push(u);
return !0;
}
if (i) {
var d = 0;
if (a[0] < u[0]) {
i.aInB = !1;
if (a[1] < u[1]) {
d = a[1] - u[0];
i.bInA = !1;
} else d = (p = a[1] - u[0]) < (g = u[1] - a[0]) ? p : -g;
} else {
i.bInA = !1;
if (a[1] > u[1]) {
d = a[0] - u[1];
i.aInB = !1;
} else {
var p, g;
d = (p = a[1] - u[0]) < (g = u[1] - a[0]) ? p : -g;
}
}
var v = Math.abs(d);
if (v < i.overlap) {
i.overlap = v;
i.overlapN.copy(o);
d < 0 && i.overlapN.reverse();
}
}
s.push(f);
c.push(a);
c.push(u);
return !1;
}
t.isSeparatingAxis = h;
function d(t, e) {
var n = t.len2(), r = e.dot(t);
return r < 0 ? p : r > n ? v : g;
}
var p = -1, g = 0, v = 1;
t.pointInCircle = function(t, e) {
var n = s.pop().copy(t).sub(e.pos).sub(e.offset), r = e.r * e.r, o = n.len2();
s.push(n);
return o <= r;
};
t.pointInPolygon = function(t, e) {
f.pos.copy(t);
u.clear();
var n = m(f, e, u);
n && (n = u.aInB);
return n;
};
t.testCircleCircle = function(t, e, n) {
var r = s.pop().copy(e.pos).add(e.offset).sub(t.pos).sub(t.offset), o = t.r + e.r, i = o * o, a = r.len2();
if (a > i) {
s.push(r);
return !1;
}
if (n) {
var c = Math.sqrt(a);
n.a = t;
n.b = e;
n.overlap = o - c;
n.overlapN.copy(r.normalize());
n.overlapV.copy(r).scale(n.overlap);
n.aInB = t.r <= e.r && c <= e.r - t.r;
n.bInA = e.r <= t.r && c <= t.r - e.r;
}
s.push(r);
return !0;
};
function y(t, e, n) {
for (var r = s.pop().copy(e.pos).add(e.offset).sub(t.pos), o = e.r, i = o * o, a = t.calcPoints, c = a.length, u = s.pop(), f = s.pop(), l = 0; l < c; l++) {
var h = l === c - 1 ? 0 : l + 1, g = 0 === l ? c - 1 : l - 1, y = 0, m = null;
u.copy(t.edges[l]);
f.copy(r).sub(a[l]);
n && f.len2() > i && (n.aInB = !1);
var E = d(u, f);
if (E === p) {
u.copy(t.edges[g]);
var b = s.pop().copy(r).sub(a[g]);
if ((E = d(u, b)) === v) {
if ((C = f.len()) > o) {
s.push(r);
s.push(u);
s.push(f);
s.push(b);
return !1;
}
if (n) {
n.bInA = !1;
m = f.normalize();
y = o - C;
}
}
s.push(b);
} else if (E === v) {
u.copy(t.edges[h]);
f.copy(r).sub(a[h]);
if ((E = d(u, f)) === p) {
if ((C = f.len()) > o) {
s.push(r);
s.push(u);
s.push(f);
return !1;
}
if (n) {
n.bInA = !1;
m = f.normalize();
y = o - C;
}
}
} else {
var w = u.perp().normalize(), C = f.dot(w), S = Math.abs(C);
if (C > 0 && S > o) {
s.push(r);
s.push(w);
s.push(f);
return !1;
}
if (n) {
m = w;
y = o - C;
(C >= 0 || y < 2 * o) && (n.bInA = !1);
}
}
if (m && n && Math.abs(y) < Math.abs(n.overlap)) {
n.overlap = y;
n.overlapN.copy(m);
}
}
if (n) {
n.a = t;
n.b = e;
n.overlapV.copy(n.overlapN).scale(n.overlap);
}
s.push(r);
s.push(u);
s.push(f);
return !0;
}
t.testPolygonCircle = y;
t.testCirclePolygon = function(t, e, n) {
var r = y(e, t, n);
if (r && n) {
var o = n.a, i = n.aInB;
n.overlapN.reverse();
n.overlapV.reverse();
n.a = n.b;
n.b = o;
n.aInB = n.bInA;
n.bInA = i;
}
return r;
};
function m(t, e, n) {
for (var r = t.calcPoints, o = r.length, i = e.calcPoints, s = i.length, a = 0; a < o; a++) if (h(t.pos, e.pos, r, i, t.normals[a], n)) return !1;
for (a = 0; a < s; a++) if (h(t.pos, e.pos, r, i, e.normals[a], n)) return !1;
if (n) {
n.a = t;
n.b = e;
n.overlapV.copy(n.overlapN).scale(n.overlap);
}
return !0;
}
t.testPolygonPolygon = m;
return t;
}, "function" == typeof define && define.amd ? define(r) : "object" == typeof n ? e.exports = r() : (void 0).SAT = r();
var r;
cc._RF.pop();
}, {} ],
"Server.WebSocket.App": [ function(t, e) {
"use strict";
cc._RF.push(e, "68883JucTlKC63CG8CN85lR", "Server.WebSocket.App");
var n = t("LocalStorage"), r = t("Config"), o = t("Util.Network"), i = "WebSocket.App";
e.exports = {
IS_CONNECTED: !1,
IS_CONNECTING: !1,
WS: {},
Connect: function() {
if (!e.exports.IS_CONNECTED && !e.exports.IS_CONNECTING) {
e.exports.IS_CONNECTING = !0;
this.WS = {};
var t, n = r.WEBSOCKET.APP.IS_SSL ? "wss://" : "ws://";
if (this.WS && this.WS.readyState === WebSocket.OPEN) {
console.log(i + ": Kết nối đang mở, không cần tạo kết nối mới");
return;
}
t = cc.sys.isBrowser ? new WebSocket(n + r.WEBSOCKET.APP.URL) : new WebSocket(n + r.WEBSOCKET.APP.URL, null, cc.url.raw("resources/raw/cacert.pem"));
this.WS = t;
this.WS.onopen = this._onSocketConnect;
this.WS.onclose = this._onSocketDisconnect;
this.WS.onmessage = this._onSocketData;
this.WS.onerror = this._onSocketError;
}
},
Send: function(t, e) {
void 0 === e && (e = !1);
try {
this.WS && this.WS.readyState === WebSocket.OPEN && this.WS.send(e ? t : JSON.stringify(t));
} catch (t) {
cc.log(t);
}
},
_onSocketConnect: function() {
console.log(i + ": Websocket connected");
e.exports.IS_CONNECTED = !0;
e.exports.IS_CONNECTING = !1;
cc.CORE.NETWORK.APP.initAuth();
},
_onSocketDisconnect: function() {
e.exports.IS_CONNECTED = !1;
e.exports.IS_CONNECTING = !1;
cc.CORE.IS_LOGIN = !1;
setTimeout(function() {
console.log(i + ": Trying to reconnect...");
cc.CORE.NETWORK.APP.Connect();
}, 2e3);
},
_close: function() {
console.log(i + ": Socket close by client!!!");
e.exports.IS_CONNECTED = !1;
e.exports.IS_CONNECTING = !1;
cc.CORE.IS_LOGIN = !1;
this.WS && this.WS.readyState === WebSocket.OPEN && this.WS.close();
},
_onSocketData: function(t) {
var n = JSON.parse(t.data);
"ping" === n.event && e.exports._onSocketPing();
if ("authentication" === n.event) {
void 0 !== n.data.auth_dumplicate && cc.CORE.NETWORK.APP.UTIL.UpdateAuthDumplicate(n.data.auth_dumplicate);
cc.CORE.NETWORK.APP.UTIL.UpdateAuth(n.data);
}
cc.CORE.GAME_SCENCE && cc.CORE.GAME_SCENCE.onData(n);
},
_onSocketError: function(t) {
e.exports.IS_CONNECTED = !1;
e.exports.IS_CONNECTING = !1;
cc.CORE.IS_LOGIN = !1;
console.log(i + ": Socket error", JSON.stringify(t));
setTimeout(function() {
cc.CORE.NETWORK.APP.Connect();
}, 2e3);
},
_onSocketPing: function() {
cc.CORE.NETWORK.APP.Send({
event: "pong",
data: {
client_time: new Date().toISOString()
}
});
},
initAuth: function() {
var t = n.getItem("access_token");
if (!cc.CORE.IS_LOGIN && t) {
cc.CORE.NETWORK.APP.Send({
event: "authentication",
data: {
type: "token",
access_token: t
}
});
setTimeout(function() {
if (cc.CORE && cc.CORE.GAME_SCENCE && "function" == typeof cc.CORE.GAME_SCENCE.reConnect) {
cc.CORE.GAME_SCENCE.reConnect();
cc.CORE.GAME_SCENCE.FastNotify("Đang khôi phục lại kết nối mạng...", "info", 2, 1, !0);
}
}, 2e3);
}
},
UTIL: o
};
cc._RF.pop();
}, {
Config: "Config",
LocalStorage: "LocalStorage",
"Util.Network": "Util.Network"
} ],
"Server.WebSocket.Dealer": [ function(t, e) {
"use strict";
cc._RF.push(e, "46fbbGknY1Fk5QhM8EaBUkC", "Server.WebSocket.Dealer");
t("LocalStorage");
var n = t("Config"), r = t("Util.Network"), o = "WebSocket.Dealer";
e.exports = {
IS_CONNECTED: !1,
IS_CONNECTING: !1,
WS: {},
Connect: function() {
if (!e.exports.IS_CONNECTED && !e.exports.IS_CONNECTING) {
e.exports.IS_CONNECTING = !0;
this.WS = {};
var t, r = n.WEBSOCKET.DEALER.IS_SSL ? "wss://" : "ws://";
if (this.WS && this.WS.readyState === WebSocket.OPEN) {
console.log(o + ": Kết nối đang mở, không cần tạo kết nối mới");
return;
}
t = cc.sys.isBrowser ? new WebSocket(r + n.WEBSOCKET.DEALER.URL) : new WebSocket(r + n.WEBSOCKET.DEALER.URL, null, cc.url.raw("resources/raw/cacert.pem"));
this.WS = t;
this.WS.onopen = this._onSocketConnect;
this.WS.onclose = this._onSocketDisconnect;
this.WS.onmessage = this._onSocketData;
this.WS.onerror = this._onSocketError;
}
},
Send: function(t, e) {
void 0 === e && (e = !1);
try {
this.WS && this.WS.readyState === WebSocket.OPEN && this.WS.send(e ? t : JSON.stringify(t));
} catch (t) {
cc.log(t);
}
},
_onSocketConnect: function() {
console.log(o + ": Websocket connected");
e.exports.IS_CONNECTED = !0;
e.exports.IS_CONNECTING = !1;
cc.CORE.NETWORK.DEALER.initAuth();
},
_onSocketDisconnect: function() {
e.exports.IS_CONNECTED = !1;
e.exports.IS_CONNECTING = !1;
setTimeout(function() {
console.log(o + ": Trying to reconnect...");
cc.CORE.NETWORK.DEALER.Connect();
}, 2e3);
},
_close: function() {
console.log(o + ": Socket close by client!!!");
e.exports.IS_CONNECTED = !1;
e.exports.IS_CONNECTING = !1;
this.WS && this.WS.readyState === WebSocket.OPEN && this.WS.close();
},
_onSocketData: function(t) {
var n, r = JSON.parse(t.data);
cc.log(r);
null != r && null != (n = r.data) && n.ping && e.exports._onSocketPing();
cc.CORE.GAME_SCENCE && cc.CORE.GAME_SCENCE.onData(r);
},
_onSocketError: function(t) {
e.exports.IS_CONNECTED = !1;
e.exports.IS_CONNECTING = !1;
console.log(o + ": Socket error", JSON.stringify(t));
setTimeout(function() {
cc.CORE.NETWORK.DEALER.Connect();
}, 2e3);
},
_onSocketPing: function() {
cc.CORE.NETWORK.DEALER.Send({
event: "pong",
data: {
client_time: new Date().toISOString()
}
});
},
initAuth: function() {
if (void 0 !== cc.CORE.USER.account_type && "dealer" == cc.CORE.USER.account_type && void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
var t, e, n;
cc.CORE.USER && null != (t = cc.CORE.USER) && t.username && cc.CORE.NETWORK.DEALER.Send({
event: "set_dealer_info",
data: cc.CORE.USER
});
null != (e = cc.CORE.GAME_ROOM) && e.GAME_CODE && null != (n = cc.CORE.GAME_ROOM) && n.ROOM_CODE && cc.CORE.NETWORK.DEALER.Send({
event: "dealer_join_room",
data: {
game: cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
room_code: cc.CORE.GAME_ROOM.ROOM_CODE
}
});
}
},
UTIL: r
};
cc._RF.pop();
}, {
Config: "Config",
LocalStorage: "LocalStorage",
"Util.Network": "Util.Network"
} ],
SnowEffect: [ function(t, e) {
"use strict";
cc._RF.push(e, "2065frx2GhP76rZyq3nxq9S", "SnowEffect");
cc.Class({
extends: cc.Component,
properties: {
snowSprites: {
default: [],
type: [ cc.SpriteFrame ],
tooltip: "Danh sách ảnh bông tuyết (PNG trong suốt)"
},
maxSnow: {
default: 80,
tooltip: "Số lượng tuyết tối đa"
},
spawnInterval: {
default: .1,
tooltip: "Thời gian giữa mỗi lần spawn"
},
speedMin: 60,
speedMax: 150,
windStrength: {
default: 20,
tooltip: "Độ mạnh của gió (ngang)"
},
windSpeed: {
default: .3,
tooltip: "Tốc độ thay đổi hướng gió"
},
sizeMin: .5,
sizeMax: 1.2
},
onLoad: function() {
this._pool = new cc.NodePool();
this._snowList = [];
this._acc = 0;
this._windTime = 0;
var t = cc.view.getVisibleSize();
this._width = t.width;
this._height = t.height;
for (var e = 0; e < this.maxSnow; e++) {
var n = this._createSnowNode();
this._pool.put(n);
}
},
_createSnowNode: function() {
var t = new cc.Node("snow");
t.addComponent(cc.Sprite).spriteFrame = this.snowSprites[Math.floor(Math.random() * this.snowSprites.length)];
t.opacity = 180 + 75 * Math.random();
t.scale = this.sizeMin + Math.random() * (this.sizeMax - this.sizeMin);
t._vx = 0;
t._vy = -(this.speedMin + Math.random() * (this.speedMax - this.speedMin));
t._rotSpeed = 60 * Math.random() - 30;
return t;
},
_spawnSnow: function() {
if (!(this._snowList.length >= this.maxSnow)) {
var t = this._pool.size() > 0 ? this._pool.get() : this._createSnowNode();
t.parent = this.node;
t.x = (Math.random() - .5) * this._width;
t.y = this._height / 2 + 50;
t._vx = 0;
t._vy = -(this.speedMin + Math.random() * (this.speedMax - this.speedMin));
this._snowList.push(t);
}
},
update: function(t) {
this._windTime += t * this.windSpeed;
var e = Math.sin(this._windTime) * this.windStrength;
this._acc += t;
if (this._acc >= this.spawnInterval) {
this._acc = 0;
this._spawnSnow();
}
for (var n = this._snowList.length - 1; n >= 0; n--) {
var r = this._snowList[n];
r.x += (e + r._vx) * t;
r.y += r._vy * t;
r.angle += r._rotSpeed * t;
r.y < -this._height / 2 - 50 && this._recycle(r, n);
}
},
_recycle: function(t, e) {
this._snowList.splice(e, 1);
this._pool.put(t);
}
});
cc._RF.pop();
}, {} ],
Switch: [ function(t, e) {
"use strict";
cc._RF.push(e, "ba17aWLojZBKbicxJs2F8vK", "Switch");
cc.Class({
extends: cc.Sprite,
properties: {
nut: {
default: null,
type: cc.Sprite
},
NutOn: {
default: null,
type: cc.SpriteFrame
},
NutOff: {
default: null,
type: cc.SpriteFrame
},
BgOn: {
default: null,
type: cc.SpriteFrame
},
BgOff: {
default: null,
type: cc.SpriteFrame
},
isChecked: !0
},
onLoad: function() {
this.OnUpdate();
},
OnChangerClick: function() {
this.isChecked = !this.isChecked;
this.OnUpdate();
},
OnUpdate: function() {
if (this.isChecked) {
this.nut.node.stopAllActions();
this.nut.node.runAction(cc.sequence(cc.moveTo(.1, cc.v2(-11.843, 0)), cc.callFunc(function() {
this.spriteFrame = this.BgOn;
this.nut.spriteFrame = this.NutOn;
}, this)));
} else {
this.nut.node.stopAllActions();
this.nut.node.runAction(cc.sequence(cc.moveTo(.1, cc.v2(-65.843, 0)), cc.callFunc(function() {
this.spriteFrame = this.BgOff;
this.nut.spriteFrame = this.NutOff;
}, this)));
}
}
});
cc._RF.pop();
}, {} ],
"Util.Network": [ function(t, e) {
"use strict";
cc._RF.push(e, "327ffr/UtJLOaSZ39LpeuQY", "Util.Network");
function n() {
return (n = Object.assign ? Object.assign.bind() : function(t) {
for (var e = 1; e < arguments.length; e++) {
var n = arguments[e];
for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
}
return t;
}).apply(this, arguments);
}
var r = t("LocalStorage");
t("Config");
e.exports = {
UpdateClientIp: function() {
if (cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN) {
void 0 !== cc.CORE.TASK_REGISTRY.intervalUpdateClientIp && clearInterval(cc.CORE.TASK_REGISTRY.intervalUpdateClientIp);
var t = {
event: "user",
data: n({
update_ip: cc.CORE.IP_ADDRESS || null
}, cc.CORE.DEVICE_INFO ? n({}, cc.CORE.DEVICE_INFO) : {})
};
cc.CORE.NETWORK.APP.Send(t);
cc.CORE.TASK_REGISTRY.intervalUpdateClientIp = setInterval(function() {
cc.CORE.NETWORK.APP.Send(t);
}, 6e4);
}
},
UpdateAuth: function(t) {
if (cc.CORE.NETWORK.APP.IS_CONNECTED && void 0 !== t.status && t.status && void 0 !== t.user) {
cc.CORE.IS_LOGIN = !0;
cc.CORE.USER = t.user;
}
},
UpdateAuthDumplicate: function() {
r.removeItem("access_token");
r.removeItem("refresh_token");
cc.CORE.IS_LOGIN = !1;
cc.CORE.USER = {};
cc.CORE.NETWORK.APP.Connect();
cc.CORE.GAME_ROOM.clean();
r.removeItem("IN_GAME_ROOM");
void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo && clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
cc.director.loadScene("Lobby");
},
UpdateScene: function(t) {
cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN && cc.CORE.NETWORK.APP.Send({
event: "user",
data: {
scene: t
}
});
},
GetUserInfo: function() {
cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN && cc.CORE.NETWORK.APP.Send({
event: "user",
data: {
get_info: !0
}
});
},
GetCountNewInbox: function() {
cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN && cc.CORE.NETWORK.APP.Send({
event: "inbox",
data: {
check_new: !0
}
});
}
};
cc._RF.pop();
}, {
Config: "Config",
LocalStorage: "LocalStorage"
} ],
VisiblePassword: [ function(t, e) {
"use strict";
cc._RF.push(e, "68327XDh7NOurTs8NSY4rsx", "VisiblePassword");
cc.Class({
extends: cc.Component,
properties: {
spriteEyeOpen: cc.Node,
spriteEyeClose: cc.Node,
inputPwd: cc.EditBox
},
onLoad: function() {
this.isVisible = !1;
this.spriteEyeOpen.on(cc.Node.EventType.TOUCH_END, this.onEyeOpen, this);
this.spriteEyeClose.on(cc.Node.EventType.TOUCH_END, this.onEyeClose, this);
this.inputPwd.inputFlag = cc.EditBox.InputFlag.PASSWORD;
},
onEyeOpen: function() {
this.isVisible = !0;
this.spriteEyeOpen.active = !1;
this.spriteEyeClose.active = !0;
this.inputPwd.inputFlag = cc.EditBox.InputFlag.DEFAULT;
var t = this.inputPwd.string;
this.inputPwd.string = "";
this.inputPwd.string = t;
},
onEyeClose: function() {
this.isVisible = !1;
this.spriteEyeOpen.active = !0;
this.spriteEyeClose.active = !1;
this.inputPwd.inputFlag = cc.EditBox.InputFlag.PASSWORD;
var t = this.inputPwd.string;
this.inputPwd.string = "";
this.inputPwd.string = t;
}
});
cc._RF.pop();
}, {} ],
WebIframeHelper: [ function(t, e) {
"use strict";
cc._RF.push(e, "b293af1h7xCVKNGMcRawrnO", "WebIframeHelper");
var n = {
iframeId: "custom-webview",
createIframe: function(t, e) {
void 0 === t && (t = "");
void 0 === e && (e = 0);
if (!document.getElementById(this.iframeId)) {
var n = document.createElement("iframe");
n.id = this.iframeId;
n.src = t;
n.style.position = "absolute";
n.style.zIndex = e;
n.style.border = "none";
n.style.pointerEvents = "auto";
n.style.display = "block";
n.style.background = "transparent";
document.body.appendChild(n);
}
},
updateIframeToNode: function(t) {
if (t && cc.Camera.main) {
var e = t.convertToWorldSpaceAR(cc.v2(0, 0)), n = t.getContentSize(), r = cc.Camera.main.getWorldToScreenPoint(e), o = cc.view.getScaleX(), i = cc.view.getScaleY(), s = document.getElementById(this.iframeId);
if (s) {
s.style.left = r.x - n.width * o / 2 + "px";
s.style.top = r.y - n.height * i / 2 + "px";
s.style.width = n.width * o + "px";
s.style.height = n.height * i + "px";
}
}
},
showIframe: function() {
var t = document.getElementById(this.iframeId);
t && (t.style.display = "block");
},
hideIframe: function() {
var t = document.getElementById(this.iframeId);
t && (t.style.display = "none");
},
removeIframe: function() {
var t = document.getElementById(this.iframeId);
t && t.parentNode && t.parentNode.removeChild(t);
}
};
window.WebIframeHelper = n;
e.exports = n;
cc._RF.pop();
}, {} ],
ZoomScaleEffect: [ function(t, e) {
"use strict";
cc._RF.push(e, "14523kV85xIi6PKWI4Msyw+", "ZoomScaleEffect");
cc.Class({
extends: cc.Component,
properties: {
scaleFrom: .85,
scaleTo: 1.15,
scaleDuration: .15
},
onEnable: function() {
cc.tween(this.node).repeatForever(cc.tween().to(this.scaleDuration, {
scale: this.scaleFrom
}).to(this.scaleDuration, {
scale: this.scaleTo
})).start();
},
onDisable: function() {
this.node.scale = 1;
cc.Tween.stopAllByTarget(this.node);
}
});
cc._RF.pop();
}, {} ],
base64: [ function(t, e) {
"use strict";
cc._RF.push(e, "5de72yajLZBBZwN/6YufDtj", "base64");
(function() {
var t = {}, n = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "=" ], r = {
A: 0,
B: 1,
C: 2,
D: 3,
E: 4,
F: 5,
G: 6,
H: 7,
I: 8,
J: 9,
K: 10,
L: 11,
M: 12,
N: 13,
O: 14,
P: 15,
Q: 16,
R: 17,
S: 18,
T: 19,
U: 20,
V: 21,
W: 22,
X: 23,
Y: 24,
Z: 25,
a: 26,
b: 27,
c: 28,
d: 29,
e: 30,
f: 31,
g: 32,
h: 33,
i: 34,
j: 35,
k: 36,
l: 37,
m: 38,
n: 39,
o: 40,
p: 41,
q: 42,
r: 43,
s: 44,
t: 45,
u: 46,
v: 47,
w: 48,
x: 49,
y: 50,
z: 51,
0: 52,
1: 53,
2: 54,
3: 55,
4: 56,
5: 57,
6: 58,
7: 59,
8: 60,
9: 61,
"+": 62,
"/": 63
};
t.encode = window.btoa ? function(t) {
return window.btoa(unescape(encodeURIComponent(t)));
} : function(t) {
var e, r, o, i, s, a, c, u, f = 0, l = 0, h = [];
e = (t = unescape(encodeURIComponent(t))).length;
for (;f < e; ) {
s = (r = t.charCodeAt(f++) || 0) >> 2 & 63;
a = (3 & r) << 4 | (o = t.charCodeAt(f++) || 0) >> 4 & 15;
c = (15 & o) << 2 | (i = t.charCodeAt(f++) || 0) >> 6 & 3;
u = 63 & i;
if (!i) {
u = 64;
o || (c = 64);
}
h[l++] = n[s];
h[l++] = n[a];
h[l++] = n[c];
h[l++] = n[u];
}
return h.join("");
};
t.decode = window.atob ? function(t) {
return decodeURIComponent(escape(window.atob(t)));
} : function(t) {
var e, n, o, i, s, a, c = 0, u = 0, f = [];
e = (t = t.replace(/\=+$/, "").split("")).length;
for (;c < e; ) {
i = (63 & (r[t[c++]] || "")) << 2 | (n = r[t[c++]] || "") >> 4 & 3;
s = (15 & n) << 4 | (o = r[t[c++]] || "") >> 2 & 15;
a = (3 & o) << 6 | 63 & (r[t[c++]] || "");
f[u++] = String.fromCharCode(i);
if (s) {
f[u++] = String.fromCharCode(s);
a && (f[u++] = String.fromCharCode(a));
}
}
return decodeURIComponent(escape(f.join("")));
};
t.encodeSafe = function(e) {
return t.encode(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, ".");
};
t.decodeSafe = function(e) {
return t.decode(e.replace(/-/g, "+").replace(/_/g, "/").replace(/\./g, "="));
};
"object" == typeof lego && lego.define ? lego.define("base64", [], function(e, n, r) {
r.exports = t;
}) : "object" == typeof e && e.exports ? e.exports = t : window.base64 = t;
})();
cc._RF.pop();
}, {} ],
cQRCode: [ function(t, e) {
"use strict";
cc._RF.push(e, "c5f6f3RCFxKx6qIgr0M/2Mw", "cQRCode");
function n(t) {
this.mode = o.MODE_8BIT_BYTE;
this.data = t;
}
n.prototype = {
getLength: function() {
return this.data.length;
},
write: function(t) {
for (var e = 0; e < this.data.length; e++) t.put(this.data.charCodeAt(e), 8);
}
};
var r = function(t, e) {
this.typeNumber = t;
this.errorCorrectLevel = e;
this.modules = null;
this.moduleCount = 0;
this.dataCache = null;
this.dataList = new Array();
};
r.prototype = {
addData: function(t) {
var e = new n(t);
this.dataList.push(e);
this.dataCache = null;
},
isDark: function(t, e) {
if (t < 0 || this.moduleCount <= t || e < 0 || this.moduleCount <= e) throw new Error(t + "," + e);
return this.modules[t][e];
},
getModuleCount: function() {
return this.moduleCount;
},
make: function() {
if (this.typeNumber < 1) {
var t = 1;
for (t = 1; t < 40; t++) {
for (var e = l.getRSBlocks(t, this.errorCorrectLevel), n = new h(), r = 0, o = 0; o < e.length; o++) r += e[o].dataCount;
for (var s = 0; s < this.dataList.length; s++) {
var a = this.dataList[s];
n.put(a.mode, 4);
n.put(a.getLength(), i.getLengthInBits(a.mode, t));
a.write(n);
}
if (n.getLengthInBits() <= 8 * r) break;
}
this.typeNumber = t;
}
this.makeImpl(!1, this.getBestMaskPattern());
},
makeImpl: function(t, e) {
this.moduleCount = 4 * this.typeNumber + 17;
this.modules = new Array(this.moduleCount);
for (var n = 0; n < this.moduleCount; n++) {
this.modules[n] = new Array(this.moduleCount);
for (var o = 0; o < this.moduleCount; o++) this.modules[n][o] = null;
}
this.setupPositionProbePattern(0, 0);
this.setupPositionProbePattern(this.moduleCount - 7, 0);
this.setupPositionProbePattern(0, this.moduleCount - 7);
this.setupPositionAdjustPattern();
this.setupTimingPattern();
this.setupTypeInfo(t, e);
this.typeNumber >= 7 && this.setupTypeNumber(t);
null == this.dataCache && (this.dataCache = r.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
this.mapData(this.dataCache, e);
},
setupPositionProbePattern: function(t, e) {
for (var n = -1; n <= 7; n++) if (!(t + n <= -1 || this.moduleCount <= t + n)) for (var r = -1; r <= 7; r++) e + r <= -1 || this.moduleCount <= e + r || (this.modules[t + n][e + r] = 0 <= n && n <= 6 && (0 == r || 6 == r) || 0 <= r && r <= 6 && (0 == n || 6 == n) || 2 <= n && n <= 4 && 2 <= r && r <= 4);
},
getBestMaskPattern: function() {
for (var t = 0, e = 0, n = 0; n < 8; n++) {
this.makeImpl(!0, n);
var r = i.getLostPoint(this);
if (0 == n || t > r) {
t = r;
e = n;
}
}
return e;
},
createMovieClip: function(t, e, n) {
var r = t.createEmptyMovieClip(e, n);
this.make();
for (var o = 0; o < this.modules.length; o++) for (var i = 1 * o, s = 0; s < this.modules[o].length; s++) {
var a = 1 * s;
if (this.modules[o][s]) {
r.beginFill(0, 100);
r.moveTo(a, i);
r.lineTo(a + 1, i);
r.lineTo(a + 1, i + 1);
r.lineTo(a, i + 1);
r.endFill();
}
}
return r;
},
setupTimingPattern: function() {
for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[t][6] && (this.modules[t][6] = t % 2 == 0);
for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[6][e] && (this.modules[6][e] = e % 2 == 0);
},
setupPositionAdjustPattern: function() {
for (var t = i.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++) for (var n = 0; n < t.length; n++) {
var r = t[e], o = t[n];
if (null == this.modules[r][o]) for (var s = -2; s <= 2; s++) for (var a = -2; a <= 2; a++) this.modules[r + s][o + a] = -2 == s || 2 == s || -2 == a || 2 == a || 0 == s && 0 == a;
}
},
setupTypeNumber: function(t) {
for (var e = i.getBCHTypeNumber(this.typeNumber), n = 0; n < 18; n++) {
var r = !t && 1 == (e >> n & 1);
this.modules[Math.floor(n / 3)][n % 3 + this.moduleCount - 8 - 3] = r;
}
for (var o = 0; o < 18; o++) {
var s = !t && 1 == (e >> o & 1);
this.modules[o % 3 + this.moduleCount - 8 - 3][Math.floor(o / 3)] = s;
}
},
setupTypeInfo: function(t, e) {
for (var n = this.errorCorrectLevel << 3 | e, r = i.getBCHTypeInfo(n), o = 0; o < 15; o++) {
var s = !t && 1 == (r >> o & 1);
o < 6 ? this.modules[o][8] = s : o < 8 ? this.modules[o + 1][8] = s : this.modules[this.moduleCount - 15 + o][8] = s;
}
for (var a = 0; a < 15; a++) {
var c = !t && 1 == (r >> a & 1);
a < 8 ? this.modules[8][this.moduleCount - a - 1] = c : a < 9 ? this.modules[8][15 - a - 1 + 1] = c : this.modules[8][15 - a - 1] = c;
}
this.modules[this.moduleCount - 8][8] = !t;
},
mapData: function(t, e) {
for (var n = -1, r = this.moduleCount - 1, o = 7, s = 0, a = this.moduleCount - 1; a > 0; a -= 2) {
6 == a && a--;
for (;;) {
for (var c = 0; c < 2; c++) if (null == this.modules[r][a - c]) {
var u = !1;
s < t.length && (u = 1 == (t[s] >>> o & 1));
i.getMask(e, r, a - c) && (u = !u);
this.modules[r][a - c] = u;
if (-1 == --o) {
s++;
o = 7;
}
}
if ((r += n) < 0 || this.moduleCount <= r) {
r -= n;
n = -n;
break;
}
}
}
}
};
r.PAD0 = 236;
r.PAD1 = 17;
r.createData = function(t, e, n) {
for (var o = l.getRSBlocks(t, e), s = new h(), a = 0; a < n.length; a++) {
var c = n[a];
s.put(c.mode, 4);
s.put(c.getLength(), i.getLengthInBits(c.mode, t));
c.write(s);
}
for (var u = 0, f = 0; f < o.length; f++) u += o[f].dataCount;
if (s.getLengthInBits() > 8 * u) throw new Error("code length overflow. (" + s.getLengthInBits() + ">" + 8 * u + ")");
s.getLengthInBits() + 4 <= 8 * u && s.put(0, 4);
for (;s.getLengthInBits() % 8 != 0; ) s.putBit(!1);
for (;!(s.getLengthInBits() >= 8 * u); ) {
s.put(r.PAD0, 8);
if (s.getLengthInBits() >= 8 * u) break;
s.put(r.PAD1, 8);
}
return r.createBytes(s, o);
};
r.createBytes = function(t, e) {
for (var n = 0, r = 0, o = 0, s = new Array(e.length), a = new Array(e.length), c = 0; c < e.length; c++) {
var u = e[c].dataCount, l = e[c].totalCount - u;
r = Math.max(r, u);
o = Math.max(o, l);
s[c] = new Array(u);
for (var h = 0; h < s[c].length; h++) s[c][h] = 255 & t.buffer[h + n];
n += u;
var d = i.getErrorCorrectPolynomial(l), p = new f(s[c], d.getLength() - 1).mod(d);
a[c] = new Array(d.getLength() - 1);
for (var g = 0; g < a[c].length; g++) {
var v = g + p.getLength() - a[c].length;
a[c][g] = v >= 0 ? p.get(v) : 0;
}
}
for (var y = 0, m = 0; m < e.length; m++) y += e[m].totalCount;
for (var E = new Array(y), b = 0, w = 0; w < r; w++) for (var C = 0; C < e.length; C++) w < s[C].length && (E[b++] = s[C][w]);
for (var S = 0; S < o; S++) for (var _ = 0; _ < e.length; _++) S < a[_].length && (E[b++] = a[_][S]);
return E;
};
for (var o = {
MODE_NUMBER: 1,
MODE_ALPHA_NUM: 2,
MODE_8BIT_BYTE: 4,
MODE_KANJI: 8
}, i = {
PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
G15: 1335,
G18: 7973,
G15_MASK: 21522,
getBCHTypeInfo: function(t) {
for (var e = t << 10; i.getBCHDigit(e) - i.getBCHDigit(i.G15) >= 0; ) e ^= i.G15 << i.getBCHDigit(e) - i.getBCHDigit(i.G15);
return (t << 10 | e) ^ i.G15_MASK;
},
getBCHTypeNumber: function(t) {
for (var e = t << 12; i.getBCHDigit(e) - i.getBCHDigit(i.G18) >= 0; ) e ^= i.G18 << i.getBCHDigit(e) - i.getBCHDigit(i.G18);
return t << 12 | e;
},
getBCHDigit: function(t) {
for (var e = 0; 0 != t; ) {
e++;
t >>>= 1;
}
return e;
},
getPatternPosition: function(t) {
return i.PATTERN_POSITION_TABLE[t - 1];
},
getMask: function(t, e, n) {
switch (t) {
case 0:
return (e + n) % 2 == 0;

case 1:
return e % 2 == 0;

case 2:
return n % 3 == 0;

case 3:
return (e + n) % 3 == 0;

case 4:
return (Math.floor(e / 2) + Math.floor(n / 3)) % 2 == 0;

case 5:
return e * n % 2 + e * n % 3 == 0;

case 6:
return (e * n % 2 + e * n % 3) % 2 == 0;

case 7:
return (e * n % 3 + (e + n) % 2) % 2 == 0;

default:
throw new Error("bad maskPattern:" + t);
}
},
getErrorCorrectPolynomial: function(t) {
for (var e = new f([ 1 ], 0), n = 0; n < t; n++) e = e.multiply(new f([ 1, s.gexp(n) ], 0));
return e;
},
getLengthInBits: function(t, e) {
if (1 <= e && e < 10) switch (t) {
case o.MODE_NUMBER:
return 10;

case o.MODE_ALPHA_NUM:
return 9;

case o.MODE_8BIT_BYTE:
case o.MODE_KANJI:
return 8;

default:
throw new Error("mode:" + t);
} else if (e < 27) switch (t) {
case o.MODE_NUMBER:
return 12;

case o.MODE_ALPHA_NUM:
return 11;

case o.MODE_8BIT_BYTE:
return 16;

case o.MODE_KANJI:
return 10;

default:
throw new Error("mode:" + t);
} else {
if (!(e < 41)) throw new Error("type:" + e);
switch (t) {
case o.MODE_NUMBER:
return 14;

case o.MODE_ALPHA_NUM:
return 13;

case o.MODE_8BIT_BYTE:
return 16;

case o.MODE_KANJI:
return 12;

default:
throw new Error("mode:" + t);
}
}
},
getLostPoint: function(t) {
for (var e = t.getModuleCount(), n = 0, r = 0; r < e; r++) for (var o = 0; o < e; o++) {
for (var i = 0, s = t.isDark(r, o), a = -1; a <= 1; a++) if (!(r + a < 0 || e <= r + a)) for (var c = -1; c <= 1; c++) o + c < 0 || e <= o + c || 0 == a && 0 == c || s == t.isDark(r + a, o + c) && i++;
i > 5 && (n += 3 + i - 5);
}
for (var u = 0; u < e - 1; u++) for (var f = 0; f < e - 1; f++) {
var l = 0;
t.isDark(u, f) && l++;
t.isDark(u + 1, f) && l++;
t.isDark(u, f + 1) && l++;
t.isDark(u + 1, f + 1) && l++;
0 != l && 4 != l || (n += 3);
}
for (var h = 0; h < e; h++) for (var d = 0; d < e - 6; d++) t.isDark(h, d) && !t.isDark(h, d + 1) && t.isDark(h, d + 2) && t.isDark(h, d + 3) && t.isDark(h, d + 4) && !t.isDark(h, d + 5) && t.isDark(h, d + 6) && (n += 40);
for (var p = 0; p < e; p++) for (var g = 0; g < e - 6; g++) t.isDark(g, p) && !t.isDark(g + 1, p) && t.isDark(g + 2, p) && t.isDark(g + 3, p) && t.isDark(g + 4, p) && !t.isDark(g + 5, p) && t.isDark(g + 6, p) && (n += 40);
for (var v = 0, y = 0; y < e; y++) for (var m = 0; m < e; m++) t.isDark(m, y) && v++;
return n + Math.abs(100 * v / e / e - 50) / 5 * 10;
}
}, s = {
glog: function(t) {
if (t < 1) throw new Error("glog(" + t + ")");
return s.LOG_TABLE[t];
},
gexp: function(t) {
for (;t < 0; ) t += 255;
for (;t >= 256; ) t -= 255;
return s.EXP_TABLE[t];
},
EXP_TABLE: new Array(256),
LOG_TABLE: new Array(256)
}, a = 0; a < 8; a++) s.EXP_TABLE[a] = 1 << a;
for (var c = 8; c < 256; c++) s.EXP_TABLE[c] = s.EXP_TABLE[c - 4] ^ s.EXP_TABLE[c - 5] ^ s.EXP_TABLE[c - 6] ^ s.EXP_TABLE[c - 8];
for (var u = 0; u < 255; u++) s.LOG_TABLE[s.EXP_TABLE[u]] = u;
function f(t, e) {
if (null == t.length) throw new Error(t.length + "/" + e);
for (var n = 0; n < t.length && 0 == t[n]; ) n++;
this.num = new Array(t.length - n + e);
for (var r = 0; r < t.length - n; r++) this.num[r] = t[r + n];
}
f.prototype = {
get: function(t) {
return this.num[t];
},
getLength: function() {
return this.num.length;
},
multiply: function(t) {
for (var e = new Array(this.getLength() + t.getLength() - 1), n = 0; n < this.getLength(); n++) for (var r = 0; r < t.getLength(); r++) e[n + r] ^= s.gexp(s.glog(this.get(n)) + s.glog(t.get(r)));
return new f(e, 0);
},
mod: function(t) {
if (this.getLength() - t.getLength() < 0) return this;
for (var e = s.glog(this.get(0)) - s.glog(t.get(0)), n = new Array(this.getLength()), r = 0; r < this.getLength(); r++) n[r] = this.get(r);
for (var o = 0; o < t.getLength(); o++) n[o] ^= s.gexp(s.glog(t.get(o)) + e);
return new f(n, 0).mod(t);
}
};
function l(t, e) {
this.totalCount = t;
this.dataCount = e;
}
l.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ];
l.getRSBlocks = function(t, e) {
var n = l.getRsBlockTable(t, e);
if (null == n) throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + e);
for (var r = n.length / 3, o = new Array(), i = 0; i < r; i++) for (var s = n[3 * i + 0], a = n[3 * i + 1], c = n[3 * i + 2], u = 0; u < s; u++) o.push(new l(a, c));
return o;
};
l.getRsBlockTable = function(t, e) {
switch (e) {
case 1:
return l.RS_BLOCK_TABLE[4 * (t - 1) + 0];

case 0:
return l.RS_BLOCK_TABLE[4 * (t - 1) + 1];

case 3:
return l.RS_BLOCK_TABLE[4 * (t - 1) + 2];

case 2:
return l.RS_BLOCK_TABLE[4 * (t - 1) + 3];

default:
return;
}
};
function h() {
this.buffer = new Array();
this.length = 0;
}
h.prototype = {
get: function(t) {
var e = Math.floor(t / 8);
return 1 == (this.buffer[e] >>> 7 - t % 8 & 1);
},
put: function(t, e) {
for (var n = 0; n < e; n++) this.putBit(1 == (t >>> e - n - 1 & 1));
},
getLengthInBits: function() {
return this.length;
},
putBit: function(t) {
var e = Math.floor(this.length / 8);
this.buffer.length <= e && this.buffer.push(0);
t && (this.buffer[e] |= 128 >>> this.length % 8);
this.length++;
}
};
var d = cc.Class({
extends: cc.Graphics,
properties: {
string: {
default: "Hello World!",
notify: function(t) {
this.string !== t && this.setContent();
}
},
backColor: {
type: cc.Color,
default: cc.Color.WHITE,
notify: function() {
this.setContent();
}
},
foreColor: {
type: cc.Color,
default: cc.Color.BLACK,
notify: function() {
this.node.color = this.foreColor;
this.setContent();
}
},
margin: {
type: cc.Float,
default: 10,
notify: function(t) {
t !== this.margin && this.setContent();
}
},
_size: 200,
size: {
type: cc.Float,
get: function() {
return this._size;
},
set: function(t) {
if (this._size !== t) {
this.node.setContentSize(t, t);
this.setContent();
this._size = t;
}
}
}
},
onLoad: function() {
this.node.setContentSize(this._size, this._size);
this.setContent();
},
setContent: function() {
this.clear();
this.fillColor = this.backColor;
var t = this.node.width, e = -t * this.node.anchorX, n = -t * this.node.anchorY;
this.rect(e, n, t, t);
this.fill();
this.close();
var o = new r(-1, 2);
o.addData(this.string);
o.make();
this.fillColor = this.foreColor;
for (var i = t - 2 * this.margin, s = o.getModuleCount(), a = i / s, c = i / s, u = Math.ceil(a), f = Math.ceil(c), l = 0; l < s; l++) for (var h = 0; h < s; h++) if (o.isDark(l, h)) {
this.rect(e + this.margin + h * a, e + i - c - Math.round(l * c) + this.margin, u, f);
this.fill();
}
}
});
cc.Class.Attr.setClassAttr(d, "lineWidth", "visible", !1);
cc.Class.Attr.setClassAttr(d, "lineJoin", "visible", !1);
cc.Class.Attr.setClassAttr(d, "lineCap", "visible", !1);
cc.Class.Attr.setClassAttr(d, "strokeColor", "visible", !1);
cc.Class.Attr.setClassAttr(d, "miterLimit", "visible", !1);
cc.Class.Attr.setClassAttr(d, "fillColor", "visible", !1);
e.exports = d;
cc._RF.pop();
}, {} ],
hoverScale: [ function(t, e) {
"use strict";
cc._RF.push(e, "c0176qMVDJMr5SXgW+MVmTO", "hoverScale");
cc.Class({
extends: cc.Component,
properties: {
pressedScale: 1,
transDuration: 0
},
onLoad: function() {
this.initScale = this.node.scale;
this.scaleOnAction = cc.scaleTo(this.transDuration, this.pressedScale);
this.scaleOffAction = cc.scaleTo(this.transDuration, this.initScale);
},
onEnable: function() {
this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
},
onDisable: function() {
this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnHover, this);
this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOffHover, this);
},
eventOnHover: function() {
this.node.stopAllActions();
this.node.runAction(this.scaleOnAction);
},
eventOffHover: function() {
this.node.stopAllActions();
this.node.runAction(this.scaleOffAction);
}
});
cc._RF.pop();
}, {} ],
md5: [ function(t, e) {
"use strict";
cc._RF.push(e, "9854cG6LeNPyK9mFHTRIwRM", "md5");
(function() {
function t(t, e) {
var n = (65535 & t) + (65535 & e);
return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n;
}
function n(e, n, r, o, i, s) {
e = t(t(n, e), t(o, s));
return t(e << i | e >>> 32 - i, r);
}
function r(t, e, r, o, i, s, a) {
return n(e & r | ~e & o, t, e, i, s, a);
}
function o(t, e, r, o, i, s, a) {
return n(e & o | r & ~o, t, e, i, s, a);
}
function i(t, e, r, o, i, s, a) {
return n(r ^ (e | ~o), t, e, i, s, a);
}
function s(e, s) {
e[s >> 5] |= 128 << s % 32;
e[14 + (s + 64 >>> 9 << 4)] = s;
var a, c, u, f, l, h = 1732584193, d = -271733879, p = -1732584194, g = 271733878;
for (a = 0; a < e.length; a += 16) c = h, u = d, f = p, l = g, h = r(h, d, p, g, e[a], 7, -680876936), 
g = r(g, h, d, p, e[a + 1], 12, -389564586), p = r(p, g, h, d, e[a + 2], 17, 606105819), 
d = r(d, p, g, h, e[a + 3], 22, -1044525330), h = r(h, d, p, g, e[a + 4], 7, -176418897), 
g = r(g, h, d, p, e[a + 5], 12, 1200080426), p = r(p, g, h, d, e[a + 6], 17, -1473231341), 
d = r(d, p, g, h, e[a + 7], 22, -45705983), h = r(h, d, p, g, e[a + 8], 7, 1770035416), 
g = r(g, h, d, p, e[a + 9], 12, -1958414417), p = r(p, g, h, d, e[a + 10], 17, -42063), 
d = r(d, p, g, h, e[a + 11], 22, -1990404162), h = r(h, d, p, g, e[a + 12], 7, 1804603682), 
g = r(g, h, d, p, e[a + 13], 12, -40341101), p = r(p, g, h, d, e[a + 14], 17, -1502002290), 
h = o(h, d = r(d, p, g, h, e[a + 15], 22, 1236535329), p, g, e[a + 1], 5, -165796510), 
g = o(g, h, d, p, e[a + 6], 9, -1069501632), p = o(p, g, h, d, e[a + 11], 14, 643717713), 
d = o(d, p, g, h, e[a], 20, -373897302), h = o(h, d, p, g, e[a + 5], 5, -701558691), 
g = o(g, h, d, p, e[a + 10], 9, 38016083), p = o(p, g, h, d, e[a + 15], 14, -660478335), 
d = o(d, p, g, h, e[a + 4], 20, -405537848), h = o(h, d, p, g, e[a + 9], 5, 568446438), 
g = o(g, h, d, p, e[a + 14], 9, -1019803690), p = o(p, g, h, d, e[a + 3], 14, -187363961), 
d = o(d, p, g, h, e[a + 8], 20, 1163531501), h = o(h, d, p, g, e[a + 13], 5, -1444681467), 
g = o(g, h, d, p, e[a + 2], 9, -51403784), p = o(p, g, h, d, e[a + 7], 14, 1735328473), 
h = n((d = o(d, p, g, h, e[a + 12], 20, -1926607734)) ^ p ^ g, h, d, e[a + 5], 4, -378558), 
g = n(h ^ d ^ p, g, h, e[a + 8], 11, -2022574463), p = n(g ^ h ^ d, p, g, e[a + 11], 16, 1839030562), 
d = n(p ^ g ^ h, d, p, e[a + 14], 23, -35309556), h = n(d ^ p ^ g, h, d, e[a + 1], 4, -1530992060), 
g = n(h ^ d ^ p, g, h, e[a + 4], 11, 1272893353), p = n(g ^ h ^ d, p, g, e[a + 7], 16, -155497632), 
d = n(p ^ g ^ h, d, p, e[a + 10], 23, -1094730640), h = n(d ^ p ^ g, h, d, e[a + 13], 4, 681279174), 
g = n(h ^ d ^ p, g, h, e[a], 11, -358537222), p = n(g ^ h ^ d, p, g, e[a + 3], 16, -722521979), 
d = n(p ^ g ^ h, d, p, e[a + 6], 23, 76029189), h = n(d ^ p ^ g, h, d, e[a + 9], 4, -640364487), 
g = n(h ^ d ^ p, g, h, e[a + 12], 11, -421815835), p = n(g ^ h ^ d, p, g, e[a + 15], 16, 530742520), 
h = i(h, d = n(p ^ g ^ h, d, p, e[a + 2], 23, -995338651), p, g, e[a], 6, -198630844), 
g = i(g, h, d, p, e[a + 7], 10, 1126891415), p = i(p, g, h, d, e[a + 14], 15, -1416354905), 
d = i(d, p, g, h, e[a + 5], 21, -57434055), h = i(h, d, p, g, e[a + 12], 6, 1700485571), 
g = i(g, h, d, p, e[a + 3], 10, -1894986606), p = i(p, g, h, d, e[a + 10], 15, -1051523), 
d = i(d, p, g, h, e[a + 1], 21, -2054922799), h = i(h, d, p, g, e[a + 8], 6, 1873313359), 
g = i(g, h, d, p, e[a + 15], 10, -30611744), p = i(p, g, h, d, e[a + 6], 15, -1560198380), 
d = i(d, p, g, h, e[a + 13], 21, 1309151649), h = i(h, d, p, g, e[a + 4], 6, -145523070), 
g = i(g, h, d, p, e[a + 11], 10, -1120210379), p = i(p, g, h, d, e[a + 2], 15, 718787259), 
d = i(d, p, g, h, e[a + 9], 21, -343485551), h = t(h, c), d = t(d, u), p = t(p, f), 
g = t(g, l);
return [ h, d, p, g ];
}
function a(t) {
var e, n = "", r = 32 * t.length;
for (e = 0; e < r; e += 8) n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
return n;
}
function c(t) {
var e, n = [];
n[(t.length >> 2) - 1] = void 0;
for (e = 0; e < n.length; e += 1) n[e] = 0;
var r = 8 * t.length;
for (e = 0; e < r; e += 8) n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
return n;
}
function u(t) {
return a(s(c(t), 8 * t.length));
}
function f(t, e) {
var n, r = c(t), o = [], i = [];
o[15] = i[15] = void 0;
16 < r.length && (r = s(r, 8 * t.length));
for (n = 0; 16 > n; n += 1) o[n] = 909522486 ^ r[n], i[n] = 1549556828 ^ r[n];
n = s(o.concat(c(e)), 512 + 8 * e.length);
return a(s(i.concat(n), 640));
}
function l(t) {
var e, n, r = "";
for (n = 0; n < t.length; n += 1) e = t.charCodeAt(n), r += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(15 & e);
return r;
}
function h(t, e, n) {
return t = e ? n ? f(unescape(encodeURIComponent(e)), unescape(encodeURIComponent(t))) : l(t = f(unescape(encodeURIComponent(e)), unescape(encodeURIComponent(t)))) : n ? u(unescape(encodeURIComponent(t))) : l(u(unescape(encodeURIComponent(t))));
}
"function" == typeof define && define.amd ? define(function() {
return h;
}) : "object" == typeof e && e.exports ? e.exports = h : (void 0).md5 = h;
})();
cc._RF.pop();
}, {} ],
msgpack: [ function(t, e, n) {
(function(r) {
"use strict";
cc._RF.push(e, "9eee79hbrNEnppHm0Hv6d8R", "msgpack");
!function(t) {
"object" == typeof n && "undefined" != typeof e ? e.exports = t() : "function" == typeof define && define.amd ? define([], t) : ("undefined" != typeof window ? window : "undefined" != typeof r ? r : "undefined" != typeof self ? self : this).msgpack = t();
}(function() {
return function e(n, r, o) {
function i(a, c) {
if (!r[a]) {
if (!n[a]) {
var u = "function" == typeof t && t;
if (!c && u) return u(a, !0);
if (s) return s(a, !0);
var f = new Error("Cannot find module '" + a + "'");
throw f.code = "MODULE_NOT_FOUND", f;
}
var l = r[a] = {
exports: {}
};
n[a][0].call(l.exports, function(t) {
return i(n[a][1][t] || t);
}, l, l.exports, e, n, r, o);
}
return r[a].exports;
}
for (var s = "function" == typeof t && t, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
1: [ function(t, e, n) {
n.encode = t("./encode").encode, n.decode = t("./decode").decode, n.Encoder = t("./encoder").Encoder, 
n.Decoder = t("./decoder").Decoder, n.createCodec = t("./ext").createCodec, n.codec = t("./codec").codec;
}, {
"./codec": 10,
"./decode": 12,
"./decoder": 13,
"./encode": 15,
"./encoder": 16,
"./ext": 20
} ],
2: [ function(t, e) {
(function(t) {
function n(t) {
return t && t.isBuffer && t;
}
e.exports = n("undefined" != typeof t && t) || n(this.Buffer) || n("undefined" != typeof window && window.Buffer) || this.Buffer;
}).call(this, t("buffer").Buffer);
}, {
buffer: 29
} ],
3: [ function(t, e, n) {
n.copy = function(t, e, n, r) {
var o;
n || (n = 0), r || 0 === r || (r = this.length), e || (e = 0);
var i = r - n;
if (t === this && n < e && e < r) for (o = i - 1; o >= 0; o--) t[o + e] = this[o + n]; else for (o = 0; o < i; o++) t[o + e] = this[o + n];
return i;
}, n.toString = function(t, e, n) {
var r = this, o = 0 | e;
n || (n = r.length);
for (var i = "", s = 0; o < n; ) (s = r[o++]) < 128 ? i += String.fromCharCode(s) : (192 == (224 & s) ? s = (31 & s) << 6 | 63 & r[o++] : 224 == (240 & s) ? s = (15 & s) << 12 | (63 & r[o++]) << 6 | 63 & r[o++] : 240 == (248 & s) && (s = (7 & s) << 18 | (63 & r[o++]) << 12 | (63 & r[o++]) << 6 | 63 & r[o++]), 
s >= 65536 ? (s -= 65536, i += String.fromCharCode(55296 + (s >>> 10), 56320 + (1023 & s))) : i += String.fromCharCode(s));
return i;
}, n.write = function(t, e) {
for (var n = this, r = e || (e |= 0), o = t.length, i = 0, s = 0; s < o; ) (i = t.charCodeAt(s++)) < 128 ? n[r++] = i : i < 2048 ? (n[r++] = 192 | i >>> 6, 
n[r++] = 128 | 63 & i) : i < 55296 || i > 57343 ? (n[r++] = 224 | i >>> 12, n[r++] = 128 | i >>> 6 & 63, 
n[r++] = 128 | 63 & i) : (i = 65536 + (i - 55296 << 10 | t.charCodeAt(s++) - 56320), 
n[r++] = 240 | i >>> 18, n[r++] = 128 | i >>> 12 & 63, n[r++] = 128 | i >>> 6 & 63, 
n[r++] = 128 | 63 & i);
return r - e;
};
}, {} ],
4: [ function(t, e, n) {
function r(t) {
return new Array(t);
}
var o = t("./bufferish");
(n = e.exports = r(0)).alloc = r, n.concat = o.concat, n.from = function(t) {
if (!o.isBuffer(t) && o.isView(t)) t = o.Uint8Array.from(t); else if (o.isArrayBuffer(t)) t = new Uint8Array(t); else {
if ("string" == typeof t) return o.from.call(n, t);
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
}
return Array.prototype.slice.call(t);
};
}, {
"./bufferish": 8
} ],
5: [ function(t, e, n) {
function r(t) {
return new i(t);
}
var o = t("./bufferish"), i = o.global;
(n = e.exports = o.hasBuffer ? r(0) : []).alloc = o.hasBuffer && i.alloc || r, n.concat = o.concat, 
n.from = function(t) {
if (!o.isBuffer(t) && o.isView(t)) t = o.Uint8Array.from(t); else if (o.isArrayBuffer(t)) t = new Uint8Array(t); else {
if ("string" == typeof t) return o.from.call(n, t);
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
}
return i.from && 1 !== i.from.length ? i.from(t) : new i(t);
};
}, {
"./bufferish": 8
} ],
6: [ function(t, e, n) {
function r(t, e, n, r) {
var a = s.isBuffer(this), c = s.isBuffer(t);
if (a && c) return this.copy(t, e, n, r);
if (u || a || c || !s.isView(this) || !s.isView(t)) return i.copy.call(this, t, e, n, r);
var f = n || null != r ? o.call(this, n, r) : this;
return t.set(f, e), f.length;
}
function o(t, e) {
var n = this.slice || !u && this.subarray;
if (n) return n.call(this, t, e);
var o = s.alloc.call(this, e - t);
return r.call(this, o, 0, t, e), o;
}
var i = t("./buffer-lite");
n.copy = r, n.slice = o, n.toString = function(t, e, n) {
return (!c && s.isBuffer(this) ? this.toString : i.toString).apply(this, arguments);
}, n.write = function(t) {
return function() {
return (this[t] || i[t]).apply(this, arguments);
};
}("write");
var s = t("./bufferish"), a = s.global, c = s.hasBuffer && "TYPED_ARRAY_SUPPORT" in a, u = c && !a.TYPED_ARRAY_SUPPORT;
}, {
"./buffer-lite": 3,
"./bufferish": 8
} ],
7: [ function(t, e, n) {
function r(t) {
return new Uint8Array(t);
}
var o = t("./bufferish");
(n = e.exports = o.hasArrayBuffer ? r(0) : []).alloc = r, n.concat = o.concat, n.from = function(t) {
if (o.isView(t)) {
var e = t.byteOffset, r = t.byteLength;
(t = t.buffer).byteLength !== r && (t.slice ? t = t.slice(e, e + r) : (t = new Uint8Array(t)).byteLength !== r && (t = Array.prototype.slice.call(t, e, e + r)));
} else {
if ("string" == typeof t) return o.from.call(n, t);
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
}
return new Uint8Array(t);
};
}, {
"./bufferish": 8
} ],
8: [ function(t, e, n) {
function r(t) {
return i(this).alloc(t);
}
function o(t) {
var e = 3 * t.length, n = r.call(this, e), o = y.write.call(n, t);
return e !== o && (n = y.slice.call(n, 0, o)), n;
}
function i(t) {
return h(t) ? g : d(t) ? v : l(t) ? p : u ? g : f ? v : p;
}
function s() {
return !1;
}
function a(t, e) {
return t = "[object " + t + "]", function(n) {
return null != n && {}.toString.call(e ? n[e] : n) === t;
};
}
var c = n.global = t("./buffer-global"), u = n.hasBuffer = c && !!c.isBuffer, f = n.hasArrayBuffer = "undefined" != typeof ArrayBuffer, l = n.isArray = t("isarray");
n.isArrayBuffer = f ? function(t) {
return t instanceof ArrayBuffer || m(t);
} : s;
var h = n.isBuffer = u ? c.isBuffer : s, d = n.isView = f ? ArrayBuffer.isView || a("ArrayBuffer", "buffer") : s;
n.alloc = r, n.concat = function(t, e) {
e || (e = 0, Array.prototype.forEach.call(t, function(t) {
e += t.length;
}));
var o = this !== n && this || t[0], i = r.call(o, e), s = 0;
return Array.prototype.forEach.call(t, function(t) {
s += y.copy.call(t, i, s);
}), i;
}, n.from = function(t) {
return "string" == typeof t ? o.call(this, t) : i(this).from(t);
};
var p = n.Array = t("./bufferish-array"), g = n.Buffer = t("./bufferish-buffer"), v = n.Uint8Array = t("./bufferish-uint8array"), y = n.prototype = t("./bufferish-proto"), m = a("ArrayBuffer");
}, {
"./buffer-global": 2,
"./bufferish-array": 4,
"./bufferish-buffer": 5,
"./bufferish-proto": 6,
"./bufferish-uint8array": 7,
isarray: 34
} ],
9: [ function(t, e, n) {
function r(t) {
return this instanceof r ? (this.options = t, void this.init()) : new r(t);
}
function o(t, e) {
return t && e ? function() {
return t.apply(this, arguments), e.apply(this, arguments);
} : t || e;
}
function i(t) {
function e(t, e) {
return e(t);
}
return t = t.slice(), function(n) {
return t.reduce(e, n);
};
}
function s(t) {
return new r(t);
}
var a = t("isarray");
n.createCodec = s, n.install = function(t) {
for (var e in t) r.prototype[e] = o(r.prototype[e], t[e]);
}, n.filter = function(t) {
return a(t) ? i(t) : t;
};
var c = t("./bufferish");
r.prototype.init = function() {
var t = this.options;
return t && t.uint8array && (this.bufferish = c.Uint8Array), this;
}, n.preset = s({
preset: !0
});
}, {
"./bufferish": 8,
isarray: 34
} ],
10: [ function(t, e, n) {
t("./read-core"), t("./write-core"), n.codec = {
preset: t("./codec-base").preset
};
}, {
"./codec-base": 9,
"./read-core": 22,
"./write-core": 25
} ],
11: [ function(t, e, n) {
function r(t) {
if (!(this instanceof r)) return new r(t);
if (t && (this.options = t, t.codec)) {
var e = this.codec = t.codec;
e.bufferish && (this.bufferish = e.bufferish);
}
}
n.DecodeBuffer = r;
var o = t("./read-core").preset;
t("./flex-buffer").FlexDecoder.mixin(r.prototype), r.prototype.codec = o, r.prototype.fetch = function() {
return this.codec.decode(this);
};
}, {
"./flex-buffer": 21,
"./read-core": 22
} ],
12: [ function(t, e, n) {
n.decode = function(t, e) {
var n = new r(e);
return n.write(t), n.read();
};
var r = t("./decode-buffer").DecodeBuffer;
}, {
"./decode-buffer": 11
} ],
13: [ function(t, e, n) {
function r(t) {
return this instanceof r ? void i.call(this, t) : new r(t);
}
n.Decoder = r;
var o = t("event-lite"), i = t("./decode-buffer").DecodeBuffer;
r.prototype = new i(), o.mixin(r.prototype), r.prototype.decode = function(t) {
arguments.length && this.write(t), this.flush();
}, r.prototype.push = function(t) {
this.emit("data", t);
}, r.prototype.end = function(t) {
this.decode(t), this.emit("end");
};
}, {
"./decode-buffer": 11,
"event-lite": 31
} ],
14: [ function(t, e, n) {
function r(t) {
if (!(this instanceof r)) return new r(t);
if (t && (this.options = t, t.codec)) {
var e = this.codec = t.codec;
e.bufferish && (this.bufferish = e.bufferish);
}
}
n.EncodeBuffer = r;
var o = t("./write-core").preset;
t("./flex-buffer").FlexEncoder.mixin(r.prototype), r.prototype.codec = o, r.prototype.write = function(t) {
this.codec.encode(this, t);
};
}, {
"./flex-buffer": 21,
"./write-core": 25
} ],
15: [ function(t, e, n) {
n.encode = function(t, e) {
var n = new r(e);
return n.write(t), n.read();
};
var r = t("./encode-buffer").EncodeBuffer;
}, {
"./encode-buffer": 14
} ],
16: [ function(t, e, n) {
function r(t) {
return this instanceof r ? void i.call(this, t) : new r(t);
}
n.Encoder = r;
var o = t("event-lite"), i = t("./encode-buffer").EncodeBuffer;
r.prototype = new i(), o.mixin(r.prototype), r.prototype.encode = function(t) {
this.write(t), this.emit("data", this.read());
}, r.prototype.end = function(t) {
arguments.length && this.encode(t), this.flush(), this.emit("end");
};
}, {
"./encode-buffer": 14,
"event-lite": 31
} ],
17: [ function(t, e, n) {
n.ExtBuffer = function t(e, n) {
return this instanceof t ? (this.buffer = r.from(e), void (this.type = n)) : new t(e, n);
};
var r = t("./bufferish");
}, {
"./bufferish": 8
} ],
18: [ function(t, e, n) {
function r(e) {
return a || (a = t("./encode").encode), a(e);
}
function o(t) {
return t.valueOf();
}
function i(t) {
(t = RegExp.prototype.toString.call(t).split("/")).shift();
var e = [ t.pop() ];
return e.unshift(t.join("/")), e;
}
function s(t) {
var e = {};
for (var n in l) e[n] = t[n];
return e;
}
n.setExtPackers = function(t) {
t.addExtPacker(14, Error, [ s, r ]), t.addExtPacker(1, EvalError, [ s, r ]), t.addExtPacker(2, RangeError, [ s, r ]), 
t.addExtPacker(3, ReferenceError, [ s, r ]), t.addExtPacker(4, SyntaxError, [ s, r ]), 
t.addExtPacker(5, TypeError, [ s, r ]), t.addExtPacker(6, URIError, [ s, r ]), t.addExtPacker(10, RegExp, [ i, r ]), 
t.addExtPacker(11, Boolean, [ o, r ]), t.addExtPacker(12, String, [ o, r ]), t.addExtPacker(13, Date, [ Number, r ]), 
t.addExtPacker(15, Number, [ o, r ]), "undefined" != typeof Uint8Array && (t.addExtPacker(17, Int8Array, f), 
t.addExtPacker(18, Uint8Array, f), t.addExtPacker(19, Int16Array, f), t.addExtPacker(20, Uint16Array, f), 
t.addExtPacker(21, Int32Array, f), t.addExtPacker(22, Uint32Array, f), t.addExtPacker(23, Float32Array, f), 
"undefined" != typeof Float64Array && t.addExtPacker(24, Float64Array, f), "undefined" != typeof Uint8ClampedArray && t.addExtPacker(25, Uint8ClampedArray, f), 
t.addExtPacker(26, ArrayBuffer, f), t.addExtPacker(29, DataView, f)), c.hasBuffer && t.addExtPacker(27, u, c.from);
};
var a, c = t("./bufferish"), u = c.global, f = c.Uint8Array.from, l = {
name: 1,
message: 1,
stack: 1,
columnNumber: 1,
fileName: 1,
lineNumber: 1
};
}, {
"./bufferish": 8,
"./encode": 15
} ],
19: [ function(t, e, n) {
function r(e) {
return c || (c = t("./decode").decode), c(e);
}
function o(t) {
return RegExp.apply(null, t);
}
function i(t) {
return function(e) {
var n = new t();
for (var r in l) n[r] = e[r];
return n;
};
}
function s(t) {
return function(e) {
return new t(e);
};
}
function a(t) {
return new Uint8Array(t).buffer;
}
n.setExtUnpackers = function(t) {
t.addExtUnpacker(14, [ r, i(Error) ]), t.addExtUnpacker(1, [ r, i(EvalError) ]), 
t.addExtUnpacker(2, [ r, i(RangeError) ]), t.addExtUnpacker(3, [ r, i(ReferenceError) ]), 
t.addExtUnpacker(4, [ r, i(SyntaxError) ]), t.addExtUnpacker(5, [ r, i(TypeError) ]), 
t.addExtUnpacker(6, [ r, i(URIError) ]), t.addExtUnpacker(10, [ r, o ]), t.addExtUnpacker(11, [ r, s(Boolean) ]), 
t.addExtUnpacker(12, [ r, s(String) ]), t.addExtUnpacker(13, [ r, s(Date) ]), t.addExtUnpacker(15, [ r, s(Number) ]), 
"undefined" != typeof Uint8Array && (t.addExtUnpacker(17, s(Int8Array)), t.addExtUnpacker(18, s(Uint8Array)), 
t.addExtUnpacker(19, [ a, s(Int16Array) ]), t.addExtUnpacker(20, [ a, s(Uint16Array) ]), 
t.addExtUnpacker(21, [ a, s(Int32Array) ]), t.addExtUnpacker(22, [ a, s(Uint32Array) ]), 
t.addExtUnpacker(23, [ a, s(Float32Array) ]), "undefined" != typeof Float64Array && t.addExtUnpacker(24, [ a, s(Float64Array) ]), 
"undefined" != typeof Uint8ClampedArray && t.addExtUnpacker(25, s(Uint8ClampedArray)), 
t.addExtUnpacker(26, a), t.addExtUnpacker(29, [ a, s(DataView) ])), u.hasBuffer && t.addExtUnpacker(27, s(f));
};
var c, u = t("./bufferish"), f = u.global, l = {
name: 1,
message: 1,
stack: 1,
columnNumber: 1,
fileName: 1,
lineNumber: 1
};
}, {
"./bufferish": 8,
"./decode": 12
} ],
20: [ function(t, e, n) {
t("./read-core"), t("./write-core"), n.createCodec = t("./codec-base").createCodec;
}, {
"./codec-base": 9,
"./read-core": 22,
"./write-core": 25
} ],
21: [ function(t, e, n) {
function r() {
if (!(this instanceof r)) return new r();
}
function o() {
if (!(this instanceof o)) return new o();
}
function i() {
return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch();
}
function s(t) {
(this.buffers || (this.buffers = [])).push(t);
}
function a(t) {
return function(e) {
for (var n in t) e[n] = t[n];
return e;
};
}
n.FlexDecoder = r, n.FlexEncoder = o;
var c = t("./bufferish"), u = "BUFFER_SHORTAGE";
r.mixin = a({
bufferish: c,
write: function(t) {
var e = this.offset ? c.prototype.slice.call(this.buffer, this.offset) : this.buffer;
this.buffer = e ? t ? this.bufferish.concat([ e, t ]) : e : t, this.offset = 0;
},
fetch: function() {
throw new Error("method not implemented: fetch()");
},
flush: function() {
for (;this.offset < this.buffer.length; ) {
var t, e = this.offset;
try {
t = this.fetch();
} catch (t) {
if (t && t.message != u) throw t;
this.offset = e;
break;
}
this.push(t);
}
},
push: s,
pull: function() {
return (this.buffers || (this.buffers = [])).shift();
},
read: i,
reserve: function(t) {
var e = this.offset, n = e + t;
if (n > this.buffer.length) throw new Error(u);
return this.offset = n, e;
},
offset: 0
}), r.mixin(r.prototype), o.mixin = a({
bufferish: c,
write: function() {
throw new Error("method not implemented: write()");
},
fetch: function() {
var t = this.start;
if (t < this.offset) {
var e = this.start = this.offset;
return c.prototype.slice.call(this.buffer, t, e);
}
},
flush: function() {
for (;this.start < this.offset; ) {
var t = this.fetch();
t && this.push(t);
}
},
push: s,
pull: function() {
var t = this.buffers || (this.buffers = []), e = t.length > 1 ? this.bufferish.concat(t) : t[0];
return t.length = 0, e;
},
read: i,
reserve: function(t) {
var e = 0 | t;
if (this.buffer) {
var n = this.buffer.length, r = 0 | this.offset, o = r + e;
if (o < n) return this.offset = o, r;
this.flush(), t = Math.max(t, Math.min(2 * n, this.maxBufferSize));
}
return t = Math.max(t, this.minBufferSize), this.buffer = this.bufferish.alloc(t), 
this.start = 0, this.offset = e, 0;
},
send: function(t) {
var e = t.length;
if (e > this.minBufferSize) this.flush(), this.push(t); else {
var n = this.reserve(e);
c.prototype.copy.call(t, this.buffer, n);
}
},
maxBufferSize: 65536,
minBufferSize: 2048,
offset: 0,
start: 0
}), o.mixin(o.prototype);
}, {
"./bufferish": 8
} ],
22: [ function(t, e, n) {
function r(t) {
var e = c.getReadToken(t);
return function(t) {
var n = a(t), r = e[n];
if (!r) throw new Error("Invalid type: " + (n ? "0x" + n.toString(16) : n));
return r(t);
};
}
function o() {
var t = this.options;
return this.decode = r(t), t && t.preset && s.setExtUnpackers(this), this;
}
var i = t("./ext-buffer").ExtBuffer, s = t("./ext-unpacker"), a = t("./read-format").readUint8, c = t("./read-token"), u = t("./codec-base");
u.install({
addExtUnpacker: function(t, e) {
(this.extUnpackers || (this.extUnpackers = []))[t] = u.filter(e);
},
getExtUnpacker: function(t) {
return (this.extUnpackers || (this.extUnpackers = []))[t] || function(e) {
return new i(e, t);
};
},
init: o
}), n.preset = o.call(u.preset);
}, {
"./codec-base": 9,
"./ext-buffer": 17,
"./ext-unpacker": 19,
"./read-format": 23,
"./read-token": 24
} ],
23: [ function(t, e, n) {
function r(t, e) {
var n, r = {}, o = new Array(e), i = new Array(e), s = t.codec.decode;
for (n = 0; n < e; n++) o[n] = s(t), i[n] = s(t);
for (n = 0; n < e; n++) r[o[n]] = i[n];
return r;
}
function o(t, e) {
var n, r = new Map(), o = new Array(e), i = new Array(e), s = t.codec.decode;
for (n = 0; n < e; n++) o[n] = s(t), i[n] = s(t);
for (n = 0; n < e; n++) r.set(o[n], i[n]);
return r;
}
function i(t, e) {
for (var n = new Array(e), r = t.codec.decode, o = 0; o < e; o++) n[o] = r(t);
return n;
}
function s(t, e) {
var n = t.reserve(e), r = n + e;
return P.toString.call(t.buffer, "utf-8", n, r);
}
function a(t, e) {
var n = t.reserve(e), r = n + e, o = P.slice.call(t.buffer, n, r);
return O.from(o);
}
function c(t, e) {
var n = t.reserve(e), r = n + e, o = P.slice.call(t.buffer, n, r);
return O.Uint8Array.from(o).buffer;
}
function u(t, e) {
var n = t.reserve(e + 1), r = t.buffer[n++], o = n + e, i = t.codec.getExtUnpacker(r);
if (!i) throw new Error("Invalid ext type: " + (r ? "0x" + r.toString(16) : r));
return i(P.slice.call(t.buffer, n, o));
}
function f(t) {
var e = t.reserve(1);
return t.buffer[e];
}
function l(t) {
var e = t.reserve(1), n = t.buffer[e];
return 128 & n ? n - 256 : n;
}
function h(t) {
var e = t.reserve(2), n = t.buffer;
return n[e++] << 8 | n[e];
}
function d(t) {
var e = t.reserve(2), n = t.buffer, r = n[e++] << 8 | n[e];
return 32768 & r ? r - 65536 : r;
}
function p(t) {
var e = t.reserve(4), n = t.buffer;
return 16777216 * n[e++] + (n[e++] << 16) + (n[e++] << 8) + n[e];
}
function g(t) {
var e = t.reserve(4), n = t.buffer;
return n[e++] << 24 | n[e++] << 16 | n[e++] << 8 | n[e];
}
function v(t, e) {
return function(n) {
var r = n.reserve(t);
return e.call(n.buffer, r, T);
};
}
function y(t) {
return new A(this, t).toNumber();
}
function m(t) {
return new R(this, t).toNumber();
}
function E(t) {
return new A(this, t);
}
function b(t) {
return new R(this, t);
}
function w(t) {
return S.read(this, t, !1, 23, 4);
}
function C(t) {
return S.read(this, t, !1, 52, 8);
}
var S = t("ieee754"), _ = t("int64-buffer"), A = _.Uint64BE, R = _.Int64BE;
n.getReadFormat = function(t) {
var e = O.hasArrayBuffer && t && t.binarraybuffer, n = t && t.int64;
return {
map: I && t && t.usemap ? o : r,
array: i,
str: s,
bin: e ? c : a,
ext: u,
uint8: f,
uint16: h,
uint32: p,
uint64: v(8, n ? E : y),
int8: l,
int16: d,
int32: g,
int64: v(8, n ? b : m),
float32: v(4, w),
float64: v(8, C)
};
}, n.readUint8 = f;
var O = t("./bufferish"), P = t("./bufferish-proto"), I = "undefined" != typeof Map, T = !0;
}, {
"./bufferish": 8,
"./bufferish-proto": 6,
ieee754: 32,
"int64-buffer": 33
} ],
24: [ function(t, e, n) {
function r(t) {
var e, n = new Array(256);
for (e = 0; e <= 127; e++) n[e] = i(e);
for (e = 128; e <= 143; e++) n[e] = a(e - 128, t.map);
for (e = 144; e <= 159; e++) n[e] = a(e - 144, t.array);
for (e = 160; e <= 191; e++) n[e] = a(e - 160, t.str);
for (n[192] = i(null), n[193] = null, n[194] = i(!1), n[195] = i(!0), n[196] = s(t.uint8, t.bin), 
n[197] = s(t.uint16, t.bin), n[198] = s(t.uint32, t.bin), n[199] = s(t.uint8, t.ext), 
n[200] = s(t.uint16, t.ext), n[201] = s(t.uint32, t.ext), n[202] = t.float32, n[203] = t.float64, 
n[204] = t.uint8, n[205] = t.uint16, n[206] = t.uint32, n[207] = t.uint64, n[208] = t.int8, 
n[209] = t.int16, n[210] = t.int32, n[211] = t.int64, n[212] = a(1, t.ext), n[213] = a(2, t.ext), 
n[214] = a(4, t.ext), n[215] = a(8, t.ext), n[216] = a(16, t.ext), n[217] = s(t.uint8, t.str), 
n[218] = s(t.uint16, t.str), n[219] = s(t.uint32, t.str), n[220] = s(t.uint16, t.array), 
n[221] = s(t.uint32, t.array), n[222] = s(t.uint16, t.map), n[223] = s(t.uint32, t.map), 
e = 224; e <= 255; e++) n[e] = i(e - 256);
return n;
}
function o(t) {
var e, n = r(t).slice();
for (n[217] = n[196], n[218] = n[197], n[219] = n[198], e = 160; e <= 191; e++) n[e] = a(e - 160, t.bin);
return n;
}
function i(t) {
return function() {
return t;
};
}
function s(t, e) {
return function(n) {
var r = t(n);
return e(n, r);
};
}
function a(t, e) {
return function(n) {
return e(n, t);
};
}
var c = t("./read-format");
n.getReadToken = function(t) {
var e = c.getReadFormat(t);
return t && t.useraw ? o(e) : r(e);
};
}, {
"./read-format": 23
} ],
25: [ function(t, e, n) {
function r(t) {
var e = a.getWriteType(t);
return function(t, n) {
var r = e[typeof n];
if (!r) throw new Error('Unsupported type "' + typeof n + '": ' + n);
r(t, n);
};
}
function o() {
var t = this.options;
return this.encode = r(t), t && t.preset && s.setExtPackers(this), this;
}
var i = t("./ext-buffer").ExtBuffer, s = t("./ext-packer"), a = t("./write-type"), c = t("./codec-base");
c.install({
addExtPacker: function(t, e, n) {
function r(e) {
return n && (e = n(e)), new i(e, t);
}
n = c.filter(n);
var o = e.name;
o && "Object" !== o ? (this.extPackers || (this.extPackers = {}))[o] = r : (this.extEncoderList || (this.extEncoderList = [])).unshift([ e, r ]);
},
getExtPacker: function(t) {
var e = this.extPackers || (this.extPackers = {}), n = t.constructor, r = n && n.name && e[n.name];
if (r) return r;
for (var o = this.extEncoderList || (this.extEncoderList = []), i = o.length, s = 0; s < i; s++) {
var a = o[s];
if (n === a[0]) return a[1];
}
},
init: o
}), n.preset = o.call(c.preset);
}, {
"./codec-base": 9,
"./ext-buffer": 17,
"./ext-packer": 18,
"./write-type": 27
} ],
26: [ function(t, e, n) {
function r() {
var t = o();
return t[202] = u(202, 4, h), t[203] = u(203, 8, d), t;
}
function o() {
var t = m.slice();
return t[196] = s(196), t[197] = a(197), t[198] = c(198), t[199] = s(199), t[200] = a(200), 
t[201] = c(201), t[202] = u(202, 4, C.writeFloatBE || h, !0), t[203] = u(203, 8, C.writeDoubleBE || d, !0), 
t[204] = s(204), t[205] = a(205), t[206] = c(206), t[207] = u(207, 8, f), t[208] = s(208), 
t[209] = a(209), t[210] = c(210), t[211] = u(211, 8, l), t[217] = s(217), t[218] = a(218), 
t[219] = c(219), t[220] = a(220), t[221] = c(221), t[222] = a(222), t[223] = c(223), 
t;
}
function i() {
var t = m.slice();
return t[196] = u(196, 1, b.prototype.writeUInt8), t[197] = u(197, 2, b.prototype.writeUInt16BE), 
t[198] = u(198, 4, b.prototype.writeUInt32BE), t[199] = u(199, 1, b.prototype.writeUInt8), 
t[200] = u(200, 2, b.prototype.writeUInt16BE), t[201] = u(201, 4, b.prototype.writeUInt32BE), 
t[202] = u(202, 4, b.prototype.writeFloatBE), t[203] = u(203, 8, b.prototype.writeDoubleBE), 
t[204] = u(204, 1, b.prototype.writeUInt8), t[205] = u(205, 2, b.prototype.writeUInt16BE), 
t[206] = u(206, 4, b.prototype.writeUInt32BE), t[207] = u(207, 8, f), t[208] = u(208, 1, b.prototype.writeInt8), 
t[209] = u(209, 2, b.prototype.writeInt16BE), t[210] = u(210, 4, b.prototype.writeInt32BE), 
t[211] = u(211, 8, l), t[217] = u(217, 1, b.prototype.writeUInt8), t[218] = u(218, 2, b.prototype.writeUInt16BE), 
t[219] = u(219, 4, b.prototype.writeUInt32BE), t[220] = u(220, 2, b.prototype.writeUInt16BE), 
t[221] = u(221, 4, b.prototype.writeUInt32BE), t[222] = u(222, 2, b.prototype.writeUInt16BE), 
t[223] = u(223, 4, b.prototype.writeUInt32BE), t;
}
function s(t) {
return function(e, n) {
var r = e.reserve(2), o = e.buffer;
o[r++] = t, o[r] = n;
};
}
function a(t) {
return function(e, n) {
var r = e.reserve(3), o = e.buffer;
o[r++] = t, o[r++] = n >>> 8, o[r] = n;
};
}
function c(t) {
return function(e, n) {
var r = e.reserve(5), o = e.buffer;
o[r++] = t, o[r++] = n >>> 24, o[r++] = n >>> 16, o[r++] = n >>> 8, o[r] = n;
};
}
function u(t, e, n, r) {
return function(o, i) {
var s = o.reserve(e + 1);
o.buffer[s++] = t, n.call(o.buffer, i, s, r);
};
}
function f(t, e) {
new v(this, e, t);
}
function l(t, e) {
new y(this, e, t);
}
function h(t, e) {
p.write(this, t, e, !1, 23, 4);
}
function d(t, e) {
p.write(this, t, e, !1, 52, 8);
}
var p = t("ieee754"), g = t("int64-buffer"), v = g.Uint64BE, y = g.Int64BE, m = t("./write-uint8").uint8, E = t("./bufferish"), b = E.global, w = E.hasBuffer && "TYPED_ARRAY_SUPPORT" in b && !b.TYPED_ARRAY_SUPPORT, C = E.hasBuffer && b.prototype || {};
n.getWriteToken = function(t) {
return t && t.uint8array ? r() : w || E.hasBuffer && t && t.safe ? i() : o();
};
}, {
"./bufferish": 8,
"./write-uint8": 28,
ieee754: 32,
"int64-buffer": 33
} ],
27: [ function(t, e, n) {
var r = t("isarray"), o = t("int64-buffer"), i = o.Uint64BE, s = o.Int64BE, a = t("./bufferish"), c = t("./bufferish-proto"), u = t("./write-token"), f = t("./write-uint8").uint8, l = t("./ext-buffer").ExtBuffer, h = "undefined" != typeof Uint8Array, d = "undefined" != typeof Map, p = [];
p[1] = 212, p[2] = 213, p[4] = 214, p[8] = 215, p[16] = 216, n.getWriteType = function(t) {
function e(t, e) {
w[207](t, e.toArray());
}
function n(t, e) {
w[211](t, e.toArray());
}
function o(t, o) {
if (null === o) return g(t, o);
if (_(o)) return A(t, o);
if (r(o)) return v(t, o);
if (i.isUint64BE(o)) return e(t, o);
if (s.isInt64BE(o)) return n(t, o);
var a = t.codec.getExtPacker(o);
return a && (o = a(o)), o instanceof l ? m(t, o) : void R(t, o);
}
function g(t, e) {
w[192](t, e);
}
function v(t, e) {
var n = e.length;
w[n < 16 ? 144 + n : n <= 65535 ? 220 : 221](t, n);
for (var r = t.codec.encode, o = 0; o < n; o++) r(t, e[o]);
}
function y(t, e) {
var n = e.length;
w[n < 255 ? 196 : n <= 65535 ? 197 : 198](t, n), t.send(e);
}
function m(t, e) {
var n = e.buffer, r = n.length, o = p[r] || (r < 255 ? 199 : r <= 65535 ? 200 : 201);
w[o](t, r), f[e.type](t), t.send(n);
}
function E(t, e) {
var n = Object.keys(e), r = n.length;
w[r < 16 ? 128 + r : r <= 65535 ? 222 : 223](t, r);
var o = t.codec.encode;
n.forEach(function(n) {
o(t, n), o(t, e[n]);
});
}
function b(t, e) {
var n = e.length;
w[n < 32 ? 160 + n : n <= 65535 ? 218 : 219](t, n), t.send(e);
}
var w = u.getWriteToken(t), C = t && t.useraw, S = h && t && t.binarraybuffer, _ = S ? a.isArrayBuffer : a.isBuffer, A = S ? function(t, e) {
y(t, new Uint8Array(e));
} : y, R = d && t && t.usemap ? function(t, e) {
if (!(e instanceof Map)) return E(t, e);
var n = e.size;
w[n < 16 ? 128 + n : n <= 65535 ? 222 : 223](t, n);
var r = t.codec.encode;
e.forEach(function(e, n) {
r(t, n), r(t, e);
});
} : E;
return {
boolean: function(t, e) {
w[e ? 195 : 194](t, e);
},
function: g,
number: function(t, e) {
var n = 0 | e;
return e !== n ? void w[203](t, e) : void w[-32 <= n && n <= 127 ? 255 & n : 0 <= n ? n <= 255 ? 204 : n <= 65535 ? 205 : 206 : -128 <= n ? 208 : -32768 <= n ? 209 : 210](t, n);
},
object: C ? function(t, e) {
return _(e) ? b(t, e) : void o(t, e);
} : o,
string: function(t) {
return function(e, n) {
var r = n.length, o = 5 + 3 * r;
e.offset = e.reserve(o);
var i = e.buffer, s = t(r), a = e.offset + s;
r = c.write.call(i, n, a);
var u = t(r);
if (s !== u) {
var f = a + u - s, l = a + r;
c.copy.call(i, i, f, a, l);
}
w[1 === u ? 160 + r : u <= 3 ? 215 + u : 219](e, r), e.offset += r;
};
}(C ? function(t) {
return t < 32 ? 1 : t <= 65535 ? 3 : 5;
} : function(t) {
return t < 32 ? 1 : t <= 255 ? 2 : t <= 65535 ? 3 : 5;
}),
symbol: g,
undefined: g
};
};
}, {
"./bufferish": 8,
"./bufferish-proto": 6,
"./ext-buffer": 17,
"./write-token": 26,
"./write-uint8": 28,
"int64-buffer": 33,
isarray: 34
} ],
28: [ function(t, e, n) {
function r(t) {
return function(e) {
var n = e.reserve(1);
e.buffer[n] = t;
};
}
for (var o = n.uint8 = new Array(256), i = 0; i <= 255; i++) o[i] = r(i);
}, {} ],
29: [ function(t, e, n) {
(function(e) {
function r() {
return i.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function o(t, e) {
if (r() < e) throw new RangeError("Invalid typed array length");
return i.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = i.prototype : (null === t && (t = new i(e)), 
t.length = e), t;
}
function i(t, e, n) {
if (!(i.TYPED_ARRAY_SUPPORT || this instanceof i)) return new i(t, e, n);
if ("number" == typeof t) {
if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
return u(this, t);
}
return s(this, t, e, n);
}
function s(t, e, n, r) {
if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? h(t, e, n, r) : "string" == typeof e ? f(t, e, n) : d(t, e);
}
function a(t) {
if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
if (t < 0) throw new RangeError('"size" argument must not be negative');
}
function c(t, e, n, r) {
return a(e), e <= 0 ? o(t, e) : void 0 !== n ? "string" == typeof r ? o(t, e).fill(n, r) : o(t, e).fill(n) : o(t, e);
}
function u(t, e) {
if (a(e), t = o(t, e < 0 ? 0 : 0 | p(e)), !i.TYPED_ARRAY_SUPPORT) for (var n = 0; n < e; ++n) t[n] = 0;
return t;
}
function f(t, e, n) {
if ("string" == typeof n && "" !== n || (n = "utf8"), !i.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
var r = 0 | g(e, n), s = (t = o(t, r)).write(e, n);
return s !== r && (t = t.slice(0, s)), t;
}
function l(t, e) {
var n = e.length < 0 ? 0 : 0 | p(e.length);
t = o(t, n);
for (var r = 0; r < n; r += 1) t[r] = 255 & e[r];
return t;
}
function h(t, e, n, r) {
if (e.byteLength, n < 0 || e.byteLength < n) throw new RangeError("'offset' is out of bounds");
if (e.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
return e = void 0 === n && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, n) : new Uint8Array(e, n, r), 
i.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = i.prototype : t = l(t, e), t;
}
function d(t, e) {
if (i.isBuffer(e)) {
var n = 0 | p(e.length);
return 0 === (t = o(t, n)).length ? t : (e.copy(t, 0, 0, n), t);
}
if (e) {
if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return "number" != typeof e.length || J(e.length) ? o(t, 0) : l(t, e);
if ("Buffer" === e.type && Z(e.data)) return l(t, e.data);
}
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function p(t) {
if (t >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");
return 0 | t;
}
function g(t, e) {
if (i.isBuffer(t)) return t.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
"string" != typeof t && (t = "" + t);
var n = t.length;
if (0 === n) return 0;
for (var r = !1; ;) switch (e) {
case "ascii":
case "latin1":
case "binary":
return n;

case "utf8":
case "utf-8":
case void 0:
return Y(t).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * n;

case "hex":
return n >>> 1;

case "base64":
return V(t).length;

default:
if (r) return Y(t).length;
e = ("" + e).toLowerCase(), r = !0;
}
}
function v(t, e, n) {
var r = !1;
if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
if ((n >>>= 0) <= (e >>>= 0)) return "";
for (t || (t = "utf8"); ;) switch (t) {
case "hex":
return x(this, e, n);

case "utf8":
case "utf-8":
return O(this, e, n);

case "ascii":
return I(this, e, n);

case "latin1":
case "binary":
return T(this, e, n);

case "base64":
return R(this, e, n);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return N(this, e, n);

default:
if (r) throw new TypeError("Unknown encoding: " + t);
t = (t + "").toLowerCase(), r = !0;
}
}
function y(t, e, n) {
var r = t[e];
t[e] = t[n], t[n] = r;
}
function m(t, e, n, r, o) {
if (0 === t.length) return -1;
if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), 
n = +n, isNaN(n) && (n = o ? 0 : t.length - 1), n < 0 && (n = t.length + n), n >= t.length) {
if (o) return -1;
n = t.length - 1;
} else if (n < 0) {
if (!o) return -1;
n = 0;
}
if ("string" == typeof e && (e = i.from(e, r)), i.isBuffer(e)) return 0 === e.length ? -1 : E(t, e, n, r, o);
if ("number" == typeof e) return e &= 255, i.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : E(t, [ e ], n, r, o);
throw new TypeError("val must be string, number or Buffer");
}
function E(t, e, n, r, o) {
function i(t, e) {
return 1 === a ? t[e] : t.readUInt16BE(e * a);
}
var s, a = 1, c = t.length, u = e.length;
if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
if (t.length < 2 || e.length < 2) return -1;
a = 2, c /= 2, u /= 2, n /= 2;
}
if (o) {
var f = -1;
for (s = n; s < c; s++) if (i(t, s) === i(e, -1 === f ? 0 : s - f)) {
if (-1 === f && (f = s), s - f + 1 === u) return f * a;
} else -1 !== f && (s -= s - f), f = -1;
} else for (n + u > c && (n = c - u), s = n; s >= 0; s--) {
for (var l = !0, h = 0; h < u; h++) if (i(t, s + h) !== i(e, h)) {
l = !1;
break;
}
if (l) return s;
}
return -1;
}
function b(t, e, n, r) {
n = Number(n) || 0;
var o = t.length - n;
r ? (r = Number(r)) > o && (r = o) : r = o;
var i = e.length;
if (i % 2 != 0) throw new TypeError("Invalid hex string");
r > i / 2 && (r = i / 2);
for (var s = 0; s < r; ++s) {
var a = parseInt(e.substr(2 * s, 2), 16);
if (isNaN(a)) return s;
t[n + s] = a;
}
return s;
}
function w(t, e, n, r) {
return z(Y(e, t.length - n), t, n, r);
}
function C(t, e, n, r) {
return z(H(e), t, n, r);
}
function S(t, e, n, r) {
return C(t, e, n, r);
}
function _(t, e, n, r) {
return z(V(e), t, n, r);
}
function A(t, e, n, r) {
return z(K(e, t.length - n), t, n, r);
}
function R(t, e, n) {
return 0 === e && n === t.length ? q.fromByteArray(t) : q.fromByteArray(t.slice(e, n));
}
function O(t, e, n) {
n = Math.min(t.length, n);
for (var r = [], o = e; o < n; ) {
var i = t[o], s = null, a = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
if (o + a <= n) {
var c, u, f, l;
switch (a) {
case 1:
i < 128 && (s = i);
break;

case 2:
128 == (192 & (c = t[o + 1])) && (l = (31 & i) << 6 | 63 & c) > 127 && (s = l);
break;

case 3:
c = t[o + 1], u = t[o + 2], 128 == (192 & c) && 128 == (192 & u) && (l = (15 & i) << 12 | (63 & c) << 6 | 63 & u) > 2047 && (l < 55296 || l > 57343) && (s = l);
break;

case 4:
c = t[o + 1], u = t[o + 2], f = t[o + 3], 128 == (192 & c) && 128 == (192 & u) && 128 == (192 & f) && (l = (15 & i) << 18 | (63 & c) << 12 | (63 & u) << 6 | 63 & f) > 65535 && l < 1114112 && (s = l);
}
}
null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, r.push(s >>> 10 & 1023 | 55296), 
s = 56320 | 1023 & s), r.push(s), o += a;
}
return P(r);
}
function P(t) {
var e = t.length;
if (e <= Q) return String.fromCharCode.apply(String, t);
for (var n = "", r = 0; r < e; ) n += String.fromCharCode.apply(String, t.slice(r, r += Q));
return n;
}
function I(t, e, n) {
var r = "";
n = Math.min(t.length, n);
for (var o = e; o < n; ++o) r += String.fromCharCode(127 & t[o]);
return r;
}
function T(t, e, n) {
var r = "";
n = Math.min(t.length, n);
for (var o = e; o < n; ++o) r += String.fromCharCode(t[o]);
return r;
}
function x(t, e, n) {
var r = t.length;
(!e || e < 0) && (e = 0), (!n || n < 0 || n > r) && (n = r);
for (var o = "", i = e; i < n; ++i) o += W(t[i]);
return o;
}
function N(t, e, n) {
for (var r = t.slice(e, n), o = "", i = 0; i < r.length; i += 2) o += String.fromCharCode(r[i] + 256 * r[i + 1]);
return o;
}
function B(t, e, n) {
if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
if (t + e > n) throw new RangeError("Trying to access beyond buffer length");
}
function L(t, e, n, r, o, s) {
if (!i.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (e > o || e < s) throw new RangeError('"value" argument is out of bounds');
if (n + r > t.length) throw new RangeError("Index out of range");
}
function k(t, e, n, r) {
e < 0 && (e = 65535 + e + 1);
for (var o = 0, i = Math.min(t.length - n, 2); o < i; ++o) t[n + o] = (e & 255 << 8 * (r ? o : 1 - o)) >>> 8 * (r ? o : 1 - o);
}
function D(t, e, n, r) {
e < 0 && (e = 4294967295 + e + 1);
for (var o = 0, i = Math.min(t.length - n, 4); o < i; ++o) t[n + o] = e >>> 8 * (r ? o : 3 - o) & 255;
}
function U(t, e, n, r) {
if (n + r > t.length) throw new RangeError("Index out of range");
if (n < 0) throw new RangeError("Index out of range");
}
function M(t, e, n, r, o) {
return o || U(t, 0, n, 4), X.write(t, e, n, r, 23, 4), n + 4;
}
function F(t, e, n, r, o) {
return o || U(t, 0, n, 8), X.write(t, e, n, r, 52, 8), n + 8;
}
function j(t) {
if ((t = G(t).replace($, "")).length < 2) return "";
for (;t.length % 4 != 0; ) t += "=";
return t;
}
function G(t) {
return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
}
function W(t) {
return t < 16 ? "0" + t.toString(16) : t.toString(16);
}
function Y(t, e) {
e = e || 1 / 0;
for (var n, r = t.length, o = null, i = [], s = 0; s < r; ++s) {
if ((n = t.charCodeAt(s)) > 55295 && n < 57344) {
if (!o) {
if (n > 56319) {
(e -= 3) > -1 && i.push(239, 191, 189);
continue;
}
if (s + 1 === r) {
(e -= 3) > -1 && i.push(239, 191, 189);
continue;
}
o = n;
continue;
}
if (n < 56320) {
(e -= 3) > -1 && i.push(239, 191, 189), o = n;
continue;
}
n = 65536 + (o - 55296 << 10 | n - 56320);
} else o && (e -= 3) > -1 && i.push(239, 191, 189);
if (o = null, n < 128) {
if ((e -= 1) < 0) break;
i.push(n);
} else if (n < 2048) {
if ((e -= 2) < 0) break;
i.push(n >> 6 | 192, 63 & n | 128);
} else if (n < 65536) {
if ((e -= 3) < 0) break;
i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
} else {
if (!(n < 1114112)) throw new Error("Invalid code point");
if ((e -= 4) < 0) break;
i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
}
}
return i;
}
function H(t) {
for (var e = [], n = 0; n < t.length; ++n) e.push(255 & t.charCodeAt(n));
return e;
}
function K(t, e) {
for (var n, r, o, i = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) r = (n = t.charCodeAt(s)) >> 8, 
o = n % 256, i.push(o), i.push(r);
return i;
}
function V(t) {
return q.toByteArray(j(t));
}
function z(t, e, n, r) {
for (var o = 0; o < r && !(o + n >= e.length || o >= t.length); ++o) e[o + n] = t[o];
return o;
}
function J(t) {
return t != t;
}
var q = t("base64-js"), X = t("ieee754"), Z = t("isarray");
n.Buffer = i, n.SlowBuffer = function(t) {
return +t != t && (t = 0), i.alloc(+t);
}, n.INSPECT_MAX_BYTES = 50, i.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
try {
var t = new Uint8Array(1);
return t.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
}, 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
} catch (t) {
return !1;
}
}(), n.kMaxLength = r(), i.poolSize = 8192, i._augment = function(t) {
return t.__proto__ = i.prototype, t;
}, i.from = function(t, e, n) {
return s(null, t, e, n);
}, i.TYPED_ARRAY_SUPPORT && (i.prototype.__proto__ = Uint8Array.prototype, i.__proto__ = Uint8Array, 
"undefined" != typeof Symbol && Symbol.species && i[Symbol.species] === i && Object.defineProperty(i, Symbol.species, {
value: null,
configurable: !0
})), i.alloc = function(t, e, n) {
return c(null, t, e, n);
}, i.allocUnsafe = function(t) {
return u(null, t);
}, i.allocUnsafeSlow = function(t) {
return u(null, t);
}, i.isBuffer = function(t) {
return !(null == t || !t._isBuffer);
}, i.compare = function(t, e) {
if (!i.isBuffer(t) || !i.isBuffer(e)) throw new TypeError("Arguments must be Buffers");
if (t === e) return 0;
for (var n = t.length, r = e.length, o = 0, s = Math.min(n, r); o < s; ++o) if (t[o] !== e[o]) {
n = t[o], r = e[o];
break;
}
return n < r ? -1 : r < n ? 1 : 0;
}, i.isEncoding = function(t) {
switch (String(t).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
}, i.concat = function(t, e) {
if (!Z(t)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === t.length) return i.alloc(0);
var n;
if (void 0 === e) for (e = 0, n = 0; n < t.length; ++n) e += t[n].length;
var r = i.allocUnsafe(e), o = 0;
for (n = 0; n < t.length; ++n) {
var s = t[n];
if (!i.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
s.copy(r, o), o += s.length;
}
return r;
}, i.byteLength = g, i.prototype._isBuffer = !0, i.prototype.swap16 = function() {
var t = this.length;
if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var e = 0; e < t; e += 2) y(this, e, e + 1);
return this;
}, i.prototype.swap32 = function() {
var t = this.length;
if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var e = 0; e < t; e += 4) y(this, e, e + 3), y(this, e + 1, e + 2);
return this;
}, i.prototype.swap64 = function() {
var t = this.length;
if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var e = 0; e < t; e += 8) y(this, e, e + 7), y(this, e + 1, e + 6), y(this, e + 2, e + 5), 
y(this, e + 3, e + 4);
return this;
}, i.prototype.toString = function() {
var t = 0 | this.length;
return 0 === t ? "" : 0 === arguments.length ? O(this, 0, t) : v.apply(this, arguments);
}, i.prototype.equals = function(t) {
if (!i.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
return this === t || 0 === i.compare(this, t);
}, i.prototype.inspect = function() {
var t = "", e = n.INSPECT_MAX_BYTES;
return this.length > 0 && (t = this.toString("hex", 0, e).match(/.{2}/g).join(" "), 
this.length > e && (t += " ... ")), "<Buffer " + t + ">";
}, i.prototype.compare = function(t, e, n, r, o) {
if (!i.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
if (void 0 === e && (e = 0), void 0 === n && (n = t ? t.length : 0), void 0 === r && (r = 0), 
void 0 === o && (o = this.length), e < 0 || n > t.length || r < 0 || o > this.length) throw new RangeError("out of range index");
if (r >= o && e >= n) return 0;
if (r >= o) return -1;
if (e >= n) return 1;
if (this === t) return 0;
for (var s = (o >>>= 0) - (r >>>= 0), a = (n >>>= 0) - (e >>>= 0), c = Math.min(s, a), u = this.slice(r, o), f = t.slice(e, n), l = 0; l < c; ++l) if (u[l] !== f[l]) {
s = u[l], a = f[l];
break;
}
return s < a ? -1 : a < s ? 1 : 0;
}, i.prototype.includes = function(t, e, n) {
return -1 !== this.indexOf(t, e, n);
}, i.prototype.indexOf = function(t, e, n) {
return m(this, t, e, n, !0);
}, i.prototype.lastIndexOf = function(t, e, n) {
return m(this, t, e, n, !1);
}, i.prototype.write = function(t, e, n, r) {
if (void 0 === e) r = "utf8", n = this.length, e = 0; else if (void 0 === n && "string" == typeof e) r = e, 
n = this.length, e = 0; else {
if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
e |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0);
}
var o = this.length - e;
if ((void 0 === n || n > o) && (n = o), t.length > 0 && (n < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
r || (r = "utf8");
for (var i = !1; ;) switch (r) {
case "hex":
return b(this, t, e, n);

case "utf8":
case "utf-8":
return w(this, t, e, n);

case "ascii":
return C(this, t, e, n);

case "latin1":
case "binary":
return S(this, t, e, n);

case "base64":
return _(this, t, e, n);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return A(this, t, e, n);

default:
if (i) throw new TypeError("Unknown encoding: " + r);
r = ("" + r).toLowerCase(), i = !0;
}
}, i.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
var Q = 4096;
i.prototype.slice = function(t, e) {
var n, r = this.length;
(t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), (e = void 0 === e ? r : ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), 
e < t && (e = t);
if (i.TYPED_ARRAY_SUPPORT) (n = this.subarray(t, e)).__proto__ = i.prototype; else {
var o = e - t;
n = new i(o, void 0);
for (var s = 0; s < o; ++s) n[s] = this[s + t];
}
return n;
}, i.prototype.readUIntLE = function(t, e, n) {
t |= 0, e |= 0, n || B(t, e, this.length);
for (var r = this[t], o = 1, i = 0; ++i < e && (o *= 256); ) r += this[t + i] * o;
return r;
}, i.prototype.readUIntBE = function(t, e, n) {
t |= 0, e |= 0, n || B(t, e, this.length);
for (var r = this[t + --e], o = 1; e > 0 && (o *= 256); ) r += this[t + --e] * o;
return r;
}, i.prototype.readUInt8 = function(t, e) {
return e || B(t, 1, this.length), this[t];
}, i.prototype.readUInt16LE = function(t, e) {
return e || B(t, 2, this.length), this[t] | this[t + 1] << 8;
}, i.prototype.readUInt16BE = function(t, e) {
return e || B(t, 2, this.length), this[t] << 8 | this[t + 1];
}, i.prototype.readUInt32LE = function(t, e) {
return e || B(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
}, i.prototype.readUInt32BE = function(t, e) {
return e || B(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
}, i.prototype.readIntLE = function(t, e, n) {
t |= 0, e |= 0, n || B(t, e, this.length);
for (var r = this[t], o = 1, i = 0; ++i < e && (o *= 256); ) r += this[t + i] * o;
return r >= (o *= 128) && (r -= Math.pow(2, 8 * e)), r;
}, i.prototype.readIntBE = function(t, e, n) {
t |= 0, e |= 0, n || B(t, e, this.length);
for (var r = e, o = 1, i = this[t + --r]; r > 0 && (o *= 256); ) i += this[t + --r] * o;
return i >= (o *= 128) && (i -= Math.pow(2, 8 * e)), i;
}, i.prototype.readInt8 = function(t, e) {
return e || B(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
}, i.prototype.readInt16LE = function(t, e) {
e || B(t, 2, this.length);
var n = this[t] | this[t + 1] << 8;
return 32768 & n ? 4294901760 | n : n;
}, i.prototype.readInt16BE = function(t, e) {
e || B(t, 2, this.length);
var n = this[t + 1] | this[t] << 8;
return 32768 & n ? 4294901760 | n : n;
}, i.prototype.readInt32LE = function(t, e) {
return e || B(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
}, i.prototype.readInt32BE = function(t, e) {
return e || B(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
}, i.prototype.readFloatLE = function(t, e) {
return e || B(t, 4, this.length), X.read(this, t, !0, 23, 4);
}, i.prototype.readFloatBE = function(t, e) {
return e || B(t, 4, this.length), X.read(this, t, !1, 23, 4);
}, i.prototype.readDoubleLE = function(t, e) {
return e || B(t, 8, this.length), X.read(this, t, !0, 52, 8);
}, i.prototype.readDoubleBE = function(t, e) {
return e || B(t, 8, this.length), X.read(this, t, !1, 52, 8);
}, i.prototype.writeUIntLE = function(t, e, n, r) {
(t = +t, e |= 0, n |= 0, r) || L(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
var o = 1, i = 0;
for (this[e] = 255 & t; ++i < n && (o *= 256); ) this[e + i] = t / o & 255;
return e + n;
}, i.prototype.writeUIntBE = function(t, e, n, r) {
(t = +t, e |= 0, n |= 0, r) || L(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
var o = n - 1, i = 1;
for (this[e + o] = 255 & t; --o >= 0 && (i *= 256); ) this[e + o] = t / i & 255;
return e + n;
}, i.prototype.writeUInt8 = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 1, 255, 0), i.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), 
this[e] = 255 & t, e + 1;
}, i.prototype.writeUInt16LE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 2, 65535, 0), i.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, 
this[e + 1] = t >>> 8) : k(this, t, e, !0), e + 2;
}, i.prototype.writeUInt16BE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 2, 65535, 0), i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, 
this[e + 1] = 255 & t) : k(this, t, e, !1), e + 2;
}, i.prototype.writeUInt32LE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 4, 4294967295, 0), i.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, 
this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : D(this, t, e, !0), 
e + 4;
}, i.prototype.writeUInt32BE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 4, 4294967295, 0), i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, 
this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : D(this, t, e, !1), 
e + 4;
}, i.prototype.writeIntLE = function(t, e, n, r) {
if (t = +t, e |= 0, !r) {
var o = Math.pow(2, 8 * n - 1);
L(this, t, e, n, o - 1, -o);
}
var i = 0, s = 1, a = 0;
for (this[e] = 255 & t; ++i < n && (s *= 256); ) t < 0 && 0 === a && 0 !== this[e + i - 1] && (a = 1), 
this[e + i] = (t / s >> 0) - a & 255;
return e + n;
}, i.prototype.writeIntBE = function(t, e, n, r) {
if (t = +t, e |= 0, !r) {
var o = Math.pow(2, 8 * n - 1);
L(this, t, e, n, o - 1, -o);
}
var i = n - 1, s = 1, a = 0;
for (this[e + i] = 255 & t; --i >= 0 && (s *= 256); ) t < 0 && 0 === a && 0 !== this[e + i + 1] && (a = 1), 
this[e + i] = (t / s >> 0) - a & 255;
return e + n;
}, i.prototype.writeInt8 = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 1, 127, -128), i.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), 
t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1;
}, i.prototype.writeInt16LE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 2, 32767, -32768), i.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, 
this[e + 1] = t >>> 8) : k(this, t, e, !0), e + 2;
}, i.prototype.writeInt16BE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 2, 32767, -32768), i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, 
this[e + 1] = 255 & t) : k(this, t, e, !1), e + 2;
}, i.prototype.writeInt32LE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 4, 2147483647, -2147483648), i.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, 
this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : D(this, t, e, !0), 
e + 4;
}, i.prototype.writeInt32BE = function(t, e, n) {
return t = +t, e |= 0, n || L(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), 
i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, 
this[e + 3] = 255 & t) : D(this, t, e, !1), e + 4;
}, i.prototype.writeFloatLE = function(t, e, n) {
return M(this, t, e, !0, n);
}, i.prototype.writeFloatBE = function(t, e, n) {
return M(this, t, e, !1, n);
}, i.prototype.writeDoubleLE = function(t, e, n) {
return F(this, t, e, !0, n);
}, i.prototype.writeDoubleBE = function(t, e, n) {
return F(this, t, e, !1, n);
}, i.prototype.copy = function(t, e, n, r) {
if (n || (n = 0), r || 0 === r || (r = this.length), e >= t.length && (e = t.length), 
e || (e = 0), r > 0 && r < n && (r = n), r === n) return 0;
if (0 === t.length || 0 === this.length) return 0;
if (e < 0) throw new RangeError("targetStart out of bounds");
if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
if (r < 0) throw new RangeError("sourceEnd out of bounds");
r > this.length && (r = this.length), t.length - e < r - n && (r = t.length - e + n);
var o, s = r - n;
if (this === t && n < e && e < r) for (o = s - 1; o >= 0; --o) t[o + e] = this[o + n]; else if (s < 1e3 || !i.TYPED_ARRAY_SUPPORT) for (o = 0; o < s; ++o) t[o + e] = this[o + n]; else Uint8Array.prototype.set.call(t, this.subarray(n, n + s), e);
return s;
}, i.prototype.fill = function(t, e, n, r) {
if ("string" == typeof t) {
if ("string" == typeof e ? (r = e, e = 0, n = this.length) : "string" == typeof n && (r = n, 
n = this.length), 1 === t.length) {
var o = t.charCodeAt(0);
o < 256 && (t = o);
}
if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
if ("string" == typeof r && !i.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
} else "number" == typeof t && (t &= 255);
if (e < 0 || this.length < e || this.length < n) throw new RangeError("Out of range index");
if (n <= e) return this;
e >>>= 0, n = void 0 === n ? this.length : n >>> 0, t || (t = 0);
var s;
if ("number" == typeof t) for (s = e; s < n; ++s) this[s] = t; else {
var a = i.isBuffer(t) ? t : Y(new i(t, r).toString()), c = a.length;
for (s = 0; s < n - e; ++s) this[s + e] = a[s % c];
}
return this;
};
var $ = /[^+\/0-9A-Za-z-_]/g;
}).call(this, "undefined" != typeof r ? r : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"base64-js": 30,
ieee754: 32,
isarray: 34
} ],
30: [ function(t, e, n) {
function r(t) {
var e = t.length;
if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
return "=" === t[e - 2] ? 2 : "=" === t[e - 1] ? 1 : 0;
}
function o(t) {
return s[t >> 18 & 63] + s[t >> 12 & 63] + s[t >> 6 & 63] + s[63 & t];
}
function i(t, e, n) {
for (var r, i = [], s = e; s < n; s += 3) r = (t[s] << 16) + (t[s + 1] << 8) + t[s + 2], 
i.push(o(r));
return i.join("");
}
n.byteLength = function(t) {
return 3 * t.length / 4 - r(t);
}, n.toByteArray = function(t) {
var e, n, o, i, s, u, f = t.length;
s = r(t), u = new c(3 * f / 4 - s), o = s > 0 ? f - 4 : f;
var l = 0;
for (e = 0, n = 0; e < o; e += 4, n += 3) i = a[t.charCodeAt(e)] << 18 | a[t.charCodeAt(e + 1)] << 12 | a[t.charCodeAt(e + 2)] << 6 | a[t.charCodeAt(e + 3)], 
u[l++] = i >> 16 & 255, u[l++] = i >> 8 & 255, u[l++] = 255 & i;
return 2 === s ? (i = a[t.charCodeAt(e)] << 2 | a[t.charCodeAt(e + 1)] >> 4, u[l++] = 255 & i) : 1 === s && (i = a[t.charCodeAt(e)] << 10 | a[t.charCodeAt(e + 1)] << 4 | a[t.charCodeAt(e + 2)] >> 2, 
u[l++] = i >> 8 & 255, u[l++] = 255 & i), u;
}, n.fromByteArray = function(t) {
for (var e, n = t.length, r = n % 3, o = "", a = [], c = 16383, u = 0, f = n - r; u < f; u += c) a.push(i(t, u, u + c > f ? f : u + c));
return 1 === r ? (e = t[n - 1], o += s[e >> 2], o += s[e << 4 & 63], o += "==") : 2 === r && (e = (t[n - 2] << 8) + t[n - 1], 
o += s[e >> 10], o += s[e >> 4 & 63], o += s[e << 2 & 63], o += "="), a.push(o), 
a.join("");
};
for (var s = [], a = [], c = "undefined" != typeof Uint8Array ? Uint8Array : Array, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, l = u.length; f < l; ++f) s[f] = u[f], 
a[u.charCodeAt(f)] = f;
a["-".charCodeAt(0)] = 62, a["_".charCodeAt(0)] = 63;
}, {} ],
31: [ function(t, e) {
!function(t) {
function n(t) {
for (var e in s) t[e] = s[e];
return t;
}
function r(t, e) {
var n, s = this;
if (arguments.length) {
if (e) {
if (n = o(s, t, !0)) {
if (!(n = n.filter(function(t) {
return t !== e && t.originalListener !== e;
})).length) return r.call(s, t);
s[i][t] = n;
}
} else if ((n = s[i]) && (delete n[t], !Object.keys(n).length)) return r.call(s);
} else delete s[i];
return s;
}
function o(t, e, n) {
if (!n || t[i]) {
var r = t[i] || (t[i] = {});
return r[e] || (r[e] = []);
}
}
"undefined" != typeof e && (e.exports = t);
var i = "listeners", s = {
on: function(t, e) {
return o(this, t).push(e), this;
},
once: function(t, e) {
function n() {
r.call(i, t, n), e.apply(this, arguments);
}
var i = this;
return n.originalListener = e, o(i, t).push(n), i;
},
off: r,
emit: function(t, e) {
var n = this, r = o(n, t, !0);
if (!r) return !1;
var i = arguments.length;
if (1 === i) r.forEach(function(t) {
t.call(n);
}); else if (2 === i) r.forEach(function(t) {
t.call(n, e);
}); else {
var s = Array.prototype.slice.call(arguments, 1);
r.forEach(function(t) {
t.apply(n, s);
});
}
return !!r.length;
}
};
n(t.prototype), t.mixin = n;
}(function t() {
if (!(this instanceof t)) return new t();
});
}, {} ],
32: [ function(t, e, n) {
n.read = function(t, e, n, r, o) {
var i, s, a = 8 * o - r - 1, c = (1 << a) - 1, u = c >> 1, f = -7, l = n ? o - 1 : 0, h = n ? -1 : 1, d = t[e + l];
for (l += h, i = d & (1 << -f) - 1, d >>= -f, f += a; f > 0; i = 256 * i + t[e + l], 
l += h, f -= 8) ;
for (s = i & (1 << -f) - 1, i >>= -f, f += r; f > 0; s = 256 * s + t[e + l], l += h, 
f -= 8) ;
if (0 === i) i = 1 - u; else {
if (i === c) return s ? NaN : 1 / 0 * (d ? -1 : 1);
s += Math.pow(2, r), i -= u;
}
return (d ? -1 : 1) * s * Math.pow(2, i - r);
}, n.write = function(t, e, n, r, o, i) {
var s, a, c, u = 8 * i - o - 1, f = (1 << u) - 1, l = f >> 1, h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = r ? 0 : i - 1, p = r ? 1 : -1, g = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, s = f) : (s = Math.floor(Math.log(e) / Math.LN2), 
e * (c = Math.pow(2, -s)) < 1 && (s--, c *= 2), (e += s + l >= 1 ? h / c : h * Math.pow(2, 1 - l)) * c >= 2 && (s++, 
c /= 2), s + l >= f ? (a = 0, s = f) : s + l >= 1 ? (a = (e * c - 1) * Math.pow(2, o), 
s += l) : (a = e * Math.pow(2, l - 1) * Math.pow(2, o), s = 0)); o >= 8; t[n + d] = 255 & a, 
d += p, a /= 256, o -= 8) ;
for (s = s << o | a, u += o; u > 0; t[n + d] = 255 & s, d += p, s /= 256, u -= 8) ;
t[n + d - p] |= 128 * g;
};
}, {} ],
33: [ function(t, e, n) {
(function(t) {
!function(e) {
function n(t, n, E) {
function C(t, e, n, r) {
return this instanceof C ? S(this, t, e, n, r) : new C(t, e, n, r);
}
function S(t, e, n, r, o) {
if (v && y && (e instanceof y && (e = new v(e)), r instanceof y && (r = new v(r))), 
e || n || r || d) {
s(e, n) || (o = n, r = e, n = 0, e = new (d || Array)(8));
t.buffer = e, t.offset = n |= 0, p !== typeof r && ("string" == typeof r ? _(e, n, r, o || 10) : s(r, o) ? a(e, n, r, o) : "number" == typeof o ? (R(e, n + P, r), 
R(e, n + I, o)) : r > 0 ? L(e, n, r) : r < 0 ? k(e, n, r) : a(e, n, m, 0));
} else t.buffer = c(m, 0);
}
function _(t, e, n, r) {
var o = 0, i = n.length, s = 0, a = 0;
"-" === n[0] && o++;
for (var c = o; o < i; ) {
var u = parseInt(n[o++], r);
if (!(u >= 0)) break;
a = a * r + u, s = s * r + Math.floor(a / b), a %= b;
}
c && (s = ~s, a ? a = b - a : s++), R(t, e + P, s), R(t, e + I, a);
}
function A() {
var t = this.buffer, e = this.offset, n = O(t, e + P), r = O(t, e + I);
return E || (n |= 0), n ? n * b + r : r;
}
function R(t, e, n) {
t[e + B] = 255 & n, n >>= 8, t[e + N] = 255 & n, n >>= 8, t[e + x] = 255 & n, n >>= 8, 
t[e + T] = 255 & n;
}
function O(t, e) {
return t[e + T] * w + (t[e + x] << 16) + (t[e + N] << 8) + t[e + B];
}
var P = n ? 0 : 4, I = n ? 4 : 0, T = n ? 0 : 3, x = n ? 1 : 2, N = n ? 2 : 1, B = n ? 3 : 0, L = n ? u : l, k = n ? f : h, D = C.prototype, U = "is" + t, M = "_" + U;
return D.buffer = void 0, D.offset = 0, D[M] = !0, D.toNumber = A, D.toString = function(t) {
var e = this.buffer, n = this.offset, r = O(e, n + P), o = O(e, n + I), i = "", s = !E && 2147483648 & r;
for (s && (r = ~r, o = b - o), t = t || 10; ;) {
var a = r % t * b + o;
if (r = Math.floor(r / t), o = Math.floor(a / t), i = (a % t).toString(t) + i, !r && !o) break;
}
return s && (i = "-" + i), i;
}, D.toJSON = A, D.toArray = r, g && (D.toBuffer = o), v && (D.toArrayBuffer = i), 
C[U] = function(t) {
return !(!t || !t[M]);
}, e[t] = C, C;
}
function r(t) {
var e = this.buffer, n = this.offset;
return d = null, !1 !== t && 0 === n && 8 === e.length && E(e) ? e : c(e, n);
}
function o(e) {
var n = this.buffer, r = this.offset;
if (d = g, !1 !== e && 0 === r && 8 === n.length && t.isBuffer(n)) return n;
var o = new g(8);
return a(o, 0, n, r), o;
}
function i(t) {
var e = this.buffer, n = this.offset, r = e.buffer;
if (d = v, !1 !== t && 0 === n && r instanceof y && 8 === r.byteLength) return r;
var o = new v(8);
return a(o, 0, e, n), o.buffer;
}
function s(t, e) {
var n = t && t.length;
return e |= 0, n && e + 8 <= n && "string" != typeof t[e];
}
function a(t, e, n, r) {
e |= 0, r |= 0;
for (var o = 0; o < 8; o++) t[e++] = 255 & n[r++];
}
function c(t, e) {
return Array.prototype.slice.call(t, e, e + 8);
}
function u(t, e, n) {
for (var r = e + 8; r > e; ) t[--r] = 255 & n, n /= 256;
}
function f(t, e, n) {
var r = e + 8;
for (n++; r > e; ) t[--r] = 255 & -n ^ 255, n /= 256;
}
function l(t, e, n) {
for (var r = e + 8; e < r; ) t[e++] = 255 & n, n /= 256;
}
function h(t, e, n) {
var r = e + 8;
for (n++; e < r; ) t[e++] = 255 & -n ^ 255, n /= 256;
}
var d, p = "undefined", g = p !== typeof t && t, v = p !== typeof Uint8Array && Uint8Array, y = p !== typeof ArrayBuffer && ArrayBuffer, m = [ 0, 0, 0, 0, 0, 0, 0, 0 ], E = Array.isArray || function(t) {
return !!t && "[object Array]" == Object.prototype.toString.call(t);
}, b = 4294967296, w = 16777216;
n("Uint64BE", !0, !0), n("Int64BE", !0, !1), n("Uint64LE", !1, !0), n("Int64LE", !1, !1);
}("object" == typeof n && "string" != typeof n.nodeName ? n : this || {});
}).call(this, t("buffer").Buffer);
}, {
buffer: 29
} ],
34: [ function(t, e) {
var n = {}.toString;
e.exports = Array.isArray || function(t) {
return "[object Array]" == n.call(t);
};
}, {} ]
}, {}, [ 1 ])(1);
});
cc._RF.pop();
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
rotateNode: [ function(t, e) {
"use strict";
cc._RF.push(e, "9ae62JA4Q5Bi6i3tguix4V1", "rotateNode");
cc.Class({
extends: cc.Component,
properties: {
transDuration: 5
},
onEnable: function() {
var t = new cc.RotateBy(this.transDuration, 360), e = new cc.RepeatForever(t);
this.node.runAction(e);
},
onDisable: function() {
this.node.stopAllActions();
}
});
cc._RF.pop();
}, {} ],
runtime: [ function(t, e) {
"use strict";
cc._RF.push(e, "eeba5+ZXpdIX5DDyZUS4DJd", "runtime");
var n = function(t) {
var e, n = Object.prototype, r = n.hasOwnProperty, o = Object.defineProperty || function(t, e, n) {
t[e] = n.value;
}, i = "function" == typeof Symbol ? Symbol : {}, s = i.iterator || "@@iterator", a = i.asyncIterator || "@@asyncIterator", c = i.toStringTag || "@@toStringTag";
function u(t, e, n) {
Object.defineProperty(t, e, {
value: n,
enumerable: !0,
configurable: !0,
writable: !0
});
return t[e];
}
try {
u({}, "");
} catch (t) {
u = function(t, e, n) {
return t[e] = n;
};
}
function f(t, e, n, r) {
var i = e && e.prototype instanceof y ? e : y, s = Object.create(i.prototype), a = new T(r || []);
o(s, "_invoke", {
value: R(t, n, a)
});
return s;
}
t.wrap = f;
function l(t, e, n) {
try {
return {
type: "normal",
arg: t.call(e, n)
};
} catch (t) {
return {
type: "throw",
arg: t
};
}
}
var h = "suspendedStart", d = "suspendedYield", p = "executing", g = "completed", v = {};
function y() {}
function m() {}
function E() {}
var b = {};
u(b, s, function() {
return this;
});
var w = Object.getPrototypeOf, C = w && w(w(x([])));
C && C !== n && r.call(C, s) && (b = C);
var S = E.prototype = y.prototype = Object.create(b);
m.prototype = E;
o(S, "constructor", {
value: E,
configurable: !0
});
o(E, "constructor", {
value: m,
configurable: !0
});
m.displayName = u(E, c, "GeneratorFunction");
function _(t) {
[ "next", "throw", "return" ].forEach(function(e) {
u(t, e, function(t) {
return this._invoke(e, t);
});
});
}
t.isGeneratorFunction = function(t) {
var e = "function" == typeof t && t.constructor;
return !!e && (e === m || "GeneratorFunction" === (e.displayName || e.name));
};
t.mark = function(t) {
if (Object.setPrototypeOf) Object.setPrototypeOf(t, E); else {
t.__proto__ = E;
u(t, c, "GeneratorFunction");
}
t.prototype = Object.create(S);
return t;
};
t.awrap = function(t) {
return {
__await: t
};
};
function A(t, e) {
function n(o, i, s, a) {
var c = l(t[o], t, i);
if ("throw" !== c.type) {
var u = c.arg, f = u.value;
return f && "object" == typeof f && r.call(f, "__await") ? e.resolve(f.__await).then(function(t) {
n("next", t, s, a);
}, function(t) {
n("throw", t, s, a);
}) : e.resolve(f).then(function(t) {
u.value = t;
s(u);
}, function(t) {
return n("throw", t, s, a);
});
}
a(c.arg);
}
var i;
o(this, "_invoke", {
value: function(t, r) {
function o() {
return new e(function(e, o) {
n(t, r, e, o);
});
}
return i = i ? i.then(o, o) : o();
}
});
}
_(A.prototype);
u(A.prototype, a, function() {
return this;
});
t.AsyncIterator = A;
t.async = function(e, n, r, o, i) {
void 0 === i && (i = Promise);
var s = new A(f(e, n, r, o), i);
return t.isGeneratorFunction(n) ? s : s.next().then(function(t) {
return t.done ? t.value : s.next();
});
};
function R(t, n, r) {
var o = h;
return function(i, s) {
if (o === p) throw new Error("Generator is already running");
if (o === g) {
if ("throw" === i) throw s;
return {
value: e,
done: !0
};
}
r.method = i;
r.arg = s;
for (;;) {
var a = r.delegate;
if (a) {
var c = O(a, r);
if (c) {
if (c === v) continue;
return c;
}
}
if ("next" === r.method) r.sent = r._sent = r.arg; else if ("throw" === r.method) {
if (o === h) {
o = g;
throw r.arg;
}
r.dispatchException(r.arg);
} else "return" === r.method && r.abrupt("return", r.arg);
o = p;
var u = l(t, n, r);
if ("normal" === u.type) {
o = r.done ? g : d;
if (u.arg === v) continue;
return {
value: u.arg,
done: r.done
};
}
if ("throw" === u.type) {
o = g;
r.method = "throw";
r.arg = u.arg;
}
}
};
}
function O(t, n) {
var r = n.method, o = t.iterator[r];
if (o === e) {
n.delegate = null;
if ("throw" === r && t.iterator.return) {
n.method = "return";
n.arg = e;
O(t, n);
if ("throw" === n.method) return v;
}
if ("return" !== r) {
n.method = "throw";
n.arg = new TypeError("The iterator does not provide a '" + r + "' method");
}
return v;
}
var i = l(o, t.iterator, n.arg);
if ("throw" === i.type) {
n.method = "throw";
n.arg = i.arg;
n.delegate = null;
return v;
}
var s = i.arg;
if (!s) {
n.method = "throw";
n.arg = new TypeError("iterator result is not an object");
n.delegate = null;
return v;
}
if (!s.done) return s;
n[t.resultName] = s.value;
n.next = t.nextLoc;
if ("return" !== n.method) {
n.method = "next";
n.arg = e;
}
n.delegate = null;
return v;
}
_(S);
u(S, c, "Generator");
u(S, s, function() {
return this;
});
u(S, "toString", function() {
return "[object Generator]";
});
function P(t) {
var e = {
tryLoc: t[0]
};
1 in t && (e.catchLoc = t[1]);
if (2 in t) {
e.finallyLoc = t[2];
e.afterLoc = t[3];
}
this.tryEntries.push(e);
}
function I(t) {
var e = t.completion || {};
e.type = "normal";
delete e.arg;
t.completion = e;
}
function T(t) {
this.tryEntries = [ {
tryLoc: "root"
} ];
t.forEach(P, this);
this.reset(!0);
}
t.keys = function(t) {
var e = Object(t), n = [];
for (var r in e) n.push(r);
n.reverse();
return function t() {
for (;n.length; ) {
var r = n.pop();
if (r in e) {
t.value = r;
t.done = !1;
return t;
}
}
t.done = !0;
return t;
};
};
function x(t) {
if (null != t) {
var n = t[s];
if (n) return n.call(t);
if ("function" == typeof t.next) return t;
if (!isNaN(t.length)) {
var o = -1, i = function n() {
for (;++o < t.length; ) if (r.call(t, o)) {
n.value = t[o];
n.done = !1;
return n;
}
n.value = e;
n.done = !0;
return n;
};
return i.next = i;
}
}
throw new TypeError(typeof t + " is not iterable");
}
t.values = x;
T.prototype = {
constructor: T,
reset: function(t) {
this.prev = 0;
this.next = 0;
this.sent = this._sent = e;
this.done = !1;
this.delegate = null;
this.method = "next";
this.arg = e;
this.tryEntries.forEach(I);
if (!t) for (var n in this) "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e);
},
stop: function() {
this.done = !0;
var t = this.tryEntries[0].completion;
if ("throw" === t.type) throw t.arg;
return this.rval;
},
dispatchException: function(t) {
if (this.done) throw t;
var n = this;
function o(r, o) {
a.type = "throw";
a.arg = t;
n.next = r;
if (o) {
n.method = "next";
n.arg = e;
}
return !!o;
}
for (var i = this.tryEntries.length - 1; i >= 0; --i) {
var s = this.tryEntries[i], a = s.completion;
if ("root" === s.tryLoc) return o("end");
if (s.tryLoc <= this.prev) {
var c = r.call(s, "catchLoc"), u = r.call(s, "finallyLoc");
if (c && u) {
if (this.prev < s.catchLoc) return o(s.catchLoc, !0);
if (this.prev < s.finallyLoc) return o(s.finallyLoc);
} else if (c) {
if (this.prev < s.catchLoc) return o(s.catchLoc, !0);
} else {
if (!u) throw new Error("try statement without catch or finally");
if (this.prev < s.finallyLoc) return o(s.finallyLoc);
}
}
}
},
abrupt: function(t, e) {
for (var n = this.tryEntries.length - 1; n >= 0; --n) {
var o = this.tryEntries[n];
if (o.tryLoc <= this.prev && r.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
var i = o;
break;
}
}
i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
var s = i ? i.completion : {};
s.type = t;
s.arg = e;
if (i) {
this.method = "next";
this.next = i.finallyLoc;
return v;
}
return this.complete(s);
},
complete: function(t, e) {
if ("throw" === t.type) throw t.arg;
if ("break" === t.type || "continue" === t.type) this.next = t.arg; else if ("return" === t.type) {
this.rval = this.arg = t.arg;
this.method = "return";
this.next = "end";
} else "normal" === t.type && e && (this.next = e);
return v;
},
finish: function(t) {
for (var e = this.tryEntries.length - 1; e >= 0; --e) {
var n = this.tryEntries[e];
if (n.finallyLoc === t) {
this.complete(n.completion, n.afterLoc);
I(n);
return v;
}
}
},
catch: function(t) {
for (var e = this.tryEntries.length - 1; e >= 0; --e) {
var n = this.tryEntries[e];
if (n.tryLoc === t) {
var r = n.completion;
if ("throw" === r.type) {
var o = r.arg;
I(n);
}
return o;
}
}
throw new Error("illegal catch attempt");
},
delegateYield: function(t, n, r) {
this.delegate = {
iterator: x(t),
resultName: n,
nextLoc: r
};
"next" === this.method && (this.arg = e);
return v;
}
};
return t;
}("object" == typeof e ? e.exports : {});
try {
regeneratorRuntime = n;
} catch (t) {
"object" == typeof globalThis ? globalThis.regeneratorRuntime = n : Function("n", "regeneratorRuntime=n")(n);
}
cc._RF.pop();
}, {} ]
}, {}, [ "Loading.Controller", "SAT", "base64", "cQRCode", "md5", "msgpack", "runtime", "Audio.Controller", "Config.Dev", "Config.Prod", "Config", "Environment_Enum", "GameInit.Controller", "GameLoad.Controller", "AssetManager", "BrowserUtil", "CanvasResizer", "DeviceInfo", "DisableClick", "EasingEffect", "SnowEffect", "FadeBlur", "Flicker", "FullResponsive", "GameApiOverlayIframe", "Helper", "VisiblePassword", "LocalStorage", "Pagination", "Pagination_item", "ProcessBar", "Switch", "WebIframeHelper", "ZoomScaleEffect", "hoverScale", "rotateNode", "HttpRequest", "Server.WebSocket.App", "Server.WebSocket.Dealer", "Util.Network" ]);