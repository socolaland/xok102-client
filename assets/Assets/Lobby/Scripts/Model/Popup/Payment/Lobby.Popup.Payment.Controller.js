const HttpRequest = require("HttpRequest");
const LocalStorage = require("LocalStorage");

const Deposit = require('Lobby.Popup.Payment.Deposit.Controller');
const Withdraw = require('Lobby.Popup.Payment.Withdraw.Controller');

cc.Class({
    extends: cc.Component,

    properties: {
        sound_open: {
            default: null,
            type: cc.AudioSource,
        },
        headerPaymentType: cc.Node,
        bodyPaymentType: cc.Node,
        Deposit: Deposit,
        Withdraw: Withdraw,
        maintanceNode: cc.Node,
        loadingNode: cc.Node,
    },

    init(obj) {
        this.CORE = obj;
        this.is_loaded_bank_support = false;
        this.is_loaded_user_bank_account = false;
        this.bank_support_data = null;
        this.tabShow = "deposit";
    },
    onLoad() {
        this.Deposit.init(this);
        this.Withdraw.init(this);
    },
    onEnable() {
        cc.CORE.AUDIO.playSound(this.sound_open);
        this.getConfig();
        this.getBankSupport();
        this.getUserBankAccount();
    },
    onSelectHeaderPaymentType: function (event) {
        cc.CORE.GAME_SCENCE.PlayClick();
        const name = event.target.name;
        this.headerPaymentType.children.forEach(node => {
            if (node.name == name) {
                node.getChildByName("active").active = true; node.getChildByName("none").active = false;
            } else {
                node.getChildByName("active").active = false; node.getChildByName("none").active = true;
            }
        });
        this.bodyPaymentType.children.forEach(node => {
            node.active = (node.name == name) ? true : false;
        });
        this.tabShow = name.toLowerCase();
        this.getUserBankAccount();
    },
    getConfig: function () {
        const seft = this;

        // Deposit
        HttpRequest.Get(
            `${cc.CORE.CONFIG.SERVER_API}/payment/deposit/config`, {},
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                const data = result.data;
                this.Deposit.config = data;
                this.Deposit.onSelectheaderGateType({ target: { name: this.Deposit.tabShow } });
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        });

        // Withdraw
        HttpRequest.Get(
            `${cc.CORE.CONFIG.SERVER_API}/payment/withdraw/config`, {},
            { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
        ).then(result => {
            if (result.error_code == 0) {
                const data = result.data;
                this.Withdraw.config = data;
            } else {
                cc.CORE.GAME_SCENCE.FastNotify(result.error_message, "error", 1, 1, true);
            }
        }).catch(e => {
            console.log(e);
            return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
        });
    },
    getBankSupport: function () {
        if (!this.is_loaded_bank_support) {
            HttpRequest.Get(
                `${cc.CORE.CONFIG.SERVER_API}/payment/bank-support-list`, {},
                { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
            ).then(result => {
                if (result.error_code == 0) {
                    this.is_loaded_bank_support = true;
                    this.bank_support_data = result.data;
                }
            }).catch(e => {
                console.log(e);
                return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
            });
        }
    },
    getUserBankAccount: function () {
        // if (!this.is_loaded_user_bank_account) {
            HttpRequest.Get(
                `${cc.CORE.CONFIG.SERVER_API}/payment/user-bank-accounts`, {},
                { "Authorization": `Bearer ${LocalStorage.getItem("access_token")}` }
            ).then(result => {
                if (result.error_code == 0) {
                    this.is_loaded_user_bank_account = true;
                    
                    this.Withdraw.Bank.form_add_bank_node.active = false;
                    this.Withdraw.Bank.form_withdraw_bank_node.active = true;

                    if (result.data && result.data.bank_account_number) {
                        this.Withdraw.Bank.bank_account_number.string = result.data.bank_account_number;
                        this.Withdraw.Bank.bank_account_name.string = result.data.bank_account_name;
                        this.Withdraw.Bank.bank_select.string = cc.CORE.UTIL.cutText(`${result.data.bank_data.short_name} - ${result.data.bank_data.name}`, 20);
                        this.Withdraw.Bank.bank_select_data = result.data.bank_data;
                    } else {
                        console.error("USER_BANK_ACCOUNT data is invalid or missing");
                        this.Withdraw.Bank.form_add_bank_node.active = true;
                        this.Withdraw.Bank.form_withdraw_bank_node.active = false;
                    }
                }else {
                    this.Withdraw.Bank.form_add_bank_node.active = true;
                    this.Withdraw.Bank.form_withdraw_bank_node.active = false;
                }
            }).catch(e => {
                console.log(e);
                return cc.CORE.GAME_SCENCE.FastNotify(e.message, "error", 1, 1, true);
            });
        // }
    },
    onClickShowHistory: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.toggle();
        this.CORE.show("history_finan");
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
