/**
 * Các thao tác gọi api, gửi tin nhắn socket, v.vv
 * nếu lặp đi lặp lại code thì viết ở đây để tái sử dụng
 */

const LocalStorage = require('LocalStorage');
const CONFIG = require('Config');

module.exports = {
    UpdateClientIp: function () {
        if (!cc.CORE.NETWORK.APP.IS_CONNECTED || !cc.CORE.IS_LOGIN) return;
        if (void 0 !== cc.CORE.TASK_REGISTRY.intervalUpdateClientIp) clearInterval(cc.CORE.TASK_REGISTRY.intervalUpdateClientIp);

        const dataUpdate = {
            event: "user",
            data: {
                update_ip: cc.CORE.IP_ADDRESS || null,
                ...(cc.CORE.DEVICE_INFO ? {
                    ...cc.CORE.DEVICE_INFO
                } : {})
            }
        };
        cc.CORE.NETWORK.APP.Send(dataUpdate);
        cc.CORE.TASK_REGISTRY.intervalUpdateClientIp = setInterval(() => {
            cc.CORE.NETWORK.APP.Send(dataUpdate);
        }, 60000);
    },
    UpdateAuth: function (data) {
        if (!cc.CORE.NETWORK.APP.IS_CONNECTED) return;
        if (void 0 !== data.status && data.status) {
            if (void 0 !== data.user) {
                cc.CORE.IS_LOGIN = true;
                cc.CORE.USER = data.user;
            }
        }
    },
    UpdateAuthDumplicate: function (data) {
        // clean token 
        LocalStorage.removeItem("access_token");
        LocalStorage.removeItem("refresh_token");
        cc.CORE.IS_LOGIN = false;
        cc.CORE.USER = {};
        cc.CORE.NETWORK.APP.Connect();
        cc.CORE.GAME_ROOM.clean();
        LocalStorage.removeItem("IN_GAME_ROOM");
        // đưa lại màn lobby
        if (void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo) {
            clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
        }
        cc.director.loadScene("Lobby");
    },
    UpdateScene: function (scene) {
        if (!cc.CORE.NETWORK.APP.IS_CONNECTED || !cc.CORE.IS_LOGIN) return;
        cc.CORE.NETWORK.APP.Send({
            event: "user",
            data: {
                scene: scene
            }
        });
    },
    GetUserInfo: function () {
        if (!cc.CORE.NETWORK.APP.IS_CONNECTED || !cc.CORE.IS_LOGIN) return;
        cc.CORE.NETWORK.APP.Send({
            event: "user",
            data: { get_info: true }
        });
    },
    GetCountNewInbox: function () {
        if (!cc.CORE.NETWORK.APP.IS_CONNECTED || !cc.CORE.IS_LOGIN) return;
        cc.CORE.NETWORK.APP.Send({
            event: "inbox",
            data: { check_new: true }
        });
    },
}