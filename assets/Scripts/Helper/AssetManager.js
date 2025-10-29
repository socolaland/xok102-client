// AssetManager.js

const AssetManager = {
    _loadedAssets: new Map(), // key -> { asset, refCount, category }
    _bundles: new Map(),      // bundleName -> bundle

    _makeKey(asset, type) {
        return `${asset._uuid || asset.uuid}_${type ? type.name : 'unknown'}`;
    },

    _track(asset, type, category = 'main') {
        const key = this._makeKey(asset, type);
        if (!this._loadedAssets.has(key)) {
            this._loadedAssets.set(key, { asset, refCount: 1, category });
        } else {
            this._loadedAssets.get(key).refCount++;
        }
        return key;
    },

    // ===============================
    // 🔹 BUNDLE LOADING
    // ===============================
    loadMultipleBundles(bundleNames, onProgress) {
        return new Promise((resolve) => {
            const totalCount = bundleNames.length;
            let completedCount = 0;
            const loadedBundles = [];

            const bundlePromises = bundleNames.map((name, index) =>
                new Promise((resolveBundle, rejectBundle) => {
                    cc.assetManager.loadBundle(name, (err, bundle) => {
                        completedCount++;
                        if (typeof onProgress === 'function') {
                            onProgress(completedCount, totalCount);
                        }

                        if (err) {
                            console.warn(`[AssetManager] ❌ Lỗi load bundle: ${name}`, err);
                            rejectBundle({ name, err });
                        } else {
                            console.log(`[AssetManager] ✅ Đã load bundle: ${name}`);
                            loadedBundles[index] = bundle;
                            this._bundles.set(name, bundle);
                            resolveBundle(bundle);
                        }
                    });
                })
            );

            Promise.allSettled(bundlePromises).then(() => {
                const result = loadedBundles.filter(Boolean);
                console.log(`[AssetManager] ✅ Load xong ${result.length}/${totalCount} bundles`);
                resolve(result);
            });
        });
    },

    loadMultipleBundlesWithAssetProgress(bundleNames, onProgress) {
        return new Promise((resolve, reject) => {
            let totalAssets = 0;
            let loadedAssets = 0;
            const loadedBundles = [];

            const updateProgress = () => {
                const percent = totalAssets === 0 ? 0 : Math.min(100, Math.floor((loadedAssets / totalAssets) * 100));
                if (typeof onProgress === 'function') {
                    onProgress(percent);
                }
            };

            const loadBundleAndAssets = (name, index) => {
                return new Promise((resolveBundle, rejectBundle) => {
                    cc.assetManager.loadBundle(name, (err, bundle) => {
                        if (err) {
                            console.warn(`[AssetManager] ❌ Lỗi load bundle: ${name}`, err);
                            rejectBundle(err);
                            return;
                        }

                        console.log(`[AssetManager] ✅ Load bundle: ${name}`);
                        loadedBundles[index] = bundle;
                        this._bundles.set(name, bundle);

                        let thisBundleTotal = 0;

                        bundle.loadDir('', (finish, total) => {
                            if (thisBundleTotal === 0) {
                                thisBundleTotal = total;
                                totalAssets += total;
                            }
                            loadedAssets++;
                            updateProgress();
                        }, (err2, assets) => {
                            if (err2) {
                                console.warn(`[AssetManager] ❌ Lỗi load asset trong bundle: ${name}`, err2);
                            } else {
                                console.log(`[AssetManager] ✅ Load xong asset bundle: ${name}`);
                                assets.forEach(asset => this._track(asset, asset.constructor, name || "main"));
                            }
                            resolveBundle(bundle);
                        });
                    });
                });
            };

            const bundlePromises = bundleNames.map((name, index) => loadBundleAndAssets(name, index));

            Promise.allSettled(bundlePromises).then(() => {
                updateProgress();
                const result = loadedBundles.filter(Boolean);
                console.log(`[AssetManager] 🎉 Load xong tất cả asset trong các bundle!`);
                resolve(result);
            }).catch(reject);
        });
    },

    loadAssetsFromMultipleBundles(bundleAssets, type) {
        return new Promise((resolve, reject) => {
            const bundleNames = Object.keys(bundleAssets);

            this.loadMultipleBundles(bundleNames)
                .then((bundles) => {
                    const assetPromises = bundles.map((bundle, index) => {
                        const bundleName = bundleNames[index];
                        const assetPaths = bundleAssets[bundleName];

                        if (Array.isArray(assetPaths)) {
                            return Promise.all(
                                assetPaths.map(path =>
                                    new Promise((resolveAsset, rejectAsset) => {
                                        bundle.load(path, type, (err, asset) => {
                                            if (err) {
                                                console.error(`[AssetManager] Lỗi load asset: ${path} từ ${bundleName}`, err);
                                                rejectAsset(err);
                                            } else {
                                                this._track(asset, type, bundleName || "main");
                                                resolveAsset({ bundleName, path, asset });
                                            }
                                        });
                                    })
                                )
                            );
                        } else {
                            return new Promise((resolveAsset, rejectAsset) => {
                                bundle.load(assetPaths, type, (err, asset) => {
                                    if (err) {
                                        console.error(`[AssetManager] Lỗi load asset: ${assetPaths} từ ${bundleName}`, err);
                                        rejectAsset(err);
                                    } else {
                                        this._track(asset, type, bundleName || "main");
                                        resolveAsset({ bundleName, path: assetPaths, asset });
                                    }
                                });
                            });
                        }
                    });

                    Promise.all(assetPromises)
                        .then((results) => {
                            const assetsByBundle = {};
                            results.forEach(result => {
                                if (Array.isArray(result)) {
                                    const bundleName = result[0].bundleName;
                                    assetsByBundle[bundleName] = {};
                                    result.forEach(({ path, asset }) => {
                                        assetsByBundle[bundleName][path] = asset;
                                    });
                                } else {
                                    const { bundleName, path, asset } = result;
                                    if (!assetsByBundle[bundleName]) {
                                        assetsByBundle[bundleName] = {};
                                    }
                                    assetsByBundle[bundleName][path] = asset;
                                }
                            });
                            resolve(assetsByBundle);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    // ===============================
    // 🔹 SINGLE LOADERS
    // ===============================
    loadFromResources(path, type, category = "main") {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, type, (err, asset) => {
                if (err) {
                    console.error(`[AssetManager] Failed to load: ${path}`, err);
                    reject(err);
                } else {
                    this._track(asset, type, category);
                    resolve(asset);
                }
            });
        });
    },

    loadFromBundle(bundleName, assetPath, type, category = "main") {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    console.error(`[AssetManager] Failed to load bundle: ${bundleName}`, err);
                    reject(err);
                    return;
                }

                this._bundles.set(bundleName, bundle);
                const cat = category || "main";

                bundle.load(assetPath, type, (err, asset) => {
                    if (err) {
                        console.error(`[AssetManager] Failed to load: ${assetPath} from ${bundleName}`, err);
                        reject(err);
                    } else {
                        this._track(asset, type, cat);
                        resolve(asset);
                    }
                });
            });
        });
    },

    loadMultipleFromResources(path, type, category = "main") {
        return new Promise((resolve, reject) => {
            cc.resources.loadDir(path, type, (err, assets) => {
                if (err) {
                    console.error(`[AssetManager] Failed to load directory: ${path}`, err);
                    reject(err);
                } else {
                    assets.forEach(asset => this._track(asset, type, category));
                    resolve(assets);
                }
            });
        });
    },

    loadMultipleFromBundle(bundleName, path, type, category = "main") {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    console.error(`[AssetManager] Failed to load bundle: ${bundleName}`, err);
                    reject(err);
                    return;
                }

                this._bundles.set(bundleName, bundle);
                const cat = category || "main";

                bundle.loadDir(path, type, (err, assets) => {
                    if (err) {
                        console.error(`[AssetManager] Failed to load directory: ${path} from ${bundleName}`, err);
                        reject(err);
                    } else {
                        assets.forEach(asset => this._track(asset, type, cat));
                        resolve(assets);
                    }
                });
            });
        });
    },

    // ===============================
    // 🔹 MEMORY MANAGEMENT
    // ===============================
    release(asset, type) {
        if (!asset) return false;
        const key = this._makeKey(asset, type);
        const record = this._loadedAssets.get(key);
        if (!record) return false;

        record.refCount--;
        if (record.refCount <= 0) {
            if (cc.isValid(record.asset)) {
                cc.assetManager.releaseAsset(record.asset);
            }
            this._loadedAssets.delete(key);
            console.log(`[AssetManager] 🗑 Released: ${key}`);
        }
        return true;
    },

    releaseCategory(category = "main") {
        for (let [key, record] of this._loadedAssets.entries()) {
            console.log(record);
            if (record && record.category === category) {
                if (cc.isValid(record.asset)) {
                    cc.assetManager.releaseAsset(record.asset);
                }
                this._loadedAssets.delete(key);
                console.log(`[AssetManager] 🗑 Released category ${category}: ${key}`);
            }
        }
    },

    releaseAll(forceGC = true) {
        console.log("[AssetManager] 🔥 Release all assets...");
        this._loadedAssets.forEach(record => {
            if (cc.isValid(record.asset)) {
                cc.assetManager.releaseAsset(record.asset);
            }
        });
        this._loadedAssets.clear();

        this._bundles.forEach((bundle, name) => {
            cc.assetManager.removeBundle(bundle);
            console.log(`[AssetManager] 🗑 Released bundle: ${name}`);
        });
        this._bundles.clear();

        if (forceGC) this.forceGC();
    },

    // ===============================
    // 🔹 DEBUG
    // ===============================
    getTrackedCount() {
        return this._loadedAssets.size;
    },

    printStatus() {
        const summary = {};
        this._loadedAssets.forEach(r => {
            summary[r.category] = (summary[r.category] || 0) + 1;
        });
        console.table(summary);
        console.log(`[AssetManager] Tracked assets: ${this._loadedAssets.size}`);
    },

    forceGC() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("java/lang/System", "gc", "()V");
        }
        if (window.gc) window.gc();
        console.log("[AssetManager] 🧹 Force GC");
    },

    // ===============================
    // 🔹 SET AVATAR
    // ===============================
    setAvatarToSprite(targetSprite, avatarId) {
        return new Promise((resolve, reject) => {
            if (!targetSprite || !(targetSprite instanceof cc.Sprite)) {
                console.warn("[AssetManager] Target sprite is invalid or not a cc.Sprite.");
                return reject(new Error("Invalid target sprite"));
            }
            if (typeof avatarId === 'undefined' || avatarId === null) {
                console.warn("[AssetManager] Avatar ID is invalid.");
                return reject(new Error("Invalid avatar ID"));
            }

            const bundleName = 'Common_Bundle';
            const assetPath = `Images/Avatar/${avatarId}`;

            this.loadFromBundle(bundleName, assetPath, cc.SpriteFrame)
                .then(spriteFrame => {
                    targetSprite.spriteFrame = spriteFrame;
                    resolve(spriteFrame);
                })
                .catch(error => {
                    console.error(`[AssetManager] Failed to set avatar ${avatarId}:`, error);
                    targetSprite.spriteFrame = null;
                    reject(error);
                });
        });
    },
};

module.exports = AssetManager;
