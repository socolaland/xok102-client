const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        request_Node: cc.Node,
        inputAmount: cc.EditBox,
        amountSuggestNode: cc.Node,

        response_Node: cc.Node,
        resp_amount: cc.Label,
        resp_bank: cc.Label,
        resp_bank_account_name: cc.Label,
        resp_bank_account_number: cc.Label,
        resp_bank_content: cc.Label,
        resp_qr_sprite: cc.Sprite,
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() { },
    onEnable() {
        this.inputAmount.string = "";
    },
    onDisable() {
        this.request_Node.active = true;
        this.response_Node.active = false;
    },
    onChangerAmount: function (value = 0) {
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        this.inputAmount.string = value == 0 ? "" : value;
        // set value input khi nhập
        (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.inputAmount.string);
    },
    onClickAmountSuggest: function (event) {
        cc.CORE.GAME_SCENCE.PlayClick();
        const amount = event.target.name;
        this.inputAmount.string = cc.CORE.UTIL.numberWithCommas(amount);
        this.amountSuggestNode.children.forEach(node => {
            if (node.name == amount) {
                node.getChildByName("active").active = true; node.getChildByName("none").active = false;
            } else {
                node.getChildByName("active").active = false; node.getChildByName("none").active = true;
            }
        });
    },
    clean: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.inputAmount.string = "";
        this.amountSuggestNode.children.forEach(node => {
            node.getChildByName("active").active = false; node.getChildByName("none").active = true;
        });
    },
    onClickCopyStk: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.UTIL.copyToClipboard(this.resp_bank_account_number.string);
        cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, true);
    },
    onClickCopyContent: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.UTIL.copyToClipboard(this.resp_bank_content.string);
        cc.CORE.GAME_SCENCE.FastNotify("Đã copy!", "success", 1, 1, true);
    },
    onClickSubmit: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        const config = this.CORE.config["qrcode"]["auto"]["config"];
        if (cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string) == 0) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập số tiền!", "info", 1, 1, true);
        if (config.min > cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là " + cc.CORE.UTIL.numberWithCommas(config.min) + "!", "info", 1, 1, true);
        if (config.max < cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối đa là " + cc.CORE.UTIL.numberWithCommas(config.max) + "!", "info", 1, 1, true);
        const data = {
            amount: Number(cc.CORE.UTIL.getOnlyNumberInString(this.inputAmount.string)),
        }

        this.CORE.CORE.loadingNode.active = true;

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/payment/deposit/bank-auto`,
            {}, data,
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "success", 1, 1, true);
                const data = result.data;
                // this.resp_amount.string = cc.CORE.UTIL.numberWithCommas(data.amount);
                this.resp_bank.string = cc.CORE.UTIL.cutText(`${data.bank_code.toUpperCase()} - ${data.bank}`, 21);
                this.resp_bank_account_name.string = data.bank_account_name;
                this.resp_bank_account_number.string = data.bank_account_number;
                this.resp_bank_content.string = data.bank_content;

                // if (data.qr_image != null) {
                //     cc.CORE.UTIL.LoadImgFromBase64(this.resp_qr_sprite, data.qr_image);
                // }
                if (data.qr_data != null) {
                    // console.log(data.qr_data);
                    cc.CORE.UTIL.LoadImgFromUrl(this.resp_qr_sprite, data.qr_data, null, null, 'png');
                }

                this.CORE.CORE.loadingNode.active = false;
                cc.CORE.AUDIO.playSound(this.CORE.CORE.sound_open);

                this.request_Node.active = false;
                this.response_Node.active = true;
            } else {
                this.CORE.CORE.loadingNode.active = false;
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            this.CORE.CORE.loadingNode.active = false;
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        })
    },
    toggle() {
        this.node.active = !this.node.active;
    },
    update(dt) {
    }
});
