const AssetManager = require("AssetManager");

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

        // pagination: cc.Node,
        sprite_status: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    init(obj) {
        this.CORE = obj;
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
    onLoad() {
    },
    onShowGameSelect: function (event) {
        cc.CORE.GAME_SCENCE.PlayClick();
        // const name = event.target.name;
        this.toggleMoreSelect(event, null);
    },
    toggleMoreSelect: function (event, custom) {
        this.moreSelect.active = !this.moreSelect.active;
        if (custom) {
            switch (custom) {
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
                    break;
            }
            this.moreSelect_item.children.forEach(node => {
                if (node.name == custom) {
                    node.getChildByName("active").active = true;
                } else {
                    node.getChildByName("active").active = false;
                }
            });
        }

        this.getData();
    },
    onEnable() {
        if (void 0 !== cc.CORE.GAME_ROOM.ROOM_CODE) this.byRoomCode = { room_code: cc.CORE.GAME_ROOM.ROOM_CODE };
        this.getData();
        this.state_show = "view_by_date";
        this.bodyViewByDate.active = true;
        this.bodyViewBySession.active = false;
        this.bodyViewBySessionBet.active = false;
    },
    getData() {
        // this.listContent.removeAllChildren();
        let get_time = {};
        if (this.state_time == "days") get_time = cc.CORE.UTIL.getDateRange("today");
        // if (this.state_time == "weeks") get_time = cc.CORE.UTIL.getDateRange("this_week");
        if (this.state_time == "weeks") get_time = cc.CORE.UTIL.getDateRange("this_week");
        if (this.state_time == "months") get_time = cc.CORE.UTIL.getDateRange("this_month");
        if (this.state_time == "years") get_time = cc.CORE.UTIL.getDateRange("this_year");

        const dataPost = {
            event: "history_bet",
            data: {
                get_list: {
                    game: this.tabShow,
                    time: get_time,
                    // time: { from: "15-09-2025", to: "15-09-2025" },
                    state_time: this.state_time,
                    ...this.byRoomCode
                }
            }
        };
        cc.CORE.NETWORK.APP.Send(dataPost);
    },
    onRefresh: function () {
        this.getData();
        this.bodyViewByDate.active = true;
        this.bodyViewBySession.active = false;
        this.bodyViewBySessionBet.active = false;

        this.listBydateContent.removeAllChildren();
        this.listBySessionContent.removeAllChildren();
        this.listBySessionBetContent.removeAllChildren();
    },
    onSelectHeader: function (event) {
        this.state_show = "view_by_date";
        cc.CORE.GAME_SCENCE.PlayClick();
        const name = event.target.name;
        this.header.children.forEach(node => {
            if (node.name == name) {
                node.getChildByName("active").active = true; node.getChildByName("none").active = false;
            } else {
                node.getChildByName("active").active = false; node.getChildByName("none").active = true;
            }
        });
        this.state_time = name;
        this.getData();
        this.bodyViewByDate.active = true;
        this.bodyViewBySession.active = false;
        this.bodyViewBySessionBet.active = false;

        this.listBydateContent.removeAllChildren();
        this.listBySessionContent.removeAllChildren();
        this.listBySessionBetContent.removeAllChildren();
    },
    onClickBack: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        if (this.state_show == "view_by_session") {
            this.state_show = "view_by_date";
            this.bodyViewByDate.active = true;
            this.bodyViewBySession.active = false;
            this.bodyViewBySessionBet.active = false;
        }
        if (this.state_show == "view_by_session_bet") {
            this.state_show = "view_by_session";
            this.bodyViewByDate.active = false;
            this.bodyViewBySession.active = true;
            this.bodyViewBySessionBet.active = false;
        }
    },
    onData: function (data_history) {
        this.listBydateContent.removeAllChildren();
        this.listBySessionContent.removeAllChildren();
        this.listBySessionBetContent.removeAllChildren();

        if (void 0 != data_history.get_history_bet) {

            //=== XOC DIA ===//
            if (data_history?.get_history_bet?.xocdia) {
                const dataHistory = data_history.get_history_bet.xocdia;
                if (void 0 != dataHistory.data) {
                    let data = dataHistory.data;

                    // đảo ngược ngày mới lên đầu
                    data = Object.entries(data).reverse().reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});

                    this.state_show = "view_by_date";

                    Object.entries(data).forEach(([key, value]) => {
                        const dataDate = value;
                        const item = value["sum"];
                        const itemNode = cc.instantiate(this.XocDia_ItemByDatePrefab);
                        const nodeComp = itemNode.getComponent("Lobby.Popup.History_Bet.Xocdia.ByDate.Item.Controller");
                        nodeComp.init(this, dataDate);

                        nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.total_fee, 2);
                        nodeComp.time.string = cc.CORE.UTIL.getDayOfWeek(key) + " - " + key;
                        nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                        nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);

                        let total_win = item.total_win_real - item.total_lose;

                        let is_draw = total_win == 0;
                        let is_win = total_win > 0;
                        nodeComp.total_win.string = (is_win ? "+" : (is_draw) ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(total_win), 2);
                        nodeComp.total_win.node.color = (is_win) ? cc.color().fromHEX("#00FF00") : (is_draw) ? cc.color().fromHEX("#FF0000") : cc.color().fromHEX("#FF0000");
                        nodeComp.status.getComponent(cc.Sprite).spriteFrame = (is_win) ? this.sprite_status[0] : (is_draw) ? this.sprite_status[2] : this.sprite_status[1];

                        this.listBydateContent.addChild(itemNode);

                        // nếu là hôm nay thì show luôn list session
                        if (this.state_time == "days") {
                            this.state_show = "view_by_session";
                            this.onClickViewSessionByDate(dataDate)
                        };
                    });
                }

                if (void 0 !== dataHistory.sum) {
                    const data = dataHistory.sum;
                    if (void 0 !== data.total_bet) {
                        this.byDate_total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
                    }
                    if (void 0 !== data.total_refurn) {
                        this.byDate_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
                    }
                    if (void 0 !== data.total_fee) {
                        this.byDate_total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
                    }
                    if (void 0 !== data.total_win_real && void 0 !== data.total_lose) {
                        let color = (data.total_win_real - data.total_lose) > 0 ? "#00FF00" : (data.total_win_real - data.total_lose) == 0 ? "#FFFFFF" : "#FF0000";
                        this.byDate_total_profit.string = ((data.total_win_real - data.total_lose) > 0 ? "+" : (data.total_win_real - data.total_lose) == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(data.total_win_real - data.total_lose), 2);
                        this.byDate_total_profit.node.color = cc.color().fromHEX(color); // Set màu
                    }
                }
            }




            //=== SIC BO ===//
            if (data_history?.get_history_bet?.sicbo) {
                const dataHistory = data_history.get_history_bet.sicbo;
                if (void 0 != dataHistory.data) {
                    let data = dataHistory.data;

                    // đảo ngược ngày mới lên đầu
                    data = Object.entries(data).reverse().reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});

                    this.state_show = "view_by_date";

                    Object.entries(data).forEach(([key, value]) => {
                        const dataDate = value;
                        const item = value["sum"];
                        const itemNode = cc.instantiate(this.Sicbo_ItemByDatePrefab);
                        const nodeComp = itemNode.getComponent("Lobby.Popup.History_Bet.Sicbo.ByDate.Item.Controller");
                        nodeComp.init(this, dataDate);

                        nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.total_fee, 2);
                        nodeComp.time.string = cc.CORE.UTIL.getDayOfWeek(key) + " - " + key;
                        nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                        nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);

                        let total_win = item.total_win_real - item.total_lose;

                        let is_draw = total_win == 0;
                        let is_win = total_win > 0;
                        nodeComp.total_win.string = (is_win ? "+" : (is_draw) ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(total_win), 2);
                        nodeComp.total_win.node.color = (is_win) ? cc.color().fromHEX("#00FF00") : (is_draw) ? cc.color().fromHEX("#FF0000") : cc.color().fromHEX("#FF0000");
                        nodeComp.status.getComponent(cc.Sprite).spriteFrame = (is_win) ? this.sprite_status[0] : (is_draw) ? this.sprite_status[2] : this.sprite_status[1];

                        this.listBydateContent.addChild(itemNode);

                        // nếu là hôm nay thì show luôn list session
                        if (this.state_time == "days") {
                            this.state_show = "view_by_session";
                            this.onClickViewSessionByDate(dataDate)
                        };
                    });
                }

                if (void 0 !== dataHistory.sum) {
                    const data = dataHistory.sum;
                    if (void 0 !== data.total_bet) {
                        this.byDate_total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
                    }
                    if (void 0 !== data.total_refurn) {
                        this.byDate_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
                    }
                    if (void 0 !== data.total_fee) {
                        this.byDate_total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
                    }
                    if (void 0 !== data.total_win_real && void 0 !== data.total_lose) {
                        let color = (data.total_win_real - data.total_lose) > 0 ? "#00FF00" : (data.total_win_real - data.total_lose) == 0 ? "#FFFFFF" : "#FF0000";
                        this.byDate_total_profit.string = ((data.total_win_real - data.total_lose) > 0 ? "+" : (data.total_win_real - data.total_lose) == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(data.total_win_real - data.total_lose), 2);
                        this.byDate_total_profit.node.color = cc.color().fromHEX(color); // Set màu
                    }
                }
            }

        }
    },

    onClickViewSessionByDate: function (dataDate) {
        this.listBySessionContent.removeAllChildren();
        this.bodyViewByDate.active = false;
        this.bodyViewBySession.active = true;
        this.bodyViewBySessionBet.active = false;


        switch (this.tabShow) {
            case this.gameCategoryEnum.XOC_DIA:

                if (void 0 != dataDate.bet) {
                    const dataDateBet = dataDate.bet.reverse();

                    this.state_show = "view_by_session";

                    Object.entries(dataDateBet).forEach(([key, value]) => {

                        const item = value["sum"];
                        const sessionData = value;
                        const itemNode = cc.instantiate(this.XocDia_ItemBySessionPrefab);
                        const nodeComp = itemNode.getComponent("Lobby.Popup.History_Bet.Xocdia.BySession.Item.Controller");
                        nodeComp.init(this, sessionData);

                        nodeComp.session.string = "Phiên: #" + value.session + " - Bàn chơi: " + value["data_bet"][0]["room_code"];
                        nodeComp.time.string = cc.CORE.UTIL.getStringDateByTime(value.session_data.session_time);
                        nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                        nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);
                        nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.total_fee, 2);

                        let total_win = 0;

                        total_win = item.total_win_real - item.total_lose;

                        nodeComp.total_win.string = (total_win > 0 ? "+" : (total_win == 0) ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(total_win), 2);
                        nodeComp.total_win.node.color = (total_win > 0) ? cc.color().fromHEX("#00FF00") : (total_win == 0) ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");

                        nodeComp.status.getComponent(cc.Sprite).spriteFrame = (total_win > 0) ? this.sprite_status[0] : (total_win == 0) ? this.sprite_status[2] : this.sprite_status[1];

                        if (void 0 !== value.session_data.session_result) {
                            nodeComp.setResultDot(value.session_data.session_result);
                        }
                        this.listBySessionContent.addChild(itemNode);
                    });
                }
                if (void 0 !== dataDate.sum) {
                    const data = dataDate.sum;
                    if (void 0 !== data.total_bet) {
                        this.bySession_total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
                    }
                    if (void 0 !== data.total_refurn) {
                        this.bySession_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
                    }
                    if (void 0 !== data.total_fee) {
                        this.bySession_total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
                    }
                    if (void 0 !== data.total_win_real && void 0 !== data.total_lose) {
                        let color = (data.total_win_real - data.total_lose) > 0 ? "#00FF00" : (data.total_win_real - data.total_lose) == 0 ? "#FFFFFF" : "#FF0000";
                        this.bySession_total_profit.string = ((data.total_win_real - data.total_lose) > 0 ? "+" : (data.total_win_real - data.total_lose) == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(data.total_win_real - data.total_lose), 2);
                        this.bySession_total_profit.node.color = cc.color().fromHEX(color); // Set màu
                    }
                }

                break;

            //=== SIC BO ===//
            case this.gameCategoryEnum.SICBO:

                if (void 0 != dataDate.bet) {
                    const dataDateBet = dataDate.bet.reverse();

                    this.state_show = "view_by_session";

                    Object.entries(dataDateBet).forEach(([key, value]) => {
                        const item = value["sum"];
                        const sessionData = value;
                        const itemNode = cc.instantiate(this.Sicbo_ItemBySessionPrefab);
                        const nodeComp = itemNode.getComponent("Lobby.Popup.History_Bet.Sicbo.BySession.Item.Controller");
                        nodeComp.init(this, sessionData);

                        nodeComp.session.string = "Phiên: #" + value.session + " - Bàn chơi: " + value["data_bet"][0]["room_code"];
                        nodeComp.time.string = cc.CORE.UTIL.getStringDateByTime(value.session_data.session_time);
                        nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                        nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);
                        nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.total_fee, 2);

                        let total_win = 0;

                        total_win = item.total_win_real - item.total_lose;

                        nodeComp.total_win.string = (total_win > 0 ? "+" : (total_win == 0) ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(total_win), 2);
                        nodeComp.total_win.node.color = (total_win > 0) ? cc.color().fromHEX("#00FF00") : (total_win == 0) ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");

                        nodeComp.status.getComponent(cc.Sprite).spriteFrame = (total_win > 0) ? this.sprite_status[0] : (total_win == 0) ? this.sprite_status[2] : this.sprite_status[1];

                        if (void 0 !== value.session_data.session_result) {
                            nodeComp.setResultDot(value.session_data.session_result);
                        }
                        this.listBySessionContent.addChild(itemNode);
                    });
                }

                if (void 0 !== dataDate.sum) {
                    const data = dataDate.sum;
                    if (void 0 !== data.total_bet) {
                        this.bySession_total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
                    }
                    if (void 0 !== data.total_refurn) {
                        this.bySession_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
                    }
                    if (void 0 !== data.total_fee) {
                        this.bySession_total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
                    }
                    if (void 0 !== data.total_win_real && void 0 !== data.total_lose) {
                        let color = (data.total_win_real - data.total_lose) > 0 ? "#00FF00" : (data.total_win_real - data.total_lose) == 0 ? "#FFFFFF" : "#FF0000";
                        this.bySession_total_profit.string = ((data.total_win_real - data.total_lose) > 0 ? "+" : (data.total_win_real - data.total_lose) == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(data.total_win_real - data.total_lose), 2);
                        this.bySession_total_profit.node.color = cc.color().fromHEX(color); // Set màu
                    }
                }

                break;

        }
    },

    onClickViewSessionBySession: function (dataSession) {

        cc.log(dataSession);

        this.listBySessionBetContent.removeAllChildren();
        this.bodyViewByDate.active = false;
        this.bodyViewBySession.active = false;
        this.bodyViewBySessionBet.active = true;

        this.state_show = "view_by_session_bet";

        switch (this.tabShow) {
            case this.gameCategoryEnum.XOC_DIA:

                this.BET_DOOR_ENUM = {
                    "even": "CHẴN",
                    "odd": "LẺ",
                    "even_low": "CHẴN 10:9",
                    "odd_low": "LẺ 10:9",
                    "even_high": "CHẴN 9:10",
                    "odd_high": "LẺ 9:10",
                    "red3": "3 ĐỎ",
                    "red4": "4 ĐỎ",
                    "white3": "3 TRẮNG",
                    "white4": "4 TRẮNG"
                };

                if (void 0 != dataSession.data_bet) {
                    const data = dataSession.data_bet;

                    const transform_result = {};

                    data.forEach(item => {
                        const bet_door = item.bet_door;
                        if (!transform_result[bet_door]) transform_result[bet_door] = {
                            fee: 0,
                            total_bet: 0,
                            total_refurn: 0,
                            total_win: 0,
                            total_lose: 0,
                            total_win_real: 0
                        };
                        transform_result[bet_door].fee += item.fee;
                        transform_result[bet_door].total_bet += item.total_bet;
                        transform_result[bet_door].total_refurn += item.total_refurn;
                        transform_result[bet_door].total_win += item.total_win;
                        transform_result[bet_door].total_lose += item.total_lose;
                        transform_result[bet_door].total_win_real += item.total_win_real;
                    });

                    Object.entries(transform_result).forEach(([bet_door, item]) => {
                        const itemNode = cc.instantiate(this.Sicbo_ItemBySessionBetPrefab);
                        const nodeComp = itemNode.getComponent("Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller");
                        nodeComp.init(this);

                        nodeComp.session.string = "Phiên: #" + dataSession.session + " - Bàn chơi: " + dataSession["data_bet"][0]["room_code"];
                        nodeComp.time.string = cc.CORE.UTIL.getStringDateByTime(dataSession.session_data.session_time);
                        if (void 0 !== dataSession.session_data.session_result) nodeComp.setResultDot(dataSession.session_data.session_result);

                        nodeComp.bet_door.string = this.BET_DOOR_ENUM[bet_door];
                        nodeComp.bet_door1.string = this.BET_DOOR_ENUM[bet_door];

                        nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.fee, 2);
                        nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                        nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);

                        let total_win = 0;
                        if (item.total_win > 0) {
                            total_win = item.total_win_real;
                        } else if (item.total_win == 0) {
                            total_win = -item.total_lose;
                        }

                        nodeComp.total_win.string = (total_win > 0 ? "+" : (total_win == 0) ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(total_win), 2);
                        nodeComp.total_win.node.color = (total_win > 0) ? cc.color().fromHEX("#00FF00") : (total_win == 0) ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");

                        nodeComp.status.getComponent(cc.Sprite).spriteFrame = (total_win > 0) ? this.sprite_status[0] : (total_win == 0) ? this.sprite_status[2] : this.sprite_status[1];

                        this.listBySessionBetContent.addChild(itemNode);
                    });
                }

                if (void 0 !== dataSession.sum) {
                    const data = dataSession.sum;
                    if (void 0 !== data.total_bet) {
                        this.bySessionBet_total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
                    }
                    if (void 0 !== data.total_refurn) {
                        this.bySessionBet_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
                    }
                    if (void 0 !== data.total_fee) {
                        this.bySessionBet_total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
                    }
                    if (void 0 !== data.total_win_real && void 0 !== data.total_lose) {
                        let color = (data.total_win_real - data.total_lose) > 0 ? "#00FF00" : (data.total_win_real - data.total_lose) == 0 ? "#FFFFFF" : "#FF0000";
                        this.bySessionBet_total_profit.string = ((data.total_win_real - data.total_lose) > 0 ? "+" : (data.total_win_real - data.total_lose) == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(data.total_win_real - data.total_lose), 2);
                        this.bySessionBet_total_profit.node.color = cc.color().fromHEX(color); // Set màu
                    }
                }

                break;

            //=== SIC BO ===//
            case this.gameCategoryEnum.SICBO:

                this.BET_DOOR_ENUM = {
                    "small": "XỈU",
                    "big": "TÀI",

                    // ===== Tổng điểm 4–17 =====
                    "sum_4": "TỔNG 4",
                    "sum_5": "TỔNG 5",
                    "sum_6": "TỔNG 6",
                    "sum_7": "TỔNG 7",
                    "sum_8": "TỔNG 8",
                    "sum_9": "TỔNG 9",
                    "sum_10": "TỔNG 10",
                    "sum_11": "TỔNG 11",
                    "sum_12": "TỔNG 12",
                    "sum_13": "TỔNG 13",
                    "sum_14": "TỔNG 14",
                    "sum_15": "TỔNG 15",
                    "sum_16": "TỔNG 16",
                    "sum_17": "TỔNG 17",

                    // ===== Triple =====
                    "triple_any": "BỘ BA BẤT KỲ",
                    "triple_1": "BỘ BA 1",
                    "triple_2": "BỘ BA 2",
                    "triple_3": "BỘ BA 3",
                    "triple_4": "BỘ BA 4",
                    "triple_5": "BỘ BA 5",
                    "triple_6": "BỘ BA 6",

                    // ===== Double =====
                    "double_1": "BỘ ĐÔI 1",
                    "double_2": "BỘ ĐÔI 2",
                    "double_3": "BỘ ĐÔI 3",
                    "double_4": "BỘ ĐÔI 4",
                    "double_5": "BỘ ĐÔI 5",
                    "double_6": "BỘ ĐÔI 6",

                    // ===== Single =====
                    "single_1": "MẶT 1",
                    "single_2": "MẶT 2",
                    "single_3": "MẶT 3",
                    "single_4": "MẶT 4",
                    "single_5": "MẶT 5",
                    "single_6": "MẶT 6",

                    // ===== Pair =====
                    "pair_1_2": "CẶP 1-2",
                    "pair_1_3": "CẶP 1-3",
                    "pair_1_4": "CẶP 1-4",
                    "pair_1_5": "CẶP 1-5",
                    "pair_1_6": "CẶP 1-6",
                    "pair_2_3": "CẶP 2-3",
                    "pair_2_4": "CẶP 2-4",
                    "pair_2_5": "CẶP 2-5",
                    "pair_2_6": "CẶP 2-6",
                    "pair_3_4": "CẶP 3-4",
                    "pair_3_5": "CẶP 3-5",
                    "pair_3_6": "CẶP 3-6",
                    "pair_4_5": "CẶP 4-5",
                    "pair_4_6": "CẶP 4-6",
                    "pair_5_6": "CẶP 5-6"
                };

                if (void 0 != dataSession.data_bet) {
                    const data = dataSession.data_bet;

                    const transform_result = {};

                    data.forEach(item => {
                        const bet_door = item.bet_door;
                        if (!transform_result[bet_door]) transform_result[bet_door] = {
                            fee: 0,
                            total_bet: 0,
                            total_refurn: 0,
                            total_win: 0,
                            total_lose: 0,
                            total_win_real: 0
                        };
                        transform_result[bet_door].fee += item.fee;
                        transform_result[bet_door].total_bet += item.total_bet;
                        transform_result[bet_door].total_refurn += item.total_refurn;
                        transform_result[bet_door].total_win += item.total_win;
                        transform_result[bet_door].total_lose += item.total_lose;
                        transform_result[bet_door].total_win_real += item.total_win_real;
                    });

                    Object.entries(transform_result).forEach(([bet_door, item]) => {
                        const itemNode = cc.instantiate(this.Sicbo_ItemBySessionBetPrefab);
                        const nodeComp = itemNode.getComponent("Lobby.Popup.History_Bet.Sicbo.BySessionBet.Item.Controller");
                        nodeComp.init(this);

                        nodeComp.session.string = "Phiên: #" + dataSession.session + " - Bàn chơi: " + dataSession["data_bet"][0]["room_code"];
                        nodeComp.time.string = cc.CORE.UTIL.getStringDateByTime(dataSession.session_data.session_time);
                        if (void 0 !== dataSession.session_data.session_result) nodeComp.setResultDot(dataSession.session_data.session_result);

                        nodeComp.bet_door.string = this.BET_DOOR_ENUM[bet_door];
                        nodeComp.bet_door1.string = this.BET_DOOR_ENUM[bet_door];

                        nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.fee, 2);
                        nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                        nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);

                        let total_win = 0;
                        if (item.total_win > 0) {
                            total_win = item.total_win_real;
                        } else if (item.total_win == 0) {
                            total_win = -item.total_lose;
                        }

                        nodeComp.total_win.string = (total_win > 0 ? "+" : (total_win == 0) ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(total_win), 2);
                        nodeComp.total_win.node.color = (total_win > 0) ? cc.color().fromHEX("#00FF00") : (total_win == 0) ? cc.color().fromHEX("#FFFFFF") : cc.color().fromHEX("#FF0000");

                        nodeComp.status.getComponent(cc.Sprite).spriteFrame = (total_win > 0) ? this.sprite_status[0] : (total_win == 0) ? this.sprite_status[2] : this.sprite_status[1];

                        this.listBySessionBetContent.addChild(itemNode);
                    });
                }

                if (void 0 !== dataSession.sum) {
                    const data = dataSession.sum;
                    if (void 0 !== data.total_bet) {
                        this.bySessionBet_total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
                    }
                    if (void 0 !== data.total_refurn) {
                        this.bySessionBet_total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
                    }
                    if (void 0 !== data.total_fee) {
                        this.bySessionBet_total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
                    }
                    if (void 0 !== data.total_win_real && void 0 !== data.total_lose) {
                        let color = (data.total_win_real - data.total_lose) > 0 ? "#00FF00" : (data.total_win_real - data.total_lose) == 0 ? "#FFFFFF" : "#FF0000";
                        this.bySessionBet_total_profit.string = ((data.total_win_real - data.total_lose) > 0 ? "+" : (data.total_win_real - data.total_lose) == 0 ? "" : "-") + cc.CORE.UTIL.abbreviateNumber(Math.abs(data.total_win_real - data.total_lose), 2);
                        this.bySessionBet_total_profit.node.color = cc.color().fromHEX(color); // Set màu
                    }
                }

                break;
        }

    },

    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
        // show btn back
        if (this.state_time == "days" && this.state_show == "view_by_session") {
            this.btnBack.active = false;
        } else {
            this.btnBack.active = (this.state_show == "view_by_date") ? false : true;
        }
    }
});
