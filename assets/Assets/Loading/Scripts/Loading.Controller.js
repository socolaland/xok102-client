const CONFIG = require('Config');
const ENVIRONMENT_ENUM = require('Environment_Enum');
const HttpRequest = require('HttpRequest');
const AssetManager = require('AssetManager');
require('BrowserUtil').isVisibleTab();
require("GameInit.Controller").initState();
require('LocalStorage').initState();
require("GameLoad.Controller").initState();
require("GameInit.Controller").getCurrentIP();
// require("Helper").forceEnableAudio();

cc.Class({
    extends: cc.Component,
    properties: {
        messageLabel: cc.Label,
        descriptionLabel: cc.Label,
        versionLabel: cc.Label,
        manifestUrl: {
            default: null,
            type: cc.Asset,
        },
        retryButtonNode: cc.Node,
        // processBarCircle: cc.ProgressBar,
        // loadingPercent: cc.Label,

        processBarLine: cc.Node,

        startIcon: cc.Node,

        // debug panel
        debugPanel: cc.Node,
        debugPanel_current_load: cc.Label,
        debugPanel_total_count: cc.Label,
        debugPanel_percent: cc.Label,

        maintance_text: cc.Label,

        _currentPercentLoaded: 0,
        _am: null,
        _updating: !1,
        _canRetry: !1,
        _storagePath: ""
    },
    onLoad: function () {
        cc.inGame = this;
        this.isLoadScene = !1;
        this.isLoadConfig = !1;
        this.initGamePlay();
        this.initOneSign();
        this.initClientIp();
    
        // cc.game.on(cc.game.EVENT_ENGINE_INITED, function() {
        //     cc.CORE.UTIL.setFrameRate(120);
        // });

        // const viewportWidth = window.innerWidth;
        // const viewportHeight = window.innerHeight;

        // console.log('Viewport width:', viewportWidth);
        // console.log('Viewport height:', viewportHeight);

    },
    initGamePlay: function () {
        cc.log(`Environment: ${CONFIG.ENVIRONMENT}`);
        var seft = this;
        cc.ProjectAsset = JSON.parse(this.manifestUrl._nativeAsset);
        // console.log(cc.ProjectAsset);

        HttpRequest.Get(`${CONFIG.SERVER_API}/setting?keys=maintenance_status,maintenance_text,application_version`, {}, {}, {})
            .then(result => {
                if (result?.error_code == 0) {
                    const maintenanceStatus = this.getSettingByKey(result.data, "maintenance_status");
                    const maintenanceText = this.getSettingByKey(result.data, "maintenance_text");
                    const applicationVersion = this.getSettingByKey(result.data, "application_version");
                    localStorage.setItem('APP_VERSION', applicationVersion);
                    this.versionLabel.node.active = true;
                    this.versionLabel.string = applicationVersion;

                    if (maintenanceStatus == "1") {
                        this.maintance_text.string = maintenanceText;
                        this.maintance_text.node.active = true;
                    } else {
                        this.maintance_text.node.active = false;
                        if (CONFIG.ENVIRONMENT == ENVIRONMENT_ENUM.DEVELOPMENT) { // bỏ qua hot update 
                            seft.loadAssets();
                        } else { // yêu cầu hot update nếu đang không sử dụng trình duyệt

                            // test
                            // seft.loadAssets();
                            // return;

                            // làm chậm 1 chút
                            setTimeout(function () {
                                cc.sys.isBrowser ? seft.loadAssets() : (seft.initHotUpdate(), seft.checkUpdate());
                            }.bind(this), 2000);
                        }
                    }
                }
            }).catch(e => {
                console.log(e);
                this.maintance_text.string = `Lỗi: ${e.message}`;
                this.maintance_text.node.active = true;
            });
    },
    initClientIp: function () {
        cc.CORE.UTIL.getClientIp();
    },
    initOneSign: function () {
        this.checkPlugin() && (sdkbox.PluginOneSignal.init(),
            sdkbox.PluginOneSignal.setListener({
                onSendTag: function (t, e, i) { },
                onGetTags: function (t) { },
                onIdsAvailable: function (t, e) { },
                onPostNotification: function (t, e) { },
                onNotification: function (t, e, i) { }
            }))
    },
    checkPlugin: function () {
        return "undefined" == typeof sdkbox ? (0, !1) : void 0 !== sdkbox.PluginOneSignal || (console.log("sdkbox.PluginFacebook is undefined"), !1)
    },
    loadAssets: function () {
        this.updateProgress(0, 0);
        this.messageLabel.string = "Đang tải trò chơi...";
        setTimeout(function () {
            this.loadCommonResource();
        }.bind(this), 1000);
    },
    loadCommonResource: function () {
        var seft = this;
        this.messageLabel.string = "Đang tải gói tài nguyên chung...";
        // Common_Bundle (Main Assets Resource (Font, Paracicle, Texture, ...))
        let percentBundleLoaded = 0;
        cc.assetManager.loadBundle("Common_Bundle",
            (completedCount, totalCount, item) => {
                let tempPercent = Math.round(100 * completedCount / totalCount);
                if (tempPercent > percentBundleLoaded) percentBundleLoaded = tempPercent;
                this.updateProgress(totalCount, percent);
            },
            (err, bundle) => {
                if (err) {
                    cc.log(err);
                    return seft.messageLabel.string = "Lỗi: Tải gói tài nguyên chung thất bại!";
                }
                // cc.log(bundle);
                this.loadGameResource();
            }
        );
    },
    loadGameResource: function () {
        const seft = this;
        seft.messageLabel.string = "Đang tải gói tài nguyên trò chơi...";

        const GameOpen = require("GameLoad.Controller").GetGameOpen(); // lấy game cần mở

        console.log('Open Game: ', GameOpen);

        if (GameOpen.resource_bundle !== null) {

            // GameOpen.resource_bundle = "Lobby_Bundle";

            let percentBundleLoaded = 0;
            cc.assetManager.loadBundle(GameOpen.resource_bundle,
                (completedCount, totalCount, item) => {
                    let tempPercent = Math.round(100 * completedCount / totalCount);
                    if (tempPercent > percentBundleLoaded) percentBundleLoaded = tempPercent;
                    seft.updateProgress(totalCount, completedCount);
                    // cc.log(percentBundleLoaded);
                },
                (err, bundle) => {
                    if (err) {
                        cc.log(err);
                        return seft.messageLabel.string = "Lỗi: Tải gói tài nguyên trò chơi thất bại!";
                    }
                    // cc.log(bundle);

                    // mở scence
                    if (GameOpen.resource_type) {

                        let percent = 0;
                        cc.director.preloadScene(GameOpen.resource_name,
                            (completedCount, totalCount, item) => {
                                // cc.log(completedCount, totalCount, item);

                                seft.debugPanel.active = false;
                                seft.debugPanel_current_load.string = completedCount;
                                seft.debugPanel_total_count.string = totalCount;

                                let tempPercent = Math.round(100 * completedCount / totalCount);
                                if (tempPercent > percent) percent = tempPercent;
                                // cc.log(percent);
                                this.updateProgress(totalCount, percent);
                                seft.debugPanel_percent.string = percent + "%";
                            },
                            (err) => {
                                if (err) {
                                    cc.log(err);
                                    return seft.messageLabel.string = "Lỗi: Mở trò chơi thất bại!";
                                }
                                // load prefab popup                        
                                seft.messageLabel.string = "Đang khởi động trò chơi...";
                                // load prefab popup
                                AssetManager.loadFromBundle(GameOpen.resource_bundle, "Prefabs/Popup/Lobby.Popup", cc.Prefab)
                                    .then(prefab => {
                                        cc.director.loadScene(GameOpen.resource_name);
                                    })
                                    .catch(err => {
                                        console.error("❌ Error loading prefab:", err);
                                        seft.messageLabel.string = "Lỗi: Khởi động trò chơi thất bại!";
                                    });
                            });
                        return;

                    }
                });
        }
    },
    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    },
    // initHotUpdate: function () {
    //     this.updateProgress(0, 0);
    //     this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
    //     this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
    //     this._am.setVerifyCallback(function (t, e) {
    //         e.compressed;
    //         return !0
    //     }
    //         .bind(this));
    //     cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
    // },
    initHotUpdate: function () {
        this.updateProgress(0, 0);
        // storagePath với dấu / cuối
        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/";
        cc.log("[HotUpdate] storagePath:", this._storagePath);
    
        // Khởi tạo AssetsManager với manifestUrl.nativeUrl ngay từ đầu
        this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, this._storagePath, this.versionCompareHandle);
    
        this._am.setVerifyCallback(function (path, asset) {
            cc.log('[HotUpdate] Verifying asset:', path);
            return true;
        });
    
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }
    },
    
    checkUpdate: function () {
        if (this._updating) {
            this.messageLabel.string = "Kiểm tra phiên bản mới...";
            return;
        }

        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
        }

        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
    },
    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
            }
            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },
    retry: function () {
        !this._updating && this._canRetry && (this.retryButtonNode.active = !1,
            this._canRetry = !1,
            this.messageLabel.string = "Thử lại...",
            this._am.downloadFailedAssets())
    },
    checkCb: function (t) {
        var e = !1,
            i = !1;
        switch (t.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.messageLabel.string = "Không tìm thấy bảng kê khai cục bộ.";
                this.descriptionLabel.string = "Code: Đã xảy ra lỗi với bản kê khai từ xa!";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.messageLabel.string = "Không thể phân tích cú pháp manifest máy chủ.";
                this.descriptionLabel.string = "Code: Đã xảy ra lỗi với bản kê khai từ xa!";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.updateProgress(0, 100);
                this.messageLabel.string = "Bạn đang sử dụng phiên bản mới nhất.";
                this.descriptionLabel.string = "Code: 200";
                e = !0;
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.messageLabel.string = "Đã tìm thấy phiên bản mới!";
                this.messageLabel.string = "Đã tìm thấy bản cập nhật mới.";
                this.descriptionLabel.string = "Code: 100 Đang cập nhật...";
                this.updateProgress(0, 0);
                i = true;
                break;
            default:
                return
        }
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = !1;
        i && (this.hotUpdate());
        e && this.loadAssets();
    },
    // updateCb: function (event) {
    //     var needRestart = false;
    //     var failed = false;
    //     switch (event.getEventCode()) {
    //         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
    //             this.messageLabel.string = "Không tìm thấy bảng kê khai cục bộ.";
    //             this.updateProgress(0, 0);
    //             this.descriptionLabel.string = "Code: 1007";
    //             this.retryButtonNode.active = !0;
    //             failed = true;
    //             break;
    //         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
    //             var AssetLoaded = event.getPercent() * 729;
    //             var PercentLoaded = (event.getPercent() * 100) >> 0;
    //             this.messageLabel.string = "Đang tải: " + PercentLoaded + "%";
    //             this.updateProgress(0, PercentLoaded);
    //             this.descriptionLabel.string = "Code: 1006";
    //             break;
    //         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
    //         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
    //             this.messageLabel.string = "Không thể phân tích cú pháp manifest máy chủ.";
    //             this.updateProgress(0, 0);
    //             this.descriptionLabel.string = "Code: 1005";
    //             this.retryButtonNode.active = !0;
    //             failed = true;
    //             break;
    //         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
    //             this.messageLabel.string = "Bạn đang sử dụng phiên bản mới nhất.";
    //             this.updateProgress(0, 0);
    //             this.descriptionLabel.string = "Code: 1004";
    //             this.retryButtonNode.active = !0;
    //             failed = true;
    //             break;
    //         case jsb.EventAssetsManager.UPDATE_FINISHED:
    //             this.messageLabel.string = "Cập nhật hoàn tất.\nTrò chơi sẽ được khởi động lại.";
    //             this.updateProgress(0, 100);
    //             this.descriptionLabel.string = "Code: 1003";
    //             this.retryButtonNode.active = !1;
    //             needRestart = true;
    //             break;
    //         case jsb.EventAssetsManager.UPDATE_FAILED:
    //             this.messageLabel.string = "Cập nhật phiên bản không thành công.";
    //             this.updateProgress(0, 100);
    //             this.descriptionLabel.string = "Code: 1002";
    //             this.retryButtonNode.active = !0;
    //             this._updating = !1;
    //             this._canRetry = !0;
    //             break;
    //         case jsb.EventAssetsManager.ERROR_UPDATING:
    //             this.messageLabel.string = "Cập nhật phiên bản không thành công.";
    //             this.updateProgress(0, 100);
    //             this.descriptionLabel.string = "Code: 1001";
    //             break;
    //         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
    //             this.messageLabel.string = event.getMessage();
    //             this.updateProgress(0, 100);
    //             this.descriptionLabel.string = "Code: 1000";
    //     }

    //     if (failed) {
    //         this._am.setEventCallback(null);
    //         this._updateListener = null;
    //         this._updating = false;
    //     }

    //     if (needRestart) {
    //         this._am.setEventCallback(null);
    //         this._updateListener = null;
    //         // Prepend the manifest's search path
    //         var searchPaths = jsb.fileUtils.getSearchPaths();
    //         var newPaths = this._am.getLocalManifest().getSearchPaths();
    //         Array.prototype.unshift.apply(searchPaths, newPaths);
    //         // This value will be retrieved and appended to the default search path during game startup,
    //         // please refer to samples/js-tests/main.js for detailed usage.
    //         // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
    //         cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
    //         jsb.fileUtils.setSearchPaths(searchPaths);

    //         setTimeout(() => {
    //             console.log("Đang khởi động lại trò chơi...");
    //             cc.audioEngine.stopAll();
    //             cc.game.restart();
    //         }, 5000);
    //     }
    // },
    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
    
        // log chung cho mọi event
        cc.log('[HotUpdate] Event code:', event.getEventCode(), event.getMessage ? event.getMessage() : '');
    
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.messageLabel.string = "Không tìm thấy bảng kê khai cục bộ.";
                this.updateProgress(0, 0);
                this.descriptionLabel.string = "Code: 1007";
                this.retryButtonNode.active = !0;
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = (event.getPercent() * 100) >> 0;
                this.messageLabel.string = "Đang tải: " + percent + "%";
                this.updateProgress(0, percent, 1);
                this.descriptionLabel.string = "Code: 1006";
    
                // log chi tiết số byte đã tải
                cc.log('[HotUpdate] Progress:', percent + '%', 
                       'downloaded:', event.getDownloadedFiles(), '/', event.getTotalFiles(), 
                       event.getDownloadedBytes(), '/', event.getTotalBytes());
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.messageLabel.string = "Cập nhật hoàn tất.\nTrò chơi sẽ được khởi động lại.";
                this.updateProgress(0, 100);
                this.descriptionLabel.string = "Code: 1003";
                this.retryButtonNode.active = !1;
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.messageLabel.string = "Cập nhật phiên bản không thành công.";
                this.updateProgress(0, 100);
                this.descriptionLabel.string = "Code: 1002";
                this.retryButtonNode.active = !0;
                this._updating = !1;
                this._canRetry = !0;
                break;
            // các case khác như bạn có thể giữ nguyên
        }
    
        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
        }
    
        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
    
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
    
            setTimeout(() => {
                cc.log("[HotUpdate] Đang khởi động lại trò chơi...");
                cc.audioEngine.stopAll();
                cc.game.restart();
            }, 5000);
        }
    },
    
    onRetryClick: function () {
        this.retry()
        cc.sys.isBrowser ? this.loadAssets() : (this.initHotUpdate(), this.checkUpdate());
    },
    versionCompareHandle: function (t, e) {
        console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e),
            console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e);

        // set version current
        localStorage.setItem('VERSION', e);

        for (var i = t.split("."), o = e.split("."), n = 0; n < i.length; ++n) {
            var s = parseInt(i[n]),
                a = parseInt(o[n] || 0);
            if (s !== a)
                return s - a
        }
        return o.length > i.length ? -1 : 0
    },
    updateProgress: function (progress = 0, percent = 0, showStartIcon = false) {
        /*** Sử dụng progress bar tròn ***/
        // this.processBarCircle.progress = Number(percent / 100); // set thanh tiến trình tải
        // if (percent) {
        //     this.loadingPercent.string = percent.toFixed(0).toString() + "%";
        //     this._currentPercentLoaded = percent.toFixed(0);
        // }

        /*** Sử dụng thanh tiến trình ngang ***/
        // this.processBarLine.getComponent(cc.Sprite).fillRange = Number(percent / 100); // set thanh tiến trình tải
        let sprite = this.processBarLine.getComponent(cc.Sprite);
        let current = sprite.fillRange;
        let targetFill = percent / 100;
        sprite.fillRange = targetFill;

        // điểm cuối của thanh tiến trình
        const visibleWidth = sprite.node.width * sprite.fillRange;
        // Toạ độ X của đầu cuối bar trong local space (tính từ tâm node)
        const endX = -sprite.node.width / 2 + visibleWidth - 40;
        const localEnd = cc.v2(endX, 0);
        const worldEnd = sprite.node.parent.convertToWorldSpaceAR(localEnd);

        // set position start icon
        if (showStartIcon) {
            this.startIcon.active = true;
            this.startIcon.setPosition(cc.v2(worldEnd.x, this.startIcon.y));
        } else {
            this.startIcon.active = false;
        }

        // cc.tween({ value: current })
        //     .to(0.1, { value: targetFill }, {
        //         easing: 'sineOut',
        //         onUpdate: (obj) => {
        //             // sprite.fillRange = obj.value;
        //             if (cc.isValid(sprite)) {
        //                 sprite.fillRange = obj.value;
        //             }
        //         }
        //     })
        //     .start();

    },
    getSettingByKey: function (settingsArray, key) {
        // Hàm lấy ra giá trị theo key từ mảng settings
        if (!Array.isArray(settingsArray)) return null;
        for (let i = 0; i < settingsArray.length; i++) {
            if (settingsArray[i].key === key) {
                return settingsArray[i].value;
            }
        }
        return null;
    },
});