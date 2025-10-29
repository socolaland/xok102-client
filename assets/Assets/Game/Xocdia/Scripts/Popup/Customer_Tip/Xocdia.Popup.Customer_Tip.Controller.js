cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.Label,
        amount: cc.Label,
    },
    init(obj) {
        this.CORE = obj;
        this.data = {
            username: "",
            amount: 0,
        }
        this.timeShow = 5;
        this.timeShowIntv = null;
    },
    onLoad() {
    },
    onEnable() {
        this.timeShow = 5;
        cc.CORE.AUDIO.playSound(cc.CORE.GAME_SCENCE.Audio.customer_tip);
        clearInterval(this.timeShowIntv);
    },
    onDisable() {
        clearInterval(this.timeShowIntv);
    },
    toggle() {
        this.node.active = !this.node.active;
        // cc.CORE.GAME_SCENCE.isCheckPopupOpen = !this.node.active;
    },
    show(data) {
        this.data = data;
        if (void 0 !== this.data.nickname) this.username.string = this.data.nickname;
        if (void 0 !== this.data.amount) this.amount.string = cc.CORE.UTIL.numberWithCommas(this.data.amount);
        this.node.active = true;
        this.timeShowIntv = setInterval(() => {
            this.timeShow--;
            if (this.timeShow <= 0) {
                this.close();
            }
        }, 1000);
    },
    close() {
        this.node.active = false;
        clearInterval(this.timeShowIntv);
    },
    onData(data_history) {

    },
    update(dt) {
    }
});
