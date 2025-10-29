const LocalStorage = require("LocalStorage");
const AssetManager = require("AssetManager");
const Audio = require('Lobby.Audio.Controller');
const Header = require('Lobby.Header.Controller');
const News = require('Lobby.News.Controller');
const MenuGame = require('Lobby.Menu_Game.Controller');
const Banner = require('Lobby.Banner.Controller');


cc.Class({
    extends: cc.Component,

    properties: {
        Audio: Audio,
        Header: Header,
        MenuGame: MenuGame,
        News: News,
        Banner: Banner,
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
        MainWebview: cc.Node,
    },
    start: function () {
        cc.CORE.AUDIO.playMusic(this.Audio.bgMusic);
        // reinit banner
        this.News.setFixedNews();
        this.Banner.setSlide();

        cc.CORE.TASK_REGISTRY.intervalGetUserInfo = setInterval(() => {
            cc.CORE.NETWORK.APP.UTIL.GetUserInfo();
        }, 5000);
    },
    init(obj) {
        cc.CORE.GAME_SCENCE = this;
    },
    onEnable: function () {
        cc.CORE.NETWORK.APP.UTIL.UpdateScene("LOBBY");
        cc.CORE.NETWORK.APP.UTIL.GetUserInfo();
        cc.CORE.NETWORK.APP.UTIL.GetCountNewInbox();
        cc.CORE.GAME_ROOM.clean();

        this.is_in_game_room = false;
        this.checkInGameRoom();

        // setTimeout(() => {
        //     try {
        //         if (cc.sys.isNative && cc.CORE.UTIL.isDynamicDevice()) this.FixScreenNative();
        //         cc.CORE.GAME_SCENCE.node.getComponent(cc.Mask).enabled = (cc.sys.isNative && cc.CORE.UTIL.isDynamicDevice()) ? false : true;
        //     } catch (e) {
        //         cc.log(e);
        //     }
        //     // cc.CORE.GAME_SCENCE.node.getComponent(cc.Mask).enabled = (cc.sys.isNative && cc.CORE.UTIL.isDynamicDevice()) ? false : true;
        // }, 2000);
    },
    onLoad: function () {
        const seft = this;
        cc.CORE.GAME_SCENCE = this;
        // connect server
        if (!cc.CORE.NETWORK.APP.IS_CONNECTED) cc.CORE.NETWORK.APP.Connect();

        // Init Component
        this.MenuGame.init(this);
        this.Banner.init(this);
        this.News.init(this);
        this.InitPopupPrefab();
        this.InitLoadingPrefab();

        // Make btn_contact Can Move
        this.btn_contact.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.btn_contact.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.btn_contact.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btn_contact.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // Khởi tạo biến để theo dõi trạng thái di chuyển
        this.isDragging = false;
        this.touchOffset = cc.v2(0, 0);


        // khởi tạo hiển thị popup người chơi mới
        this.isShowPopupNewMember = false;

    },

    FixScreenNative: function () {
        let y_PosBonus = 90;
        this.Header.node.setPosition(cc.v2(0, this.Header.node.position.y - y_PosBonus));
        this.Banner.node.setPosition(cc.v2(0, this.Banner.node.position.y - y_PosBonus));
        this.BodyMain.setPosition(cc.v2(0, this.BodyMain.position.y - y_PosBonus));
    },

    checkInGameRoom: function () {
        const inGameRoom = LocalStorage.getItem("IN_GAME_ROOM");
        if (inGameRoom) {
            this.is_in_game_room = true;
            const inGameRoomData = JSON.parse(inGameRoom);
            cc.CORE.GAME_ROOM.GAME_CODE = inGameRoomData.game_code;
            cc.CORE.GAME_ROOM.ROOM_CODE = inGameRoomData.room_code;
            cc.CORE.GAME_ROOM.ROOM_PASSSWORD = inGameRoomData.room_password;
        }
    },

    // CONNECTION DATA
    onData: function (data) {
        if (void 0 !== data.event) {
            switch (data.event) {
                case "init_config":
                    this.onDataInitConfig(data.data);
                    break;
                case "authentication":
                    this.onDataAuth(data.data);
                    break;
                case "notification":
                    this.onDataNotify(data.data);
                    break;
                case "user":
                    if (void 0 !== data.data.set_nickname) cc.PopupRegNickname.hidePopup();
                    this.onDataUser(data.data.user);
                    break;
                case "game":
                    this.onDataGame(data.data);
                    break;
                case "inbox":
                    if (void 0 !== data.data.new_inbox) {
                        this.Header.onDataNewInbox(data.data.new_inbox);
                    } else {
                        this.Popup.Inbox.onData(data.data);
                    }
                    break;
                case "history_bet":
                    this.Popup.HistoryBet.onData(data.data);
                    break;
                case "event":
                    this.Popup.Event.onData(data.data);
                    break;
            }
        }
    },
    onDataInitConfig: function (data) {
        cc.CORE.GAME_CONFIG = { ...cc.CORE.GAME_CONFIG, ...data };
        this.News.setFixedNews();
        this.Banner.setSlide();
    },
    onDataAuth: function (data) {
        if (void 0 !== data.status) {
            if (data.status) {
                if (void 0 !== data.user) {
                    this.Header.onDataAuth(data.user);
                    cc.CORE.IS_LOGIN = true;
                    cc.CORE.USER = data.user;
                    this.Header.setHeader();
                    if (!cc.CORE.USER.nickname || cc.CORE.USER.nickname == null) {
                        this.showPopupRegNickname();
                    }
                }
                this.FastNotify(data.message || "Đăng nhập thành công!", "info", 1);
                cc.CORE.NETWORK.APP.UTIL.GetCountNewInbox();

                // check is dealer
                if (data.user.account_type == "dealer") {
                    if (!cc.CORE.NETWORK.DEALER.IS_CONNECTED) cc.CORE.NETWORK.DEALER.Connect();
                }

                // update ip
                cc.CORE.NETWORK.APP.UTIL.UpdateClientIp();
            } else {
                this.FastNotify(data.message, "error");
            }
        }
    },
    onDataUser: function (data) {
        // update user data
        cc.CORE.USER = { ...cc.CORE.USER, ...data };
        this.Header.onDataAuth(data);
    },
    onDataNotify: function (data) {
        if (void 0 !== data.notify_data) {
            if (void 0 !== data.notify_type) {
                const notifyTime = (void 0 !== data.notify_data.time) ? data.notify_data.time : 1;
                this.FastNotify(data.notify_data.message, data.notify_data.type, notifyTime);
            }
        }
    },
    onDataGame: function (data) {
        if (void 0 !== data.xocdia) {
            const dataGame = data.xocdia.data;
            if (void 0 !== dataGame.join && !!dataGame.join.join && dataGame.join.room_code) {
                cc.CORE.GAME_ROOM.GAME_CODE = "XOCDIA";
                cc.CORE.GAME_ROOM.ROOM_CODE = dataGame.join.room_code;
                cc.CORE.GAME_ROOM.ROOM_PASSSWORD = dataGame.join.room_password;

                LocalStorage.setItem("IN_GAME_ROOM", JSON.stringify({
                    game_code: cc.CORE.GAME_ROOM.GAME_CODE,
                    room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                    room_password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD,
                }));

                this.MenuGame.closeDialog_Xocdia_Select_Room();
                this.MenuGame.openGame(null, cc.CORE.GAME_ROOM.GAME_CODE);
            }
            if (void 0 !== dataGame.join && !dataGame.join.join) {
                LocalStorage.removeItem("IN_GAME_ROOM"); // xóa nếu vào thất bại!
                cc.CORE.UTIL.showLoading(0);
            }
        }

        if (void 0 !== data.sicbo) {
            const dataGame = data.sicbo.data;
            if (void 0 !== dataGame.join && !!dataGame.join.join && dataGame.join.room_code) {
                cc.CORE.GAME_ROOM.GAME_CODE = "SICBO";
                cc.CORE.GAME_ROOM.ROOM_CODE = dataGame.join.room_code;
                cc.CORE.GAME_ROOM.ROOM_PASSSWORD = dataGame.join.room_password;

                LocalStorage.setItem("IN_GAME_ROOM", JSON.stringify({
                    game_code: cc.CORE.GAME_ROOM.GAME_CODE,
                    room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                    room_password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD,
                }));
                this.MenuGame.openGame(null, cc.CORE.GAME_ROOM.GAME_CODE);
            }
            if (void 0 !== dataGame.join && !dataGame.join.join) {
                LocalStorage.removeItem("IN_GAME_ROOM"); // xóa nếu vào thất bại!
                cc.CORE.UTIL.showLoading(0);
            }
        }
    },


    /***** INIT PREFAB  */
    InitPopupPrefab: function () {
        // return;
        AssetManager.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Lobby.Popup", cc.Prefab)
            .then(prefab => {
                let node = cc.instantiate(prefab);
                node.name = "Lobby.Popup";
                const nodeComp = node.getComponent('Lobby.Popup.Controller');
                this.Popup = nodeComp;
                nodeComp.init(this);
                this.prefabNode.addChild(node);

                // add z order for loading prefab

                const loadingOverlay = this.prefabNode.getChildByName("Loading.Overlay");
                if (loadingOverlay) cc.CORE.UTIL.setNodeZOrder.setToFront(loadingOverlay);
            })
            .catch(err => console.log("❌ Error loading prefab:", err));
    },

    InitLoadingPrefab: function () {
        cc.CORE.UTIL["isLoadingShowing"] = false;

        AssetManager.loadFromBundle("Lobby_Bundle", "Prefabs/Loading/Loading.Overlay", cc.Prefab)
            .then(prefab => {
                let node = cc.instantiate(prefab);
                node.name = "Loading.Overlay";
                this.prefabNode.addChild(node);

                const statePercentNode = node.getChildByName("Loading_State");

                cc.CORE.UTIL["showLoading"] = function (bool, percentShow = false) {
                    try {
                        cc.CORE.UTIL["isLoadingShowing"] = bool;
                        node.active = bool;
                        if (percentShow && statePercentNode) {
                            statePercentNode.active = true;
                        } else {
                            statePercentNode.active = false;
                            statePercentNode.getChildByName("text_percent").getComponent('cc.Label').string = "0%";
                        }
                    } catch (e) {
                        cc.CORE.UTIL["isLoadingShowing"] = false;
                        cc.log(e);
                    }
                }
                cc.CORE.UTIL["setLoadingPercent"] = function (percent) {
                    try {
                        if (statePercentNode) {
                            statePercentNode.active = true;
                            statePercentNode.getChildByName("text_percent").getComponent('cc.Label').string = percent + "%";
                        }
                    } catch (e) {
                        cc.log(e);
                    }
                }
            })
            .catch(err => console.log("❌ Error loading prefab:", err));
    },
    showPopupRegNickname: function () {
        AssetManager.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Auth/RegNickname/Lobby.Popup.RegNickname", cc.Prefab)
            .then(prefab => {
                let node = cc.instantiate(prefab);
                node.name = "Lobby.Popup.RegNickname";
                this.prefabNode.addChild(node);
                const nodeComp = node.getComponent('Lobby.Popup.RegNickname.Controller');
                cc.PopupRegNickname = nodeComp;
            })
            .catch(err => console.log("❌ Error loading prefab:", err));
    },

    /***** SHOW POPUP  */
    showPopup: function (event, popupName) {
        if (this?.Popup?.show) this.Popup.show(popupName);
    },
    showMaintance: function () {
        this.FastNotify("Tính năng sẽ sớm ra mắt!", "info", 1);
    },
    showToggleHistory: function () {
        try {
            const nodeUser = cc.find("Canvas/MainGame/Header_Container/User_Container");
            const nodeHistory = cc.find("Canvas/MainGame/Header_Container/User_Container/Menu_Action/box_history_action");
            if (nodeUser && nodeHistory) {
                nodeUser.zIndex = 999999999;
                nodeHistory.active = !nodeHistory.active;
            }
        } catch (e) {
            cc.log(e);
        }
    },
    toggleNodeWhenClick: function (event) {
        const node = event.target;
        if (node) node.active = !node.active;
    },

    /**** HELPER */
    FastNotify: function (text = '', type = 'success', showTime = 3, animationTime = 0.5, force = true) {
        // không hiển thị notify khi đang loading
        if (cc.CORE.UTIL["isLoadingShowing"]) return;

        // remove old notify
        if (force) this.prefabNode.children.map((node, index) => {
            try {
                if (node.name == "Mini_Notify" && cc.isValid(node)) node.destroy();
            } catch (e) {
                cc.log(e);
            }
        });
        const notificationPrefab = cc.instantiate(this.miniNotifyPrefab);
        const noticeComponent = notificationPrefab.getComponent('Lobby.Fast_Notify.Controller');
        noticeComponent.init({
            text, type, showTime, animationTime
        });
        this.prefabNode.addChild(notificationPrefab);
    },
    PlayClick: function () {
        cc.CORE.AUDIO.playSound(this.Audio.click);
    },
    PlayMusic: function () {
        cc.CORE.AUDIO.playMusic(this.Audio.bgMusic);
    },
    onClickContact: function (event, customEventData = "TELEGRAM_GROUP") {
        // const type = customEventData;
        // const contact = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[type];
        // // Kiểm tra xem contact có hợp lệ không
        // if (contact && contact !== "" && contact !== null) {
        //     // Mở URL ngay lập tức khi người dùng click vào button
        //     cc.sys.openURL(contact);
        // } else {
        //     this.FastNotify(contact ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
        // }
        cc.CORE.GAME_SCENCE.Popup.Contact.toggle();
    },
    update(dt) {
        this.Header.setHeader();

        if (this.is_in_game_room) {
            if (void 0 !== cc.CORE.UTIL.showLoading && typeof cc.CORE.UTIL.showLoading == "function" && cc.CORE.IS_LOGIN) {
                this.is_in_game_room = false;
                cc.CORE.UTIL.showLoading(1);
                setTimeout(() => {
                    cc.CORE.NETWORK.APP.Send({
                        event: "game",
                        data: {
                            [cc.CORE.GAME_ROOM.GAME_CODE.toLowerCase()]: {
                                join: {
                                    room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                                    password: cc.CORE.GAME_ROOM.ROOM_PASSSWORD
                                }
                            }
                        }
                    });
                }, 1000);
                setTimeout(() => {
                    cc.CORE.UTIL.showLoading(0);
                }, 10000);
            }
        } else {
            // show popup event recommend
            if (void 0 !== cc.CORE.GAME_SCENCE.Popup && void 0 !== cc.CORE.GAME_SCENCE.Popup.NewMember && cc.CORE.IS_LOGIN) {
                if (!this.isShowPopupNewMember) {
                    this.isShowPopupNewMember = true;
                    // show popup event recommend
                    cc.CORE.GAME_SCENCE.Popup.NewMember.setShow();
                }
            }
        }
    },

    // Phương thức xử lý khi bắt đầu chạm
    onTouchStart: function (event) {
        this.isDragging = true;

        // Lấy vị trí touch trong không gian world
        const touchPos = event.getLocation();

        // Tính toán offset giữa vị trí touch và vị trí node
        const nodeWorldPos = this.btn_contact.convertToWorldSpaceAR(cc.v2(0, 0));
        this.touchOffset = cc.v2(
            touchPos.x - nodeWorldPos.x,
            touchPos.y - nodeWorldPos.y
        );

        // Thay đổi opacity để thể hiện đang được chọn
        this.btn_contact.opacity = 180;
    },

    // Phương thức xử lý khi di chuyển touch
    onTouchMove: function (event) {
        if (!this.isDragging) return;

        // Lấy vị trí touch mới
        const touchPos = event.getLocation();

        // Tính toán vị trí mới cho node (trừ đi offset)
        const newWorldPos = cc.v2(
            touchPos.x - this.touchOffset.x,
            touchPos.y - this.touchOffset.y
        );

        // Chuyển đổi từ world space về local space của parent
        const newLocalPos = this.btn_contact.parent.convertToNodeSpaceAR(newWorldPos);

        // Cập nhật vị trí node
        this.btn_contact.setPosition(newLocalPos);
    },

    // Phương thức xử lý khi kết thúc touch
    onTouchEnd: function (event) {
        if (!this.isDragging) return;

        this.isDragging = false;

        // Khôi phục opacity về bình thường
        this.btn_contact.opacity = 255;
    },



    // === WEBVIEW === //
    onClickDestroyWebview: function () {
        if (cc.CORE.SETTING.MUSIC) cc.CORE.AUDIO.playMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic);
        cc.CORE.GAME_SCENCE.PlayClick();
        this.MainWebview.active = false;

        try {
            const comp = this.MainWebview.children[1].children[0].getComponent(cc.WebView);
            comp.url = "";
            comp.stopLoading && comp.stopLoading();
            // comp.destroy && comp.destroy();
        } catch (e) {
            console.log(e);
        }
    },

});