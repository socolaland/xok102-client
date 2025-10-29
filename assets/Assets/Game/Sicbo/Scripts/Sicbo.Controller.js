const LocalStorage = require('LocalStorage');
const AssetManager = require("AssetManager");
const Audio = require("Sicbo.Audio.Controller");
//==== DEALER MANAGER GAME ==//
const KeyboardManager = require("Sicbo.KeyBoardManager");
const DealerKeyboardManager = require("Sicbo.Dealer.KeyBoardManager");

require('Sicbo.Init.Util')();
const ClockOverlayManager = require('Sicbo.ClockOverlayManager');
const PlayerCountOverlayManager = require('Sicbo.PlayerCountOverlayManager');
const ResultDotOverlayManager = require('Sicbo.ResultDotOverlayManager');

const SicboPopup = require("Sicbo.Popup.Controller");
const SicboChat = require("Sicbo.Chat.Controller");
const SicboNotify = require('Sicbo.Notify.Controller');
const SicboSoiCau = require('Sicbo.ThongKe.SoiCau.Controller');
const SicboSoiCau2 = require('Sicbo.ThongKe.SoiCau.Controller');


cc.Class({
        extends: cc.Component,

        properties: {
                Audio: Audio,
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
                // resources
                diceSprite: {
                        default: [],
                        type: cc.SpriteFrame
                },

                // user data, room
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

                // game result show
                gameDicesResult: {
                        type: cc.Node,
                        default: null
                },
                gamePlayerCount: {
                        type: cc.Label,
                        default: null
                },

                // chip bet show on game table
                gameNodeChipBet: {
                        default: [],
                        type: cc.Node
                },

                gameBetBoardNode: {
                        type: cc.Node,
                        default: null
                },

                // bet button
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


                //  other
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
                SicboPopup: SicboPopup,
                SicboSoiCau: SicboSoiCau,
                SicboSoiCau2: SicboSoiCau2,
                SicboChat: SicboChat,
                SicboNotify: SicboNotify
        },
        start: function () {
                // cc.CORE.AUDIO.playSound(this.Audio.bgMusic);
        },
        init(obj) {
                cc.CORE.GAME_SCENCE = this;
        },

        onLoad: function () {
                const seft = this;
                cc.CORE.GAME_SCENCE = this;
                // Khởi tạo lắng nghe bàn phím (chỉ gọi 1 lần, ví dụ trong onLoad của main scene)
                KeyboardManager.init();

                this.pageBetShow = 0;

                this.gameNodeBet.forEach((node, index) => node.on(cc.Node.EventType.TOUCH_END, this.PlayChipBet, this));
                this.gameNodeBet.forEach((node, index) => node.on(cc.Node.EventType.TOUCH_END, this.onClickBet, this));

                //     // thêm sự kiện click vào danh sách chip
                this.gameNodeChipBet.forEach((chip, index) => {
                        chip.on(cc.Node.EventType.TOUCH_END, this.onChangerSelectChipShow, this);
                });

                this.username_sidebar.string = cc.CORE.USER.nickname ? cc.CORE.USER.nickname.toUpperCase() : cc.CORE.USER.username.toUpperCase();

                // iframe overlay
                this.isIframeOverlayCreated = false;

                // log position video stream
                this.positionVideoStream = this.VideoStream.node.position;
                window.addEventListener('resize', () => {
                        this.positionVideoStream = this.VideoStream.node.position;
                });

                this.ROOM = {};
                this.user_balance = 0;
                this.gameLogs = [];
                this.gameState = null;
                this.newInGame = true;
                this.newInGameSetDiceResult = false;
                this.audioStatus = true;
                this.amountCurrent = 10000;
                this.amountRefurn = 0;

                this.gameNodeBetMap = new Map();
                this.gameNodeBet.forEach(node => this.gameNodeBetMap.set(node.name, node));

                this.SicboPopup.init(this);
                this.SicboSoiCau.init(this);
                this.SicboSoiCau2.init(this);
                this.SicboChat.init(this);
                this.sideBar.getComponent('Sicbo.Sidebar.Controller').init(this);

                this.isCheckPopupOpen = true;
                this.isPopupOpen = false;
                this.currentPopupOpen = null;
                this.InitPopupPrefab();

                // Lắng nghe sự kiện chuyển trang của PageView để cập nhật dot pagination
                this.pageViewComponent = this.gameBetBoardNode.getComponent(cc.PageView);
                if (this.pageViewComponent) {
                        this.pageViewComponent.node.on('page-turning', (event) => {
                                let index = this.pageViewComponent.getCurrentPageIndex();
                                this.showPageBetByIndex(index);
                        });
                }

                // === DEALER LOCKED SEND ===/
                this.DealerLockedPressKey = false;
        },


        onEnable: function () {
                // sound welcome
                cc.CORE.AUDIO.playSound(this.Audio.welcome);
                cc.CORE.NETWORK.APP.UTIL.UpdateScene("SICBO");

                setTimeout(() => {
                        if (cc.sys.isNative) this.FixScreenNative();
                }, 200);

                //== DEALER JOIN ROOM ==//
                if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
                        if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
                                cc.CORE.NETWORK.DEALER.Send({
                                        "event": "dealer_join_room",
                                        "data": {
                                                "game": cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
                                                "room_code": cc.CORE.GAME_ROOM.ROOM_CODE
                                        }
                                });
                        }
                }

                this.OffWinNode();
                this.SetDiceResult(false);
                this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
                this.setCurrentMeBetAmountNodeBet(true);

                this.getRoomConfig();
                this.getUserInfo();
                this.getMeBet();
                this.getLogs();
                this.getChat();

                this.intervalCheckUserInfo = setInterval(() => {
                        if (cc.CORE.NETWORK.APP.IS_CONNECTED && cc.CORE.IS_LOGIN) this.getUserInfo();
                }, 5000);

                this.ClockOverlayManager = ClockOverlayManager;
                this.PlayerCountOverlayManager = PlayerCountOverlayManager;
                this.ResultDotOverlayManager = ResultDotOverlayManager;

        },

        FixScreenNative: function () {
                cc.log("FixScreenNative");
                // if (cc.sys.isNative) {
                //     this.VideoStream.node.setPosition(cc.v2(0, this.positionVideoStream.y * 3));
                // }
                // hạ xuống 1 chút
                let y_PosBonus = 90;
                let last_PosBonus = this.VideoStream.node.position.y;
                this.VideoStream.node.setPosition(cc.v2(0, last_PosBonus - y_PosBonus));
                this.GameMain.setPosition(cc.v2(0, this.GameMain.position.y - y_PosBonus));
        },


        /***** INIT PREFAB  */
        InitPopupPrefab: function () {
                AssetManager.loadFromBundle("Lobby_Bundle", "Prefabs/Popup/Lobby.Popup", cc.Prefab)
                        .then(prefab => {
                                try {
                                        let node = cc.instantiate(prefab);
                                        node.name = "Lobby.Popup";
                                        const nodeComp = node.getComponent('Lobby.Popup.Controller');
                                        this.PopupLobby = nodeComp;
                                        nodeComp.init(this);
                                        this.prefabNode.addChild(node);
                                } catch (error) {
                                        // console.log(error)
                                }
                        })
                        .catch(err => console.error("❌ Error loading prefab:", err));
        },

        /**** GET DATA */
        getRoomConfig: function () {
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
        getUserInfo: function () {
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
        getMeBet: function () {
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
        getLogs: function (limit = 100) {
                cc.CORE.NETWORK.APP.Send({
                        event: "game",
                        data: {
                                sicbo: {
                                        get_logs: {
                                                room_code: cc.CORE.GAME_ROOM.ROOM_CODE, limit
                                        }
                                }
                        }
                });
        },
        getChat: function () {
                cc.CORE.NETWORK.APP.Send({
                        event: "game",
                        data: {
                                sicbo: {
                                        chat: {
                                                get_chat: { room_code: cc.CORE.GAME_ROOM.ROOM_CODE }
                                        }
                                }
                        }
                });
        },


        /*** CONNECTION DATA  */
        onData: function (data) {
                // console.log(data)
                if (void 0 !== data.event && data.event == "game") {
                        if (void 0 !== data.data.sicbo) this.Sicbo(data.data.sicbo);
                }
                if (void 0 !== data.event && data.event == "history_bet") {
                        if (void 0 !== data.data) this.PopupLobby.HistoryBet.onData(data.data);
                }
                if (void 0 !== data.event && data.event == "notification") this.onDataNotify(data.data);
                if (void 0 !== data.event && data.event == "user") {
                        const gameData = data.data;
                        if (void 0 !== gameData.user && void 0 !== gameData.user.balance) {
                                cc.log(gameData.user.balance);
                                if (this.ROOM.room_type == "public") {
                                        this.user_balance = gameData.user.balance;
                                        this.balance.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
                                        if (this.user_balance.toString().length >= 9) {
                                                this.balance_sidebar.string = cc.CORE.UTIL.abbreviateNumber(this.user_balance, 2);
                                        } else {
                                                this.balance_sidebar.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
                                        }
                                }
                        }
                        if (void 0 !== gameData.user && void 0 !== gameData.user.verify && void 0 !== gameData.user.phone) {
                                if (gameData.user.verify && gameData.user.phone !== null) {
                                        cc.CORE.USER = { ...cc.CORE.USER, ...gameData.user };
                                }
                        }
                }
        },
        onDataNotify: function (data) {
                if (void 0 !== data.notify_data) {
                        if (void 0 !== data.notify_type && data.notify_type == "common") {
                                const notifyTime = (void 0 !== data.notify_data.time) ? data.notify_data.time : 1;
                                this.FastNotify(data.notify_data.message, data.notify_data.type, notifyTime, false);
                        }
                        if (void 0 !== data.notify_type && data.notify_type == "transfer") {
                                this.FastNotify(data.notify_data.message, data.notify_data.type, notifyTime, true);
                        }
                        if (void 0 !== data.notify_type && data.notify_type == "notify") {
                                this.SicboNotify.showNotify("Thông báo", data.notify_data.message);
                        }
                        if (void 0 !== data.notify_type && data.notify_type == "sicbo") {
                                const notifyTime = (void 0 !== data.notify_data.time) ? data.notify_data.time : 1;
                                this.FastNotifySicbo(data.notify_data.message, data.notify_data.type, notifyTime, false);
                        }
                }
        },
        Sicbo: function (data) {
                const gameData = data.data;
                if (void 0 !== gameData.get_info_room) {
                        this.ROOM = { ...this.ROOM, ...gameData.get_info_room };
                        this.setupRoom(gameData.get_info_room);
                }
                if (void 0 !== gameData.request_join) {
                        this.SicboPopup.show("request_join_room", gameData.request_join);
                }
                if (void 0 !== gameData.leave && !!gameData.leave.leave) {
                        this.outGameByServer(gameData.leave);
                }
                if (void 0 !== gameData.owner_leave) {
                        this.SicboPopup.show("owner_leave");
                }
                if (void 0 !== gameData.get_logs) {
                        this.gameLogs = gameData.get_logs.data;
                        this.gameLogCounts = {
                                tai: gameData.get_logs.total_big,
                                xiu: gameData.get_logs.total_small,
                        };
                        this.SicboSoiCau.setThongKe();
                        this.SicboSoiCau2.setThongKe();
                }
                if (void 0 !== gameData.user) {
                        if (void 0 !== gameData.user.balance) {
                                this.user_balance = gameData.user.balance;
                                this.balance.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
                                if (this.user_balance.toString().length >= 9) {
                                        this.balance_sidebar.string = cc.CORE.UTIL.abbreviateNumber(this.user_balance, 4);
                                } else {
                                        this.balance_sidebar.string = cc.CORE.UTIL.numberWithCommas(this.user_balance);
                                }
                        }
                }
                if (void 0 !== gameData.session) {
                        this.ROOM.session = gameData.session;
                        // this.session_sidebar.string = "#" + gameData.session;
                }
                if (void 0 !== gameData.time_remain) {
                        this.time_remain.string = cc.CORE.UTIL.numberPad(gameData.time_remain, 2);
                        ClockOverlayManager.setText(cc.CORE.UTIL.numberPad(gameData.time_remain, 2));

                        if (gameData.time_remain == 0 && this.gameState == "start_bet") {
                                setTimeout(() => {
                                        cc.CORE.AUDIO.playSound(this.Audio.stop_bet);
                                }, 1500);
                        }
                }
                //=== SET STATE GAME ====//
                if (void 0 !== gameData.state) {
                        this.gameState = gameData.state;
                }
                if (void 0 !== gameData.finish) {
                        this.cleanFastNotify();
                        this.cleanFastNotifySicbo();
                        if (void 0 !== gameData.finish.door_win) {
                                this.SetWinNode(gameData.finish.door_win);
                        }
                        if (void 0 !== gameData.finish.results) {
                                this.SetDiceResult(true, gameData.finish.results);
                                this.SetDiceResultSound(true, gameData.finish.results);
                        }
                        this.getLogs();

                        setTimeout(() => {
                                this.OffWinNode();
                                this.SetDiceResult(false);
                                this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
                                this.setCurrentMeBetAmountNodeBet(true);
                                this.total_bet.string = 0;
                        }, 5000);
                }
                if (void 0 !== gameData.new_game && !!gameData.new_game) {
                        this.OffWinNode();
                        this.SetDiceResult(false);
                        this.setDefaultCurrentBetAmountNodeBet(this.gameNodeBet);
                        this.setCurrentMeBetAmountNodeBet(true);
                        this.total_bet.string = 0;
                        cc.CORE.AUDIO.playSound(this.Audio.start_normal_bet);
                }
                if (void 0 !== gameData.bet_data) {
                        const bet_data = gameData.bet_data;

                        if (void 0 !== bet_data.bet_door_amount) {
                                this.setUsersBetCurrent(bet_data.bet_door_amount);
                        }
                        if (void 0 !== bet_data.bet_door_player) {
                                // player count
                        }
                }
                if (void 0 !== gameData.me_bet) {
                        const bet_data = gameData.me_bet;
                        if (void 0 !== bet_data.bet_door) {
                                this.setMebetCurrent(bet_data.bet_door);
                        }
                }
                if (void 0 !== gameData.bet_status && !!gameData.bet_status) {
                        this.getMeBet();
                }
                if (void 0 !== gameData.call_update && !!gameData.call_update) {
                        this.getUserInfo();
                        this.getMeBet();
                }
                if (void 0 !== gameData.refurn) {
                        this.amountRefurn += gameData.refurn.refurn;
                        if (void 0 !== this.taskRefurn) clearTimeout(this.taskRefurn);
                        this.taskRefurn = setTimeout(() => {
                                this.TextMoneyFly(true, this.amountRefurn, "Hoàn");
                                cc.CORE.AUDIO.playSound(this.Audio.refurn_bet);
                                setTimeout(() => {
                                        this.amountRefurn = 0;
                                }, 5000);
                        }, 1500);
                }
                if (void 0 !== gameData.status) {
                        this.setStatusWinLose(gameData.status);
                        this.getUserInfo();
                }

                if (void 0 !== gameData.contractor) {
                        if (void 0 !== gameData.contractor.user && gameData.contractor.user !== null) {
                                this.contractor_balance.string = cc.CORE.UTIL.numberWithCommas(gameData.contractor.user.balance);
                                this.contractor_username.string = gameData.contractor.user.nickname;
                        }
                        if (void 0 !== gameData.contractor.get_list) {
                                this.SicboPopup.Contractor.onData(gameData.contractor.get_list);
                        }
                }
                if (void 0 !== gameData.chat) {
                        this.SicboChat.onData(gameData.chat);
                }
                if (void 0 !== gameData.get_history_bet) {
                        this.SicboPopup.History_Bet.onData(gameData.get_history_bet);
                }

                if (void 0 !== gameData.check_transfer) {
                        this.SicboPopup.Transfer.onData(gameData.check_transfer);
                }

                /*** DEALER */
                if (void 0 !== gameData.dealer) {
                        if (void 0 !== gameData.dealer.locked_press_key) this.DealerLockedPressKey = gameData.dealer.locked_press_key;
                        if (void 0 !== gameData.dealer.show_confirm_result) this.SicboPopup.Dealer_Confirm_Result.node.active = gameData.dealer.show_confirm_result;
                        if (void 0 !== gameData.dealer.set_confirm_result) this.SicboPopup.Dealer_Confirm_Result.setResultDoor(gameData.dealer.set_confirm_result);
                        if (void 0 !== gameData.dealer.customer_tip) this.SicboPopup.Customer_Tip.show(gameData.dealer.customer_tip);
                }
        },

        /**** SET DATA GAME */
        setupRoom: function (room) {
                if (void 0 !== room.stream) this.setStream(true, room.stream);
                if (void 0 !== room.time_remain) {
                        this.time_remain.string = cc.CORE.UTIL.numberPad(room.time_remain, 2);
                        ClockOverlayManager.setText(cc.CORE.UTIL.numberPad(room.time_remain, 2));
                }
                if (void 0 !== room.room_code) {
                        this.session_sidebar.string = room.room_code;
                }
                if (void 0 !== room.session) {
                        // this.session_sidebar.string = "#" + room.session;
                }
                if (void 0 !== room.ratio) {
                        this.setRatioBet(room.ratio);
                }
                if (void 0 !== room.player_count) {
                        this.gamePlayerCount.string = cc.CORE.UTIL.numberWithCommas(room.player_count);
                        // PlayerCountOverlayManager.setText(cc.CORE.UTIL.numberWithCommas(room.player_count));
                }
                if (void 0 !== room.contractor) {
                        if (room.contractor !== null) {
                                this.contractor_balance.string = cc.CORE.UTIL.numberWithCommas(room.contractor.balance, 2);
                                this.contractor_username.string = room.contractor.nickname;
                        }
                        if (room.contractor == null) {
                                this.contractor_balance.string = "";
                                this.contractor_username.string = "";
                        }
                }
        },
        setStream: function (show = true, url = null) {
                // this.VideoStream.node.active = show;
                if (show) this.VideoStream.node.active = true;
                // this.VideoStream.node.position = show ? cc.v2(0, this.positionVideoStream) : cc.v2(0, this.positionVideoStream.y * 3);
                let rangeX = (show) ? 0 : 1000 * 5;
                this.VideoStream.node.setPosition(rangeX, this.VideoStream.node.position.y);

                if (url) this.VideoStream.url = url;

                // if (cc.sys.isBrowser) {
                //         const overlayStream = document.getElementById("iframe-overlay-div");
                //         if (overlayStream) overlayStream.style.display = show ? "block" : "none";
                // }
        },
        setRatioBet: function (data) {
                let ratio = data;
                let fee = ratio.fee;
                // cc.log(nodeBet);
                Object.entries(ratio).forEach(([key, value]) => {
                        if (key == "fee") return;
                        let betwin = value.win;
                        const nodeBet = this.gameNodeBetMap.get(key);
                        if (nodeBet) {
                                const getChildr = nodeBet.getChildByName("name_ratio").getChildByName("ratio");
                                if (key == "small" || key == "big") {
                                        betwin = value.bet * value.win * (1 - fee / 100);
                                        getChildr.getComponent(cc.Label).string = `${value.bet}x${betwin}`;
                                } else {
                                        getChildr.getComponent(cc.Label).string = `${value.bet}x${betwin}`;
                                }
                        }
                });
                return;
        },

        // ACTION GAME
        onClickBet: function (event) {
                // if (this.amountCurrent < 10000) this.FastNotify("");
                let door = event.target.name;
                cc.CORE.NETWORK.APP.Send({
                        event: "game",
                        data: {
                                sicbo: {
                                        bet: {
                                                room_code: this.ROOM.room_code, door, amount: this.amountCurrent
                                        }
                                }
                        }
                });
        },
        onClickRepeatBet: function (event) {
                // if (this.amountCurrent < 10000) this.FastNotify("");
                if (this.isClickToBet) return;
                cc.CORE.NETWORK.APP.Send({
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
        onClickCancelBet: function (event) {
                cc.CORE.NETWORK.APP.Send({
                        event: "game",
                        data: {
                                sicbo: {
                                        cancel_bet: { room_code: this.ROOM.room_code }
                                }
                        }
                });
        },

        onClickTipDealer: function () {
                this.SicboPopup.show("tip");
        },
        onClickLeaveGame: function () {
                this.SicboPopup.show("leave");
        },
        onClickLobbyTransfer: function () {
                this.PopupLobby.show("transfer");
        },
        onClickLobbyVerifyPhone: function () {
                this.PopupLobby.show("verify_phone");
        },
        onClickLobbyPayment: function () {
                this.PopupLobby.show("payment");
        },
        onClickContact: function (event, customEventData = "TELEGRAM_GROUP") {
                // const type = customEventData;
                // const contact = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[type];
                // // Kiểm tra xem contact có hợp lệ không
                // if (contact && contact !== "" && contact !== null) {
                //     // Mở URL ngay lập tức khi người dùng click vào button
                //     cc.sys.openURL(contact);
                // } else {
                //     this.FastNotify(contact ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1, false);
                // }
                this.PopupLobby.show("contact");
        },

        // khi có lệnh chấp nhận thoát từ server mới thực hiện đưa người chơi ra khỏi phòng
        outGameByServer: function (data) {
                this.ClockOverlayManager.destroy();
                this.PlayerCountOverlayManager.destroy();
                this.ResultDotOverlayManager.destroy();
                clearInterval(this.intervalCheckUserInfo);


                //== DEALER LEAVE ROOM ==//
                if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
                        if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {
                                cc.CORE.NETWORK.DEALER.Send({
                                        "event": "dealer_leave_room",
                                        "data": {
                                                "game": cc.CORE.GAME_ROOM.GAME_CODE.toUpperCase(),
                                                "room_code": cc.CORE.GAME_ROOM.ROOM_CODE
                                        }
                                });
                        }
                }

                cc.CORE.GAME_ROOM.clean();
                LocalStorage.removeItem("IN_GAME_ROOM");
                // đưa lại màn lobby
                cc.director.loadScene("Lobby");
        },

        // nhận tiền cược hiện tại của người chơi
        setMebetCurrent: function (data) {
                for (const [door, amount] of Object.entries(data.data)) {
                        this.setCurrentMeBetAmountNodeBet(false, door, amount);
                }
                this.total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total, 2);
        },
        setCurrentMeBetAmountNodeBet: function (reset = true, nodeBet = null, amount = 0) {
                const seft = this;
                // reset = true => tắt hiển thị tất cả các node
                if (reset) {
                        seft.gameNodeBet.map((nodeBetTable) => {
                                const betNodeComp = nodeBetTable.getChildByName("me_bet");
                                if (betNodeComp) {
                                        const betLabel = betNodeComp.getChildByName('txt_me_bet');
                                        const labelComponent = betLabel.getComponent(cc.Label);
                                        if (labelComponent) labelComponent.string = "";
                                }
                                betNodeComp.active = false;
                        });
                        return;
                }
                // nếu có thông tin đặt đã đặt tiền
                if (nodeBet !== null) {
                        const nodeBetTable = seft.gameNodeBetMap.get(nodeBet);
                        const betNodeComp = nodeBetTable.getChildByName("me_bet");
                        if (betNodeComp) {
                                const betLabel = betNodeComp.getChildByName('txt_me_bet');
                                const labelComponent = betLabel.getComponent(cc.Label);
                                if (labelComponent) labelComponent.string = cc.CORE.UTIL.abbreviateNumber(amount, 2);
                        }
                        betNodeComp.active = (amount > 0) ? true : false;
                        return;
                }
        },
        setStatusWinLose: function (data) {
                if (data.total_win > 0) {
                        // const profit = data.total_win + data.total_bet - data.total_lose;
                        const profit = data.total_win;
                        this.TextMoneyFly(true, profit);
                        cc.CORE.AUDIO.playSound(this.Audio.win_bet);
                } else if (data.total_lose > 0) {
                        const profit = data.total_lose;
                        this.TextMoneyFly(false, profit);
                } else {
                        // this.TextMoneyFly(true, profit);
                }
        },
        SetDiceResult: function (show = false, data = []) {
                const seft = this;

                // Kiểm tra xem dữ liệu có hợp lệ không
                if (!Array.isArray(data) || data.length !== seft.gameDicesResult.children.length) return seft.gameDicesResult.active = false;
                seft.gameDicesResult.active = show;

                // sắp xếp theo thứ tự tăng dần 3 mặt xúc xắc
                data.sort((a, b) => a - b);

                seft.gameDicesResult.children.forEach((dice, index) => {
                        const sprite = dice.getComponent(cc.Sprite);
                        if (sprite) {
                                const diceValue = data[index];
                                sprite.spriteFrame = seft.diceSprite[diceValue];
                        }
                });
                // ResultDotOverlayManager.setResult(data);
                // if (show) ResultDotOverlayManager.show();
        },
        SetDiceResultSound: function (show = false, data = []) {
                const seft = this;
                seft.gameDicesResult.active = show;
                // Kiểm tra xem dữ liệu có hợp lệ không
                if (!Array.isArray(data) || data.length !== seft.gameDicesResult.children.length) return;
                // sắp xếp theo thứ tự tăng dần 3 mặt xúc xắc
                data.sort((a, b) => a - b);
                const winningDoorsText = this.getWinningDoorsSoundName(data);
                if (!winningDoorsText) return;

                this.node.runAction(cc.sequence(
                        cc.callFunc(() => cc.CORE.AUDIO.playSound(this.Audio[winningDoorsText])),
                        cc.delayTime(1.2), // delay đúng thời lượng clip
                        cc.callFunc(() => cc.CORE.AUDIO.playSound(this.Audio[`res_${data[0]}`])),
                        cc.delayTime(0.7),
                        cc.callFunc(() => cc.CORE.AUDIO.playSound(this.Audio[`res_${data[1]}`])),
                        cc.delayTime(0.7),
                        cc.callFunc(() => cc.CORE.AUDIO.playSound(this.Audio[`res_${data[2]}`]))
                ));

        },
        getWinningDoorsSoundName: function (result = []) {
                const sum = result.reduce((acc, curr) => acc + curr, 0);
                if (sum > 10) return "res_tai";
                if (sum <= 10) return "res_xiu";
        },
        OffWinNode: function () {
                this.gameNodeBet.map((nodeBetTable) => {
                        nodeBetTable.getChildByName("active").active = false;
                });
        },
        SetWinNode: function (data) {
                const seft = this;
                // off old win node
                seft.OffWinNode();
                // node node win active
                data.map((nodeWin) => seft.gameNodeBetMap.get(nodeWin).getChildByName("active").active = true);
        },
        setDefaultCurrentBetAmountNodeBet: function (nodesList) {
                Promise.all(nodesList.map(node => {
                        const betLabel = node.getChildByName('txt_users_bet');
                        const labelComponent = betLabel.getComponent(cc.Label);
                        if (labelComponent) labelComponent.string = "0";
                }));
        },
        setUsersBetCurrent: function (data) {
                const seft = this;
                Object.entries(data).forEach(([key, value]) => {
                        const nodeBet = seft.gameNodeBetMap.get(key);
                        if (nodeBet) {
                                const betLabel = nodeBet.getChildByName('txt_users_bet');
                                const labelComponent = betLabel.getComponent(cc.Label);
                                if (labelComponent) labelComponent.string = cc.CORE.UTIL.abbreviateNumber(value, 2);
                        }
                });
        },

        toggleSidebar: function () {
                // this.txtVideoStream.string = "Trực tiếp đang tạm dừng..."
                this.sideBar.getComponent('Sicbo.Sidebar.Controller').toggleSidebar(this.VideoStream);
        },
        reConnect: function () {
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
                setTimeout(() => {
                        this.getRoomConfig();
                        this.getUserInfo();
                        this.getMeBet();
                }, 1000);
        },
        onChangerSelectChipShow: function (event) {
                const seft = this;
                const betSelect = Number(event.target.name);
                seft.gameNodeChipBet.map((chip, index) => {
                        if (betSelect == Number(chip.name)) {
                                chip.children[1].active = true;
                        } else {
                                chip.children[1].active = false;
                        }
                });
                this.amountCurrent = betSelect;
        },
        showPageBetByIndex: function (index) {
                this.pageBetShow = index;
                this.gameNodeBetPagination.forEach((node, i) => {
                        node.getComponent(cc.Sprite).node.color = (i === index) ? cc.Color.RED : cc.Color.WHITE;
                });
        },
        showNextPage: function () {
                this.PlayClick();
                let nextIndex = this.pageViewComponent.getCurrentPageIndex() + 1;
                if (nextIndex >= this.pageViewComponent.getPages().length) nextIndex = 0;
                this.pageViewComponent.scrollToPage(nextIndex, 0.3);
                this.showPageBetByIndex(nextIndex);
        },
        showPreviousPage: function () {
                this.PlayClick();
                let prevIndex = this.pageViewComponent.getCurrentPageIndex() - 1;
                if (prevIndex < 0) prevIndex = this.pageViewComponent.getPages().length - 1;
                this.pageViewComponent.scrollToPage(prevIndex, 0.3);
                this.showPageBetByIndex(prevIndex);
        },
        // sound
        PlayClick: function () {
                cc.CORE.AUDIO.playSound(this.Audio.click);
        },
        PlayChipBet: function () {
                cc.CORE.AUDIO.playSound(this.Audio.chip_bet);
        },

        cleanFastNotify: function () {
                this.prefabNode.children.map((node, index) => {
                        try {
                                if (node.name == "Fast_Notify" && cc.isValid(node)) {
                                        node.destroy();
                                }
                        } catch (e) {
                                cc.log(e);
                        }
                });
                // this.nodeNotify.children.map((node, index) => {
                //         try {
                //                 if (node.name == "Fast_Notify" && cc.isValid(node)) {
                //                         node.destroy();
                //                 }
                //         } catch (e) {
                //                 cc.log(e);
                //         }
                // });
        },
        cleanFastNotifySicbo: function () {
                this.nodeNotify.children.map((node, index) => {
                        try {
                                if (node.name == "Fast_Notify" && cc.isValid(node)) node.destroy();
                        } catch (e) {
                                cc.log(e);
                        }
                });
        },
        FastNotify: function (
                text = '',
                type = 'success',
                showTime = 3,
                priority = true,
                animationTime = 0.5,
                force = true
        ) {
                // const skipPopup = [
                //     "Lobby.Popup.Transfer",
                //     "Lobby.Popup.VerifyPhone",
                //     "Lobby.Popup.Setting",
                //     "Lobby.Popup.Payment",
                //     "Verify_Phone",
                //     "Payment"
                // ];

                // if (!priority && this.isPopupOpen && !skipPopup.includes(this.currentPopupOpen)) return;
                // if (!priority && this.isPopupOpen) return;
                if (!priority && this.isPopupOpen) return;

                // remove old notify
                if (force) this.prefabNode.children.map((node, index) => {
                        try {
                                if (node.name == "Fast_Notify" && cc.isValid(node)) node.destroy();
                        } catch (e) {
                                cc.log(e);
                        }
                });
                const notificationPrefab = cc.instantiate(this.miniNotifyPrefab);
                const noticeComponent = notificationPrefab.getComponent('Sicbo.Fast_Notify.Controller');
                noticeComponent.init({
                        text, type, showTime, animationTime
                });
                this.prefabNode.addChild(notificationPrefab);
        },
        FastNotifySicbo: function (
                text = '',
                type = 'success',
                showTime = 3,
                priority = true,
                animationTime = 0.5,
                force = true
        ) {
                if (!priority && this.isPopupOpen) return;

                // remove old notify
                if (force) this.nodeNotify.children.map((node, index) => {
                        try {
                                if (node.name == "Fast_Notify" && cc.isValid(node)) node.destroy();
                        } catch (e) {
                                cc.log(e);
                        }
                });
                const notificationPrefab = cc.instantiate(this.miniNotifyPrefab);
                const noticeComponent = notificationPrefab.getComponent('Sicbo.Fast_Notify.Controller');
                noticeComponent.init({
                        text, type, showTime, animationTime
                });
                this.nodeNotify.addChild(notificationPrefab);
        },
        TextMoneyFly: function (isWin, amount, text = "") {
                var temp = new cc.Node();
                temp.addComponent(cc.Label);
                temp = temp.getComponent(cc.Label);
                temp.string = text + " " + (isWin ? "+" : "-") + cc.CORE.UTIL.numberWithCommas(amount);
                temp.font = this.font[0];
                temp.node.color = (text == "Hoàn") ? cc.Color.WHITE : isWin ? cc.Color.GREEN : cc.Color.RED;
                temp.lineHeight = 50;
                temp.fontSize = 50;
                temp.node.position = cc.v2(-7, -375);
                this.prefabNode.addChild(temp.node);
                temp.node.runAction(
                        cc.sequence(
                                cc.moveTo(2, cc.v2(-7, -185)),
                                cc.callFunc(function () {
                                        try {
                                                this.node.destroy();
                                        } catch (e) {
                                                console.log(e);
                                        }
                                }, temp)
                        )
                );
        },
        update: function (dt) {
                // tắt active khi nếu state không phải là finish
                if (this.gameState !== "finish") {
                        this.OffWinNode();
                }

                // ClockOverlayManager.show();

                // ẩn đồng hồ
                if (this.gameState == "start_bet") {
                        ClockOverlayManager.show();
                } else if (this.gameState == "finish") {
                        ClockOverlayManager.hide();
                } else if (this.gameState == null) {
                        if (this.time_remain.string !== "00") {
                                ClockOverlayManager.show();
                        } else {
                                ClockOverlayManager.hide();
                        }
                }

                // kiểm tra xem có popup lobby nào đang hiển thị không
                if (void 0 !== this.PopupLobby && this.isCheckPopupOpen) {
                        this.isPopupOpen = false;
                        this.currentPopupOpen = null;
                        this.PopupLobby.node.children.forEach((node) => {
                                if (node.active) {
                                        this.currentPopupOpen = node.name;
                                        this.isPopupOpen = true;
                                        return;
                                }
                        });
                        this.setStream((!this.isPopupOpen) ? true : false);
                        if (this.isPopupOpen) {
                                ClockOverlayManager.hide();
                                PlayerCountOverlayManager.hide();
                                ResultDotOverlayManager.hide();
                        }
                        else {
                                // ClockOverlayManager.show();
                                PlayerCountOverlayManager.show();
                        }
                }


                // off overlay

                // make div coppy iframe
                // if (cc.sys.isBrowser) {
                //         const iframe = document.querySelector("iframe");
                //         if (!this.isIframeOverlayCreated) {
                //                 if (iframe) {
                //                         this.isIframeOverlayCreated = true;
                //                         const overlayDiv = document.createElement('div');
                //                         const iframeStyles = window.getComputedStyle(iframe);
                //                         overlayDiv.id = "iframe-overlay-div";
                //                         overlayDiv.style.pointerEvents = "none";
                //                         overlayDiv.style.height = iframeStyles.height;
                //                         overlayDiv.style.width = iframeStyles.width;
                //                         overlayDiv.style.overflow = "hidden";
                //                         overlayDiv.style.border = "none";
                //                         overlayDiv.style.visibility = iframeStyles.visibility;
                //                         // overlayDiv.style.position = iframeStyles.position;
                //                         overlayDiv.style.position = "absolute";
                //                         overlayDiv.style.bottom = iframeStyles.bottom;
                //                         // overlayDiv.style.left = iframeStyles.left;
                //                         overlayDiv.style.left = "0px";
                //                         if (cc.CORE.UTIL.isMobile()) overlayDiv.style.bottom = "0px";

                //                         overlayDiv.style.transformOrigin = "0px 100% 0px";
                //                         overlayDiv.style.opacity = 1;
                //                         overlayDiv.style.zIndex = '9999';

                //                         overlayDiv.style.overflow = 'hidden';

                //                         // overlayDiv.style.backgroundColor = 'rgba(83, 175, 255, 0.5)';
                //                         const parent = iframe.parentNode;
                //                         parent.insertBefore(overlayDiv, iframe.nextSibling);

                //                         // cc.log(parent);

                //                         ClockOverlayManager.create('00');
                //                         PlayerCountOverlayManager.create('0');
                //                         ResultDotOverlayManager.create();
                //                         // ResultDotOverlayManager.show();
                //                 }

                //                 document.body.style.overflow = 'hidden'; // Ẩn thanh cuộn
                //                 document.body.addEventListener('touchmove', function (e) {
                //                         e.preventDefault();  // Ngăn chặn touchmove trên toàn trang
                //                 }, { passive: false });

                //                 document.body.addEventListener('scroll', function (e) {
                //                         e.preventDefault();  // Ngăn chặn cuộn trang
                //                 }, { passive: false });
                //         }
                //         if (iframe) {
                //                 const transformValue = window.getComputedStyle(iframe).getPropertyValue('transform');
                //                 const ifrOvl = document.getElementById("iframe-overlay-div");
                //                 ifrOvl.style.transform = transformValue;
                //         }
                // }

                //==== DEALER MANAGER GAME ==//
                if (cc.sys.isBrowser) {
                        if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
                                if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) DealerKeyboardManager.handleInput(dt);
                        }
                }

        },
});