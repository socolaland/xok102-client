cc.Class({
    extends: cc.Component,

    properties: {},

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
    },
    onDisable() {
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    onClick(event, customEventData) {
        cc.CORE.GAME_SCENCE.PlayClick();

        const type = customEventData;
        const contact = cc.CORE.GAME_CONFIG.CONTACT && cc.CORE.GAME_CONFIG.CONTACT[type];
        cc.log(contact, type);
        // Kiểm tra xem contact có hợp lệ không
        if (contact && contact !== "" && contact !== null) {
            // Mở URL ngay lập tức khi người dùng click vào button
            cc.sys.openURL(contact);
        } else {
            cc.log("Không lấy được địa chỉ!");
            cc.CORE.GAME_SCENCE.FastNotify(contact ? "Không lấy được địa chỉ!" : "Địa chỉ đang trống!", "error", 1);
        }
    },
    update(dt) {
    }
});
