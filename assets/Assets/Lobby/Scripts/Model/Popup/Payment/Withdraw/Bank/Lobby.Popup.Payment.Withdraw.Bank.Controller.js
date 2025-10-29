const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        form_add_bank_node: cc.Node,
        form_withdraw_bank_node: cc.Node,
        
        // form add bank
        add_bank_select: cc.Label,
        add_bank_account_number: cc.EditBox,
        add_bank_account_name: cc.EditBox,
        add_more_bank_node: cc.Node,
        add_bankSupportListContent: cc.Node,

        // form withdraw bank
        current_amount: cc.Label,
        bank_select: cc.Label,
        bank_account_number: cc.EditBox,
        bank_account_name: cc.EditBox,
        amount: cc.EditBox,
        more_bank_node: cc.Node,
        otp: cc.EditBox,
        bankSupportListContent: cc.Node,

        itemBankSelectPrefab: cc.Prefab,
    },

    init(obj) {
        this.CORE = obj;
        this.config = null;
        this.is_set_list_bank_support = false;
        this.bank_select_data = null;
        this.add_bank_select_data = null;

        // this.tabShow = "BANK";
        // cc.log(this.CORE.maintanceNode);
    },
    onLoad() {
    },
    onEnable() {
        this.current_amount.string = cc.CORE.UTIL.numberWithCommas(cc.CORE.USER.balance);
    },
    onDisable() {
        this.clean();
    },
    onChangerAmount: function (value = 0) {
        value = cc.CORE.UTIL.numberWithCommas(cc.CORE.UTIL.getOnlyNumberInString(value));
        this.amount.string = value == 0 ? "" : value;
        // set value input khi nhập
        (cc.sys.isBrowser) && cc.CORE.UTIL.BrowserUtil.setValueEditBox(this.amount.string);
    },
    onChangerBankAccountName: function (value = "") {
        value = cc.CORE.UTIL.nonAccentVietnamese(value.trim());
        this.bank_account_name.string = value == "" ? "" : value.toUpperCase();
        this.add_bank_account_name.string = value == "" ? "" : value.toUpperCase();
    },
    setListBankSupport: function (list) {
        list.forEach(bank => {
            if (bank.gate_name !== "bank" ||
                bank.status !== "active" ||
                bank.allow_withdraw !== true
            ) return;

            const item = cc.instantiate(this.itemBankSelectPrefab);
            const itemComp = item.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
            itemComp.init(this, bank, "withdraw");
            itemComp.txt_bank_name.string = cc.CORE.UTIL.cutText(`${bank.short_name} - ${bank.name}`, 25);
            this.bankSupportListContent.addChild(item);

            const item_add = cc.instantiate(this.itemBankSelectPrefab);
            const item_add_comp = item_add.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
            item_add_comp.init(this, bank, "add");
            item_add_comp.txt_bank_name.string = cc.CORE.UTIL.cutText(`${bank.short_name} - ${bank.name}`, 25);
            this.add_bankSupportListContent.addChild(item_add);
        });
    },
    onUniqueSelectActive: function (name, type) {
        if (type === "withdraw") {
            this.bankSupportListContent.children.forEach(node => {
                const itemComp = node.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
                itemComp.bg_active.active = node.name === name;
            });
        }
        if (type === "add") {
            this.add_bankSupportListContent.children.forEach(node => {
                const itemComp = node.getComponent("Lobby.Popup.Payment.Withdraw.Bank.Item.Controller");
                itemComp.bg_active.active = node.name === name;
            });
        }
    },
    onSelectBank: function (data, type) {
        this.onUniqueSelectActive(data.code, type);
        if (type === "withdraw") {
            this.bank_select_data = data;
            this.bank_select.string = cc.CORE.UTIL.cutText(`${data.short_name} - ${data.name}`, 20);
            this.toggleMoreBank();
        }
        if (type === "add") {
            this.add_bank_select_data = data;
            this.add_bank_select.string = cc.CORE.UTIL.cutText(`${data.short_name} - ${data.name}`, 20);
            this.add_toggleMoreBank();
        }
    },
    clean: function () {
        // this.bank_select_data = null;
        this.bank_select.string = "Chọn ngân hàng";
        this.bank_account_number.string = "";
        this.bank_account_name.string = "";
        this.amount.string = "";
        this.onUniqueSelectActive(null, "withdraw");

        this.add_bank_select_data = null;
        this.add_bank_select.string = "Chọn ngân hàng";
        this.add_bank_account_number.string = "";
        this.add_bank_account_name.string = "";
        this.onUniqueSelectActive(null, "add");
    },
    cleanStk: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.bank_account_number.string = "";
        this.add_bank_account_number.string = "";
    },
    cleanAccountName: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.bank_account_name.string = "";
        this.add_bank_account_name.string = "";
    },
    cleanAmount: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.amount.string = "";
    },
    toggleMoreBank() {
        this.more_bank_node.active = !this.more_bank_node.active;
    },
    add_toggleMoreBank() {
        this.add_more_bank_node.active = !this.add_more_bank_node.active;
    },
    onClickGetOtp: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.NETWORK.APP.Send({
            event: "security",
            data: {
                get_otp: { action: "withdraw" }
            }
        });
    },
    onClickSubmit: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        const amount = Number(cc.CORE.UTIL.getOnlyNumberInString(this.amount.string));
        const bank_account_number = this.bank_account_number.string.trim();
        const bank_account_name = this.bank_account_name.string.trim();
        const otp = this.otp.string;

        console.log(amount, bank_account_number, bank_account_name, this.bank_select_data, otp);

        if (amount == "" || bank_account_number == "" || bank_account_name == "" || !this.bank_select_data) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập đủ thông tin", "error", 1, 1, true);
        if (bank_account_name.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên chủ tài khoản không hợp lệ", "error", 1, 1, true);
        if (bank_account_number.length < 3) return cc.CORE.GAME_SCENCE.FastNotify("Số tài khoản không hợp lệ", "error", 1, 1, true);

        const config = this.CORE.config["bank"]["manual"]["config"];
        if (amount < config.min) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối thiểu là " + cc.CORE.UTIL.numberWithCommas(config.min) + "!", "info", 1, 1, true);
        if (amount > config.max) return cc.CORE.GAME_SCENCE.FastNotify("Số tiền tối đa là " + cc.CORE.UTIL.numberWithCommas(config.max) + "!", "info", 1, 1, true);

        if (otp.length < 4) return cc.CORE.GAME_SCENCE.FastNotify("Mã OTP không hợp lệ!", "info", 1, 1, true);

        const data = {
            amount,
            bank_account_number,
            bank_account_name,
            bank_code: this.bank_select_data.code,
            bank_select_data: this.bank_select_data,
            otp: Number(otp)
        }

        this.CORE.CORE.loadingNode.active = true;

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/payment/withdraw/bank-manual`,
            {}, data,
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "success", 1, 1, true);
                this.CORE.CORE.loadingNode.active = false;
                cc.CORE.AUDIO.playSound(this.CORE.CORE.sound_open);
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


    onClickAddBank: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        const bank_account_number = this.add_bank_account_number.string.trim();
        const bank_account_name = this.add_bank_account_name.string.trim();
        if (this.add_bank_account_number.string == "" || this.add_bank_account_name.string == "" || !this.add_bank_select_data) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng nhập đủ thông tin", "error", 1, 1, true);
        if (bank_account_name.length < 5) return cc.CORE.GAME_SCENCE.FastNotify("Tên chủ tài khoản không hợp lệ", "error", 1, 1, true);
        if (bank_account_number.length < 3) return cc.CORE.GAME_SCENCE.FastNotify("Số tài khoản không hợp lệ", "error", 1, 1, true);
        const data = {
            bank_data: this.add_bank_select_data,
            bank_id: this.add_bank_select_data.id,
            bank_account_number,
            bank_account_name,
        }

        this.CORE.CORE.loadingNode.active = true;

        HttpRequest.Post(
            `${cc.CORE.CONFIG.SERVER_API}/payment/user-bank-accounts`,
            {}, data,
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                cc.CORE.GAME_SCENCE.FastNotify("Cập nhật thành công!", "success", 1, 1, true);
                
                // Kiểm tra an toàn trước khi set property
                // if (cc.CORE && cc.CORE.PAYMENT) {
                //     cc.CORE.PAYMENT.USER_BANK_ACCOUNT = result?.data || null;
                // } else {
                //     console.error("cc.CORE.PAYMENT is not initialized");
                //     this.CORE.CORE.loadingNode.active = false;
                //     return cc.CORE.GAME_SCENCE.FastNotify("Hệ thống chưa sẵn sàng, vui lòng thử lại", "error", 1, 1, true);
                // }
                
                this.CORE.CORE.loadingNode.active = false;
                this.form_add_bank_node.active = false;
                this.form_withdraw_bank_node.active = true; 

                if (result.data && result.data.bank_account_number) {
                    this.bank_account_number.string = result.data.bank_account_number;
                    this.bank_account_name.string = result.data.bank_account_name;
                    this.bank_select.string = cc.CORE.UTIL.cutText(`${result.data.bank_data.short_name} - ${result.data.bank_data.name}`, 20);
                    this.bank_select_data = result.data.bank_data;
                } else {
                    console.error("USER_BANK_ACCOUNT data is invalid or missing");
                    this.form_add_bank_node.active = true;
                    this.form_withdraw_bank_node.active = false;
                }
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
        if (void 0 != cc.CORE.USER.balance) {
            this.current_amount.string = cc.CORE.UTIL.numberWithCommas(cc.CORE.USER.balance);
        }

        if (void 0 == this.CORE.CORE.bank_support_data && !this.is_set_list_bank_support) return;
        if (!this.is_set_list_bank_support) {
            const bank_support_data = this.CORE.CORE.bank_support_data;
            this.is_set_list_bank_support = true;
            this.setListBankSupport(bank_support_data);
        };
    }
});
