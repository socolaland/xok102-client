cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        game_name: cc.Label,
        is_maintenance: cc.Node,
        btnLiked: cc.Node,
    },
    onLoad() {
    },
    init (obj, data) {
        this.CORE = obj;
        this.data = data;
        this.is_favorite = false;
    },
    setIcon: function (url = "") {
        if (!url) return;
        cc.CORE.UTIL.LoadImgFromUrl(this.icon, url);
    },
    setGameName: function (game_name = "") {
        if (!game_name) return;
        this.game_name.string = game_name;
    },
    setMaintain: function (maintain = false) {
        if (maintain) {
            this.is_maintenance.active = true;
        } else {
            this.is_maintenance.active = false;
        }
    },
    setLiked: function (liked = false) {
        if (liked) {
            this.btnLiked.opacity = 255;
        } else {
            this.btnLiked.opacity = 149.685;
        }
    },
    onClickItem: function () {
        this.CORE.lauchGame(this.data);
    },
    onClickFavorite: function () {
        this.is_favorite = !this.is_favorite;
        this.setLiked(this.is_favorite);
        this.CORE.postFavorite(this.data, this.is_favorite);
    }
});
