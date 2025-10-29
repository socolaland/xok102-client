const UTIL = require("Helper");

const DeviceInfo = {
    Get() {
        const PLAY_PLATFORM = {
            BROWSER: "browser",
            NATIVE_APP: "native_app"
        };

        const info = {
            play_platform: null,  // "browser" | "app"
            user_agent: null,
            isMobile: null,
            resolution: null,
            device_name: null,
            version: null,
        };

        try {
            setTimeout(() => {
                // === Lấy kích thước vùng hiển thị ===
                if (typeof cc !== 'undefined' && cc.view && cc.view.getFrameSize) {
                    const frame = cc.view.getFrameSize();
                    info.resolution = `${frame.width}x${frame.height}`;
                } else if (typeof window !== 'undefined') {
                    info.resolution = `${window.innerWidth}x${window.innerHeight}`;
                }
            }, 300);

            // === Nếu là Native (Android / iOS) ===
            if (cc && cc.sys && cc.sys.isNative) {
                info.play_platform = PLAY_PLATFORM.NATIVE_APP;
                info.user_agent = 'native';
                info.isMobile = false;
                info.device_name = cc.sys?.os || null;        // "Android", "iOS", "Windows"
                info.version = cc.sys?.osVersion || null;
            }

            // === Nếu là Web (Browser / WebView) ===
            else if (typeof navigator !== 'undefined') {
                info.play_platform = PLAY_PLATFORM.BROWSER;
                info.user_agent = navigator.userAgent || null;
                info.isMobile = UTIL.isMobile();
                info.device_name = navigator?.platform || null;
                info.version = navigator?.appVersion || null;
            }

        } catch (err) {
            cc && cc.error && cc.error('[DeviceInfo Error]', err);
        }

        return info;
    }
};

module.exports = DeviceInfo;
