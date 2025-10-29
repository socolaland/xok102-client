const AssetManager = require("AssetManager");
const CONFIG = require('Config');
const HELPER = require('Helper');
const DeviceInfo = require('DeviceInfo');
const WEBSOCKET_APP = require("Server.WebSocket.App");
const WEBSOCKET_DEALER = require("Server.WebSocket.Dealer");
const AUDIO = require("Audio.Controller");

module.exports = {
    initState: () => {
        cc.CORE = {
            initState: () => { },
            ASSET_MANAGER: AssetManager,
            CONFIG,
            UTIL: HELPER,
            NETWORK: {
                APP: WEBSOCKET_APP,
                DEALER: WEBSOCKET_DEALER,
            },
            TASK_REGISTRY: {},
            SETTING: {
                MUSIC: true,
                SOUND: true,
            },
            AUDIO: AUDIO,
            // GAME_PERSIST: {},
            GAME_CONFIG: {},
            GAME_SCENCE: {},
            GAME_ROOM: {
                clean: function () {
                    const clean = this.clean;
                    for (let key in this) if (key !== 'clean') delete this[key];
                    this.clean = clean;
                }
            },
            IS_LOGIN: false,
            USER: {},
            PAYMENT: {
                USER_BANK_ACCOUNT: null,
            },
            DEALER: {
                IS_LOGIN: false,
            },
            IP_ADDRESS: null,
            DEVICE_INFO: DeviceInfo.Get() || {}
        }

        // Lấy IP address khi khởi tạo game
        initClientIP();
    }
};

/**
 * Khởi tạo và lấy IP address của client
 */
function initClientIP() {
    // console.log("[GameInit] Đang lấy IP address...");
    
    // Lấy IP với callback
    HELPER.getClientIp((ip, error) => {
        if (error) {
            // console.warn("[GameInit] Không thể lấy IP address:", error.message);
            // Có thể thử lại sau một khoảng thời gian
            setTimeout(() => {
                retryGetIP();
            }, 5000);
        } else {
            // console.log("[GameInit] Đã lấy được IP address:", ip);
            cc.CORE.IP_ADDRESS = ip;
            
            // Trigger event để các module khác biết IP đã sẵn sàng
            if (cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.triggerEvent) {
                cc.CORE.UTIL.triggerEvent('IP_READY', { ip: ip });
            }
        }
    }, {
        timeout: 8000,  // Timeout dài hơn cho lần đầu
        useWebRTC: true,
        useAPI: true
    });
}

/**
 * Thử lại lấy IP nếu lần đầu thất bại
 */
function retryGetIP() {
    // console.log("[GameInit] Thử lại lấy IP address...");
    
    HELPER.getClientIp((ip, error) => {
        if (error) {
            console.error("[GameInit] Vẫn không thể lấy IP address:", error.message);
            // Có thể set một giá trị mặc định hoặc thông báo lỗi
            cc.CORE.IP_ADDRESS = "unknown";
        } else {
            // console.log("[GameInit] Đã lấy được IP address (retry):", ip);
            cc.CORE.IP_ADDRESS = ip;
            
            // Trigger event
            if (cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.triggerEvent) {
                cc.CORE.UTIL.triggerEvent('IP_READY', { ip: ip });
            }
        }
    }, {
        timeout: 5000,
        useWebRTC: false,  // Chỉ dùng API cho retry
        useAPI: true
    });
}

/**
 * Lấy IP address hiện tại (sync)
 * @returns {string|null} IP address hoặc null nếu chưa có
 */
function getCurrentIP() {
    return cc.CORE ? cc.CORE.IP_ADDRESS : null;
}

/**
 * Đợi IP address sẵn sàng
 * @param {Function} callback - Callback khi IP sẵn sàng
 * @param {number} timeout - Timeout (ms), mặc định 10000
 */
function waitForIP(callback, timeout = 10000) {
    if (!callback) return;
    
    // Nếu đã có IP
    if (cc.CORE && cc.CORE.IP_ADDRESS && cc.CORE.IP_ADDRESS !== "unknown") {
        callback(cc.CORE.IP_ADDRESS);
        return;
    }
    
    // Đợi event IP_READY
    const eventHandler = (event) => {
        if (event.detail && event.detail.ip) {
            callback(event.detail.ip);
            // Remove listener sau khi nhận được IP
            if (cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.off) {
                cc.CORE.UTIL.off('IP_READY', eventHandler);
            }
        }
    };
    
    // Thêm listener
    if (cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.on) {
        cc.CORE.UTIL.on('IP_READY', eventHandler);
    }
    
    // Timeout fallback
    setTimeout(() => {
        if (cc.CORE && cc.CORE.UTIL && cc.CORE.UTIL.off) {
            cc.CORE.UTIL.off('IP_READY', eventHandler);
        }
        callback(null);
    }, timeout);
}

// Export các hàm utility
module.exports.getCurrentIP = getCurrentIP;
module.exports.waitForIP = waitForIP;