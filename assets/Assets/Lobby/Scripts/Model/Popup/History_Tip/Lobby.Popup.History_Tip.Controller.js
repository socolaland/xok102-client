const AssetManager = require("AssetManager");
const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        listContent: cc.Node,
        ItemPrefab: cc.Prefab,
        pagination: cc.Node,
    },

    init(obj) {
        this.CORE = this;
        this.STATUS_TEXT_ENUM = {
            "pending": "Đang cập nhật",
            "success": "Hoàn tất",
            "error": "Thất bại",
            "processing": "Đang xử lý",
            "timeout": "Hết hạn",
            "error_exception": "Lỗi hệ thống",
        }
        this.STATUS_COLOR_ENUM = {
            "pending": "#00FF3D",
            "success": "#00FF3D",
            "error": "#FF0000",
            "processing": "#FFB800",
            "timeout": "#FF0000",
            "error_exception": "#FF0000",
        }
        this.GAME_NAME_ENUM = {
            "xocdia": "Xóc Đĩa",
            "taixiu": "Tài Xỉu",
            "bongda": "Bóng Đá",
            "xoso": "Xổ Số"
        }

        AssetManager.loadFromBundle("Common_Bundle", `Prefabs/Pagination`, cc.Prefab).then(Prefab => {
            var pagination = cc.instantiate(Prefab);
            this.pagination.addChild(pagination);
            this.pagination = pagination.getComponent('Pagination');
            this.pagination.init(this);
        }).catch(err => console.log("❌ Error loading:", err));
    },
    onLoad() {
    },
    onLoad() {
    },
    onEnable() {
        this.getDataPage(1);
    },
    getDataPage(page, limit = 5) {
        HttpRequest.Get(
            `${cc.CORE.CONFIG.SERVER_API}/tip/tip-list`, 
            {
                page: page,
                limit: limit,
                //fields: "id, gate_name,regAmount,recAmount,actAmount,status,createdAt,bank_code,feeAmount,feePercent,gate_type,transaction_id,transaction_type"
            },
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                this.onData(result.data);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        });
    },
    onRefresh: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.getDataPage(1);
    },
    onData: function (dataHistory) {
        this.listContent.removeAllChildren();
        if (void 0 != dataHistory.result) {
            const data = dataHistory.result;
            data.forEach(item => {
                const itemNode = cc.instantiate(this.ItemPrefab);
                const nodeComp = itemNode.getComponent("Lobby.Popup.History_Tip.Item.Controller");
                nodeComp.init(this, item);
                nodeComp.time.string = cc.CORE.UTIL.getStringDateByTimeNoYear(item.createdAt);
                nodeComp.game.string = this.GAME_NAME_ENUM[item.game_name];
                nodeComp.room.string = item.room_code;
                nodeComp.session.string = "#"+item.session;
                nodeComp.amount.string = cc.CORE.UTIL.numberWithCommas(item.amount, 2);
                this.listContent.addChild(itemNode);
            });
        }
        
        if (void 0 !== dataHistory.total && void 0 !== dataHistory.page && void 0 !== dataHistory.limit) {
            const data = dataHistory;
            this.pagination.onSet(data.page, data.limit, data.total);
        }
    },
    onClickItem(data) {
        cc.log(data);
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
