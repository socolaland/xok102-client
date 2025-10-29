// require("polyfill/runtime"); // đảm bảo đúng đường dẫn tới file bạn vừa thêm

const AssetManager = require("AssetManager");
const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        scrollView: cc.ScrollView,
        listContent: cc.Node,
        ItemPrefab: cc.Prefab,
        pagination: cc.Node,
        searchInput: cc.EditBox,
        searchBtn: cc.Node,
        btnLiked: cc.Node,
        empty_data: cc.Node,

        loadingOverlay: cc.Node,

        loadListOverlay: cc.Node,
    },

    init(obj) {
        this.CORE = this;
        this.liked = false;
        this.search = null;
        this.product_type = null;
        this.category = null;

        AssetManager.loadFromBundle("Common_Bundle", `Prefabs/Pagination`, cc.Prefab).then(Prefab => {
            var pagination = cc.instantiate(Prefab);
            this.pagination.addChild(pagination);
            this.pagination = pagination.getComponent('Pagination');
            this.pagination.init(this);
        }).catch(err => console.log("❌ Error loading:", err));
    },
    onEnable() {
        this.clean();
        this.btnLiked.color = new cc.Color().fromHEX("#FFFFFF");
        this.liked = false;
    },
    onDisable() {
        this.clean();
        this.loadListOverlay.active = false;
    },
    clean() {
        this.listContent.removeAllChildren();
        this.searchInput.string = "";
        this.liked = false;
    },
    setCall(product_type = null, category = null) {
        this.product_type = product_type;
        this.category = category;
    },
    onLoad() {
    },
    onClickItem(data) {
        cc.log(data);
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
        this.liked = false;
    },
    onSearch() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.getGameApiList();
    },
    onClickLiked() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.liked = !this.liked;
        if (this.liked) {
            this.btnLiked.color = new cc.Color().fromHEX("#FFEB00");
        } else {
            this.btnLiked.color = new cc.Color().fromHEX("#FFFFFF");
        }
        if (this.liked) {
            this.getFavoriteList();
        } else {
            this.getGameApiList();
        }
    },
    postFavorite(gameSelected, is_favorite) {
        cc.CORE.GAME_SCENCE.PlayClick();
        const data = {
            game_code: gameSelected.game_code,
            product_type: gameSelected.product_type,
        }

        if (is_favorite) {
            HttpRequest.Post(
                `${cc.CORE.CONFIG.SERVER_API}/game-api/add-favorite`,
                {}, data,
                { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
            ).then(result => {
                if (result.error_code == 0) {

                } else {
                    cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
                }
            }).catch(e => {
                console.log(e);
                return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
            })
        } else {
            HttpRequest.Post(
                `${cc.CORE.CONFIG.SERVER_API}/game-api/remove-favorite`,
                {}, data,
                { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
            ).then(result => {
                if (result.error_code == 0) {

                } else {
                    cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
                }
            })
        }

    },
    getFavoriteList: function () {
        this.listContent.removeAllChildren();

        this.loadListOverlay.active = true;
        this.empty_data.active = false;

        HttpRequest.Get(
            `${cc.CORE.CONFIG.SERVER_API}/game-api/favorite-list?product_type=${this.product_type}&game_type=${this.category}`,
            {},
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            this.listContent.removeAllChildren();
            this.empty_data.active = result.data.length == 0;

            if (result.error_code == 0) {
                Promise.all(result.data.map(async item => {
                    const itemNode = cc.instantiate(this.ItemPrefab);
                    const nodeComp = itemNode.getComponent("Lobby.Popup.GameApi.Item.Controller");
                    nodeComp.init(this, item);
                    await nodeComp.setIcon(`${cc.CORE.CONFIG.SERVER_API}/game-api/fetch-icon-game?url=${encodeURIComponent(item.game_icon)}`);
                    nodeComp.setGameName(cc.CORE.UTIL.cutText(item.game_name, 10));

                    if (item.is_favorite) {
                        nodeComp.is_favorite = true;
                        nodeComp.setLiked(true);
                    }

                    this.listContent.addChild(itemNode);
                }));

                if (void 0 !== result.data.total && void 0 !== result.data.page && void 0 !== result.data.limit) {
                    this.pagination.onSet(result.data.page, result.data.limit, result.data.total);
                }

                // ẩn pagination
                this.pagination.node.active = false;
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }

            this.loadListOverlay.active = false;
        }).catch(e => {
            this.loadListOverlay.active = false;
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    getGameApiList: function (page = 1, limit = 21) {
        let querySearch = "";
        let queryLiked = "";
        if (this.searchInput.string !== "") querySearch = `&game_name=${this.searchInput.string}`;
        if (this.liked) queryLiked = `&liked=true`;

        this.loadListOverlay.active = true;
        this.empty_data.active = false;

        HttpRequest.Get(
            `${cc.CORE.CONFIG.SERVER_API}/game-api/game-list?product_type=${this.product_type}&game_type=${this.category}&page=${page}&limit=${limit}${querySearch}${queryLiked}`,
            {},
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            this.listContent.removeAllChildren();

            if (result.error_code == 0) {
                this.empty_data.active = (result.data.result.length == 0) ? true : false;

                Promise.all(result.data.result.map(async item => {
                    const itemNode = cc.instantiate(this.ItemPrefab);
                    const nodeComp = itemNode.getComponent("Lobby.Popup.GameApi.Item.Controller");
                    await nodeComp.init(this, item);
                    await nodeComp.setIcon(`${cc.CORE.CONFIG.SERVER_API}/game-api/fetch-icon-game?url=${encodeURIComponent(item.game_icon)}`);
                    nodeComp.setGameName(cc.CORE.UTIL.cutText(item.game_name, 10));

                    if (item.status != "ACTIVATED") {
                        nodeComp.setMaintain(true);
                    }

                    if (item.is_favorite) {
                        nodeComp.is_favorite = true;
                        nodeComp.setLiked(true);
                    }

                    this.listContent.addChild(itemNode);
                }));

                if (void 0 !== result.data.total && void 0 !== result.data.page && void 0 !== result.data.limit) {
                    this.pagination.onSet(result.data.page, result.data.limit, result.data.total);
                }
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }

            this.loadListOverlay.active = false;
        }).catch(e => {
            this.loadListOverlay.active = false;
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    lauchGame(gameSelected) {
        cc.CORE.GAME_SCENCE.PlayClick();

        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");

        this.loadingOverlay.active = true;
        const data = {
            game_code: gameSelected.game_code,
            product_type: gameSelected.product_type,
        }
        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/game-api/launch-game`,
            {}, data,
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                cc.log("result", result);

                if (void 0 !== result.data && void 0 !== result.data.code && result.data.code == 200) {
                    if (result.data.content !== "") {
                        HttpRequest.Post(
                            `${cc.CORE.CONFIG.SERVER_API}/game-api/host-game`,
                            {}, {
                            data: result.data.content
                        },
                            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
                        ).then(result => {
                            cc.log("result", result);
                            if (result.error_code == 0) {
                                cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(result.url);
                                cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                                // if (cc.sys.isNative) {
                                //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.createOverlayIframe();
                                // }else {
                                //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                                // }
                                // cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                            } else {
                                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
                            }
                        }).catch(e => {
                            console.log(e);
                            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
                        })
                    } else {
                        if (void 0 !== result.data.url) {
                            cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(result.data.url);                        
                            cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                            // if (cc.sys.isNative) {
                            //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.createOverlayIframe();
                            // }else {
                            //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                            // }
                            // cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                        } else {
                            cc.log("result", result.data);
                            cc.CORE.GAME_SCENCE.FastNotify("Trò chơi đang được bảo trì!", "error", 1, 1, true);
                        }
                    }
                } else {
                    cc.log("result", result);
                    cc.CORE.GAME_SCENCE.FastNotify("Trò chơi đang được bảo trì!", "error", 1, 1, true);
                }
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
            this.loadingOverlay.active = false;
        }).catch(e => {
            this.loadingOverlay.active = false;
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },

    getDataPage(page, limit = 21) {
        this.scrollView.scrollToTop(0.5, true); // Cuộn mượt đến đầu trong 0.2 giây
        this.getGameApiList(page, limit);
    },

    update(dt) {
    }
});
