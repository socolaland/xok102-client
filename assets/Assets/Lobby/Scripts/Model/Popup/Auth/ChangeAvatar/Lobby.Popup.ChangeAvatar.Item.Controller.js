cc.Class({
    extends: cc.Component,

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite,
        },
    },

    init(obj) {
        this.CORE = obj;
    },
    onLoad() {
    },
    onEnable() {
    },
    setAvatarId(avatar_id) {
        // this.avatar_id = avatar_id;
    },
    onChangerClick: function (event, customData) {
        cc.CORE.GAME_SCENCE.PlayClick();
        const avatar_id = event.target.name;
        this.CORE.onChangeAvatar(avatar_id);
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
