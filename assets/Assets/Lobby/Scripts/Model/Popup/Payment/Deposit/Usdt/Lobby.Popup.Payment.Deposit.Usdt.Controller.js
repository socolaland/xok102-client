const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        headerNetworkType: cc.Node,
        exchageCurrent: cc.Label,

        inputAmount: cc.EditBox,
        inputExchange: cc.Label,

        resp_network: cc.Label,
        resp_wallet_address: cc.Label,
        resp_qr_sprite: cc.Sprite,
    },

    init(obj) {
        this.CORE = obj;
        this.config = null;
        this.exchange_rate = 0;
        this.network = "eth";
    },
    onLoad() { },
    onEnable() {
        this.getUsdtAddress();
    },
    onDisable() {
        this.inputAmount.string = "0";
        this.inputExchange.string = "0";
        // this.network = "eth";
        // this.onSelectHeaderNetworkType({ target: { name: this.network } });
    },
    onMaintain() {
        cc.CORE.GAME_SCENCE.FastNotify("Phương thức đang bảo trì!", "error", 1, 1, true);
    },
    onChangerAmount: function (value = 0) {
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        this.inputAmount.string = value == 0 ? "" : value;
        // set value input khi nhập
        (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
    },
    onChangerExchange: function (value = 0) {
        const toExchange = Number(cc.CORE.UTIL.getOnlyNumberInString(value)) * this.exchange_rate;
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        this.inputExchange.string = cc.CORE.UTIL.numberWithCommas(toExchange);
        // // set value input khi nhập
        // (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputExchange.string);
    },
    onSelectHeaderNetworkType: function (event) {
        cc.CORE.GAME_SCENCE.PlayClick();
        const name = event.target.name;
        this.headerNetworkType.children.forEach(node => {
            if (node.name == name) {
                node.getChildByName("active").active = true; node.getChildByName("none").active = false;
            } else {
                node.getChildByName("active").active = false; node.getChildByName("none").active = true;
            }
        });
        this.network = name.toLowerCase();
        this.resp_NETWORK.APP.string = `Ví nhận (${name.toUpperCase()})`;
        this.getUsdtAddress();
    },
    clean: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.inputAmount.string = "0";
        this.inputExchange.string = "0";
    },
    onClickCopyStk: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.UTIL.copyToClipboard(this.resp_wallet_address.string);
        cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, true);
    },
    getUsdtAddress: function () {
        const data = { network: this.network };

        this.CORE.CORE.loadingNode.active = true;

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/payment/deposit/usdt-auto`,
            {}, data,
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "success", 1, 1, true);
                const data = result.data;
                this.resp_wallet_address.string = data.address;

                if (data.qr_image != null) {
                    cc.CORE.UTIL.LoadImgFromBase64(this.resp_qr_sprite, data.qr_image);
                }

                this.CORE.CORE.loadingNode.active = false;
                cc.CORE.AUDIO.playSound(this.CORE.CORE.sound_open);
            } else {
                this.CORE.CORE.loadingNode.active = false;
                this.resp_wallet_address.string = result.error_message;
                this.resp_qr_sprite.spriteFrame = null;
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            this.CORE.CORE.loadingNode.active = false;
            this.resp_wallet_address.string = result.error_message;
            this.resp_qr_sprite.spriteFrame = null;
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    toggle() {
        this.node.active = !this.node.active;
    },
    update(dt) {
        if (this.CORE.config != null) {
            this.config = this.CORE.config["usdt"]["auto"]["config"];
            if (void 0 != this.config.exchange_rate) {
                this.exchange_rate = this.config.exchange_rate;
                this.exchageCurrent.string = cc.CORE.UTIL.numberWithCommas(this.exchange_rate);
            }
        }
    }
});
