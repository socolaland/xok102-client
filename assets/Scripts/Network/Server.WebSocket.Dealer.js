const LocalStorage = require('LocalStorage');
const CONFIG = require('Config');
const NETWORK_UTIL = require('Util.Network');
const PREFIX = "WebSocket.Dealer";

module.exports = {
    IS_CONNECTED: false,
    IS_CONNECTING: false, // Biến kiểm tra trạng thái đang kết nối, tránh tạo nhiều kết nối đồng thời
    WS: {},
    Connect: function () {
        if (!module.exports.IS_CONNECTED && !module.exports.IS_CONNECTING) {
            module.exports.IS_CONNECTING = true;
            this.WS = null || {};

            let protocol = (CONFIG.WEBSOCKET.DEALER.IS_SSL) ? "wss://" : "ws://";
            let Connection;

            // Kiểm tra kết nối còn tồn tại, nếu có thì đóng nó trước khi tạo kết nối mới
            if (this.WS && this.WS.readyState === WebSocket.OPEN) {
                console.log(PREFIX + ": Kết nối đang mở, không cần tạo kết nối mới");
                return; // Nếu kết nối đã mở, không làm gì thêm
            }

            if (cc.sys.isBrowser) {
                Connection = new WebSocket(protocol + CONFIG.WEBSOCKET.DEALER.URL);
            } else {
                Connection = new WebSocket(
                    protocol + CONFIG.WEBSOCKET.DEALER.URL,
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
        cc.CORE.NETWORK.DEALER.initAuth();
    },

    _onSocketDisconnect: function (event) {
        module.exports.IS_CONNECTED = false;
        module.exports.IS_CONNECTING = false;
        // Kiểm tra và thử kết nối lại sau khi mất kết nối
        setTimeout(() => {
            console.log(PREFIX + ": Trying to reconnect...");
            cc.CORE.NETWORK.DEALER.Connect();  // Kết nối lại sau khi mất kết nối
        }, 2000); // Thử lại sau 2 giây
    },

    _close: function () {
        console.log(PREFIX + ": Socket close by client!!!");
        module.exports.IS_CONNECTED = false;
        module.exports.IS_CONNECTING = false;
        if (this.WS && this.WS.readyState === WebSocket.OPEN) {
            this.WS.close();  // Đảm bảo đóng kết nối WebSocket
        }
    },

    _onSocketData: function (message) {
        const data = JSON.parse(message.data);
        cc.log(data);
        if (data?.data?.ping) {
            module.exports._onSocketPing();
        }
        if (cc.CORE.GAME_SCENCE) {
            cc.CORE.GAME_SCENCE.onData(data);
        }
    },

    _onSocketError: function (message) {
        module.exports.IS_CONNECTED = false;
        module.exports.IS_CONNECTING = false;
        console.log(PREFIX + ": Socket error", JSON.stringify(message));
        setTimeout(() => {
            cc.CORE.NETWORK.DEALER.Connect();  // Thử kết nối lại sau khi gặp lỗi
        }, 2000); // Thử lại sau 2 giây
    },

    _onSocketPing: function () {
        cc.CORE.NETWORK.DEALER.Send({
            event: "pong",
            data: { client_time: new Date().toISOString() }
        });
    },
    //=== JOIN LẠI ROOM ====//
    initAuth: function () {
        if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
            if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
                // set dealer info for socket dealer
                if (cc.CORE.USER && cc.CORE.USER?.username) {
                    cc.CORE.NETWORK.DEALER.Send({
                        "event": "set_dealer_info",
                        "data": cc.CORE.USER
                    });
                }

                // set game room
                if (cc.CORE.GAME_ROOM?.GAME_CODE && cc.CORE.GAME_ROOM?.ROOM_CODE) {
                    cc.CORE.NETWORK.DEALER.Send({
                        "event": "dealer_join_room",
                        "data": {
                            "game": cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
                            "room_code": cc.CORE.GAME_ROOM.ROOM_CODE
                        }
                    });
                }
            }
        }
    },

    UTIL: NETWORK_UTIL
};
