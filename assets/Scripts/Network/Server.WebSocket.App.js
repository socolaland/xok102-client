const LocalStorage = require('LocalStorage');
const CONFIG = require('Config');
const NETWORK_UTIL = require('Util.Network');
const PREFIX = "WebSocket.App";

module.exports = {
    IS_CONNECTED: false,
    IS_CONNECTING: false, // Biến kiểm tra trạng thái đang kết nối, tránh tạo nhiều kết nối đồng thời
    WS: {},
    Connect: function () {
        if (!module.exports.IS_CONNECTED && !module.exports.IS_CONNECTING) {
            module.exports.IS_CONNECTING = true;
            this.WS = null || {};

            let protocol = (CONFIG.WEBSOCKET.APP.IS_SSL) ? "wss://" : "ws://";
            let Connection;

            // Kiểm tra kết nối còn tồn tại, nếu có thì đóng nó trước khi tạo kết nối mới
            if (this.WS && this.WS.readyState === WebSocket.OPEN) {
                console.log(PREFIX + ": Kết nối đang mở, không cần tạo kết nối mới");
                return; // Nếu kết nối đã mở, không làm gì thêm
            }

            if (cc.sys.isBrowser) {
                Connection = new WebSocket(protocol + CONFIG.WEBSOCKET.APP.URL);
            } else {
                Connection = new WebSocket(
                    protocol + CONFIG.WEBSOCKET.APP.URL,
                    null, cc.url.raw("resources/raw/cacert.pem")
                );
            }
            
            this.WS = Connection;
            this.WS.onopen = this._onSocketConnect;
            this.WS.onclose = this._onSocketDisconnect;
            this.WS.onmessage = this._onSocketData;
            this.WS.onerror = this._onSocketError;
        }
    },

    Send: function (message, raw = false) {
        try {
            if (this.WS && this.WS.readyState === WebSocket.OPEN) {
                this.WS.send(raw ? message : JSON.stringify(message));
            }
        } catch (err) {
            cc.log(err);
        }
    },

    _onSocketConnect: function () {
        console.log(PREFIX + ": Websocket connected");
        module.exports.IS_CONNECTED = true;
        module.exports.IS_CONNECTING = false;
        cc.CORE.NETWORK.APP.initAuth();
    },

    _onSocketDisconnect: function (event) {
        module.exports.IS_CONNECTED = false;
        module.exports.IS_CONNECTING = false;
        cc.CORE.IS_LOGIN = false;
        // Kiểm tra và thử kết nối lại sau khi mất kết nối
        setTimeout(() => {
            console.log(PREFIX + ": Trying to reconnect...");
            cc.CORE.NETWORK.APP.Connect();  // Kết nối lại sau khi mất kết nối
        }, 2000); // Thử lại sau 2 giây
    },

    _close: function () {
        console.log(PREFIX + ": Socket close by client!!!");
        module.exports.IS_CONNECTED = false;
        module.exports.IS_CONNECTING = false;
        cc.CORE.IS_LOGIN = false;
        if (this.WS && this.WS.readyState === WebSocket.OPEN) {
            this.WS.close();  // Đảm bảo đóng kết nối WebSocket
        }
    },

    _onSocketData: function (message) {
        const data = JSON.parse(message.data);
        if (data.event === "ping") {
            module.exports._onSocketPing();
        }
        if (data.event === "authentication") {
            if (void 0 !== data.data.auth_dumplicate) {
                cc.CORE.NETWORK.APP.UTIL.UpdateAuthDumplicate(data.data.auth_dumplicate);
            }
            cc.CORE.NETWORK.APP.UTIL.UpdateAuth(data.data);
        }
        if (cc.CORE.GAME_SCENCE) {
            cc.CORE.GAME_SCENCE.onData(data);
        }
    },

    _onSocketError: function (message) {
        module.exports.IS_CONNECTED = false;
        module.exports.IS_CONNECTING = false;
        cc.CORE.IS_LOGIN = false;
        console.log(PREFIX + ": Socket error", JSON.stringify(message));
        setTimeout(() => {
            cc.CORE.NETWORK.APP.Connect();  // Thử kết nối lại sau khi gặp lỗi
        }, 2000); // Thử lại sau 2 giây
    },

    _onSocketPing: function () {
        cc.CORE.NETWORK.APP.Send({
            event: "pong",
            data: { client_time: new Date().toISOString() }
        });
    },

    initAuth: function () {
        const accessToken = LocalStorage.getItem("access_token");
        if (!cc.CORE.IS_LOGIN && accessToken) {
            cc.CORE.NETWORK.APP.Send({
                event: "authentication",
                data: {
                    type: "token",
                    access_token: accessToken
                }
            });
            setTimeout(() => {
                if (cc.CORE && cc.CORE.GAME_SCENCE && typeof cc.CORE.GAME_SCENCE.reConnect === "function") {
                    cc.CORE.GAME_SCENCE.reConnect();
                    cc.CORE.GAME_SCENCE.FastNotify("Đang khôi phục lại kết nối mạng...", "info", 2, 1, true);
                }
            }, 2000);
        }
    },

    UTIL: NETWORK_UTIL
};
