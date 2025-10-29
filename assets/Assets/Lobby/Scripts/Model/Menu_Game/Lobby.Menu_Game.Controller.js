const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");
const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        XocdiaSelectRoomPrefab: cc.Prefab,
        maskView: cc.Node,
    },

    // onLoad () {},
    init: function (obj) {
        this.CORE = obj;
    },
    onResize() {
        try {
            const bonusHeightSize = 500;
            var visibleHeight = cc.view.getVisibleSize().height;
            var bottomMenuHeight = 100 + bonusHeightSize;
            // var dynamicHeight = cc.sys.isNative && cc.CORE.UTIL.isDynamicDevice() ? 80 : 0;
            var dynamicHeight = 0;
            // Cập nhật lại chiều cao node `view`
            var currentSize = this.maskView.getContentSize();
            this.maskView.setContentSize(currentSize.width, visibleHeight - bottomMenuHeight - dynamicHeight);   
        }catch (e) {
            cc.log(e);
        }
    },
    onEnable() {
        window.addEventListener("resize", this.onResize.bind(this));
        this.onResize();
    },
    showDialog_Xocdia_Select_Room: function (event) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");

        const nodePrefab = cc.instantiate(this.XocdiaSelectRoomPrefab);
        const prefabComponent = nodePrefab.getComponent('Lobby.Dialog.Xocdia_Select_Room.Controller');
        prefabComponent.init(this);
        this.CORE.prefabNode.addChild(nodePrefab);
    },
    closeDialog_Xocdia_Select_Room: function (event) {
        try {
            const dialog = this.CORE.prefabNode.getChildByName("Lobby.Dialog.Xocdia_Select_Room");
            dialog.getComponent('Lobby.Dialog.Xocdia_Select_Room.Controller').node.destroy();
        } catch (e) {
            // console.log(e);
        }
    },
    onMaintanace: function () {
        return cc.CORE.GAME_SCENCE.FastNotify("Trò chơi đang trong quá trình phát triển!", "info", 1);
    },
    regEventJoinGame: function (event, gameName) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        switch (gameName) {
            case "SICBO":
                const room_code = "public_1";
                cc.CORE.NETWORK.APP.Send({
                    event: "game",
                    data: {
                        sicbo: {
                            join: {
                                room_code,
                                password: null
                            }
                        }
                    }
                });
                break;
        }
    },
    openGame: function (event, gameName) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");

        const GameOpen = require("GameLoad.Controller").GetGameOpen(gameName); // lấy game cần mở
        cc.log(GameOpen);

        if (GameOpen.resource_bundle !== null) {

            cc.CORE.UTIL.showLoading(1);

            if (GameOpen.resource_bundle.length > 0) {

                // 2. Load bundle + asset, có tiến trình thực
                AssetManager.loadMultipleBundlesWithAssetProgress(GameOpen.resource_bundle, (percent) => {
                    // console.log(`📦 Tổng tiến trình load asset: ${percent}%`);
                    // cc.CORE.UTIL.showLoading(0);

                    cc.CORE.UTIL["setLoadingPercent"](Number(percent));
                }).then(bundles => {
                    console.log('🎉 Load xong tất cả asset trong các bundle!');
                    
                    if (void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo) {
                        clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
                    }
                    cc.director.loadScene(GameOpen.resource_name);
                });

                // AssetManager.loadMultipleBundles(GameOpen.resource_bundle).then(bundles => {
                //     // cc.CORE.UTIL.showLoading(0);
                //     cc.CORE.UTIL["setLoadingPercent"](100);
                //     if (void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo) {
                //         clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
                //     }
                //     cc.director.loadScene(GameOpen.resource_name);
                // }).catch(err => {
                //     cc.log(err);
                //     cc.CORE.UTIL.showLoading(0);
                //     return cc.CORE.GAME_SCENCE.FastNotify("Lỗi: Tải gói tài nguyên trò chơi thất bại!", "error", 1, 1, true);
                // });
            } else if (GameOpen.resource_bundle.length == 1) {
                let percentBundleLoaded = 0;
                cc.assetManager.loadBundle(GameOpen.resource_bundle,
                    (completedCount, totalCount, item) => {
                        let tempPercent = Math.round(100 * completedCount / totalCount);
                        if (tempPercent > percentBundleLoaded) percentBundleLoaded = tempPercent;
                        // this.updateProgress(totalCount, completedCount);
                    },
                    (err, bundle) => {
                        if (err) {
                            cc.log(err);
                            return;
                            return seft.messageLabel.string = "Lỗi: Tải gói tài nguyên trò chơi thất bại!";
                        }
                        // cc.log(bundle);

                        // mở scence
                        if (GameOpen.resource_type) {
                            let percent = 0;
                            cc.director.preloadScene(GameOpen.resource_name,
                                (completedCount, totalCount, item) => {
                                    let tempPercent = Math.round(100 * completedCount / totalCount);
                                    if (tempPercent > percent) percent = tempPercent;
                                    // this.updateProgress(totalCount, percent);
                                },
                                (err) => {
                                    if (err) {
                                        cc.log(err);
                                        return;
                                        // return seft.messageLabel.string = "Lỗi: Mở trò chơi thất bại!";
                                    }
                                    cc.CORE.UTIL.showLoading(0);
                                    if (void 0 !== cc.CORE.TASK_REGISTRY.intervalGetUserInfo) {
                                        clearInterval(cc.CORE.TASK_REGISTRY.intervalGetUserInfo);
                                    }
                                    cc.director.loadScene(GameOpen.resource_name);
                                });
                            return;
                        }

                    });
            }

        }
    },

    // GAME API SEAMLESS
    lauchGameApi(event, value) {

        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");

        const gameData = value;
        if (!gameData) return cc.CORE.GAME_SCENCE.FastNotify("Trò chơi không hợp lệ!", "error", 1, 1, true);
        const parseGameData = gameData.split("|");
        if (parseGameData.length !== 2) return cc.CORE.GAME_SCENCE.FastNotify("Trò chơi không hợp lệ!", "error", 1, 1, true);

        const productType = parseGameData[0];
        const gameCode = parseGameData[1];

        cc.CORE.UTIL.showLoading(1);

        const data = {
            game_code: gameCode,
            product_type: productType,
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
                                cc.log("result.url", result.url);
                                cc.CORE.GAME_SCENCE.Popup.GameApiDirect.setPlayUrl(result.url);
                                // if (cc.sys.isNative) {
                                //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.createOverlayIframe();
                                // }else {
                                //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                                // }
                                cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
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
                            // if (cc.sys.isNative) {
                            //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.createOverlayIframe();
                            // }else {
                            //     cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                            // }
                            cc.CORE.GAME_SCENCE.Popup.GameApiDirect.toggle();
                        } else {
                            cc.log("result", result.data);
                            cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, true);
                        }
                    }

                } else {
                    cc.log("result", result);
                    cc.CORE.GAME_SCENCE.FastNotify("Có lỗi xảy ra, vui lòng thử lại sau!", "error", 1, 1, true);
                }
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
            cc.CORE.UTIL.showLoading(0);
        }).catch(e => {
            console.log(e);
            cc.CORE.UTIL.showLoading(0);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },

    setTitleGameApi: function (eveny, title = "") {
        cc.CORE.GAME_SCENCE.Popup.GameApi.title.string = title.toUpperCase();
    },
    showGameApiList_Slot: function (event, product_type) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(product_type, "SLOT");
        cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
        cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
    },
    showGameApiList_Casino: function (event, product_type) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(product_type, "LIVE_CASINO,LIVE_CASINO_PREMIUM");
        cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
        cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
    },
    showGameApiList_Sport: function (event, product_type) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(product_type, "SPORT_BOOK");
        cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
        cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
    },
    showGameApiList_Lottery: function (event, product_type) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(product_type, "LOTTERY");
        cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
        cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
    },
    showGameApiList_Fishing: function (event, product_type) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(product_type, "FISHING");
        cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
        cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
    },
    showGameApiList_Other: function (event, product_type) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");
        cc.CORE.GAME_SCENCE.Popup.GameApi.setCall(product_type, "OTHER");
        cc.CORE.GAME_SCENCE.Popup.GameApi.getGameApiList();
        cc.CORE.GAME_SCENCE.Popup.GameApi.toggle();
    },

    // GAME API TRANSFER WALLET
    showPopupGameApiTransferWallet: function (event, customData) {
        cc.CORE.GAME_SCENCE.Popup.GameApiTransferWallet.setDataGameApiTransferWallet(event, customData);
        cc.CORE.GAME_SCENCE.Popup.show("game_api_transfer_wallet");
    },
    // update (dt) {},
});

