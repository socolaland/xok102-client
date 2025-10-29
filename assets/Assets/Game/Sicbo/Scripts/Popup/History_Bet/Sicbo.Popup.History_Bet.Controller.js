const AssetManager = require("AssetManager");

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
        },
    },

    init(obj) {
        this.CORE = obj;
        this.BET_DOOR_ENUM = {
            "even": "CHẴN",
            "odd": "LẺ",
            "even_low": "CHẴN",
            "odd_low": "LẺ",
            "even_high": "CHẴN",    
            "odd_high": "LẺ",
            "red3": "3 ĐỎ",
            "red4": "4 ĐỎ",
            "white3": "3 TRẮNG",
            "white4": "4 TRẮNG"
        };

        AssetManager.loadFromBundle("Common_Bundle", `Prefabs/Pagination`, cc.Prefab).then(Prefab => {
            var pagination = cc.instantiate(Prefab);
            this.pagination.addChild(pagination);
            this.pagination = pagination.getComponent('Pagination');
            this.pagination.init(this);
        }).catch(err => console.log("❌ Error loading:", err));

    },
    onLoad() {
    },
    onEnable() {
        cc.CORE.GAME_SCENCE.VideoStream.node.active = false;
        this.getDataPage(1);
        cc.CORE.GAME_SCENCE.isPopupOpen = true;
    },
    onDisable() {
        cc.CORE.GAME_SCENCE.VideoStream.node.active = true;
        cc.CORE.GAME_SCENCE.isPopupOpen = false;
    },
    toggle() {
        this.node.active = !this.node.active;
        cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    onData(data_history) {
        this.content.removeAllChildren();
        if (void 0 !== data_history.sum) {
            const data = data_history.sum;
            if (void 0 !== data.total_bet) {
                this.total_bet.string = cc.CORE.UTIL.abbreviateNumber(data.total_bet, 2);
            }
            if (void 0 !== data.total_refurn) {
                this.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(data.total_refurn, 2);
            }
            if (void 0 !== data.total_fee) {
                this.total_fee.string = cc.CORE.UTIL.abbreviateNumber(data.total_fee, 2);
            }
            if (void 0 !== data.total_win && void 0 !== data.total_lose) {
                let color = (data.total_win - data.total_lose) > 0 ? "#00FF00" : "#FF0000";
                this.total_profit.string = cc.CORE.UTIL.abbreviateNumber(data.total_win - data.total_lose, 2);
                this.total_profit.node.color = cc.color().fromHEX(color); // Set màu
            }
        }

        if (void 0 !== data_history.data) {
            const data = data_history.data;
            data.forEach(item => {
                const itemNode = cc.instantiate(this.ItemPrefab);
                const nodeComp = itemNode.getComponent("Sicbo.Popup.History_Bet.Item.Controller");
                nodeComp.init(this);

                let bet_door = "...";
                Object.keys(this.BET_DOOR_ENUM).forEach(key => {
                    if (item[key] && item[key] > 0) bet_door = this.BET_DOOR_ENUM[key]; return;
                });
                if (bet_door == "...") {
                    nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(0, 2);
                } else {
                    nodeComp.fee.string = cc.CORE.UTIL.abbreviateNumber(item.fee, 2);
                }
                nodeComp.bet_door.string = bet_door;

                if (void 0 !== item.result) {
                    nodeComp.setResult(item.result);
                }
                if (void 0 !== item.is_win) {
                    nodeComp.status.getComponent(cc.Sprite).spriteFrame = (item.is_win) ? this.sprite_status[0] : this.sprite_status[1];
                }
                nodeComp.username.string = cc.CORE.USER.username.toUpperCase();
                nodeComp.session.string = "#" + item.session;
                nodeComp.time.string = cc.CORE.UTIL.getStringDateByTime(item.createdAt);
                nodeComp.total_bet.string = cc.CORE.UTIL.abbreviateNumber(item.total_bet, 2);
                nodeComp.total_refurn.string = cc.CORE.UTIL.abbreviateNumber(item.total_refurn, 2);
                nodeComp.total_win.string = cc.CORE.UTIL.abbreviateNumber(item.total_win, 2);
                nodeComp.total_win.node.color = (item.total_win > 0) ? cc.color().fromHEX("#00FF00") : cc.color().fromHEX("#FF0000");

                this.content.addChild(itemNode);
            });
        }
        if (void 0 !== data_history.total && void 0 !== data_history.page && void 0 !== data_history.limit) {
            const data = data_history;
            this.pagination.onSet(data.page, data.limit, data.total);
        }
    },
    getDataPage(page, limit = 4) {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    get_history_bet: {
                        get_list: {
                            room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                            page: page,
                            limit: limit
                        }
                    }
                }
            }
        });
    },
    update(dt) {
    }
});
