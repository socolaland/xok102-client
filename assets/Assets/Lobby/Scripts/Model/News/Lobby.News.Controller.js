var helper = require('Helper');

cc.Class({
    extends: cc.Component,
    properties: {
        prefabItem: cc.Prefab,
        speed: 90,
    },
    init: function (obj) {
        this.CORE = obj;
        this.totalWidth = 0;
        this.fixedNewsMessage = [
            // "Chào mừng bạn đến với Xok102.",
            // "Hệ thống game bài đổi thưởng số 1 Việt Nam!",
            // "Xok102 - Nơi giải trí đỉnh cao hiện hành!",
            // "Tham gia Xok102 để nhận ngay quà khủng!",
            // "Xok102 - Cộng đồng game thủ đẳng cấp!",
            // "Xok102 luôn đồng hành cùng người chơi!",
            // "Khuyến mãi siêu hấp dẫn tại Xok102!",
            // "Xok102 - Trải nghiệm game mượt mà nhất!",
            // "Sự kiện hot nhất tại Xok102!",
            // "Xok102 - Nạp nhanh rút gọn!",
            // "Hỗ trợ 24/7 tại Xok102!",
            // "Xok102 - Uy tín tạo nên thương hiệu!"
        ];
    },
    update: function (t) {
        this.node.position = cc.v2(this.node.position.x - (this.speed * t), 0);
        if (this.node.children.length > 0) {
            const lastChild = this.node.children[this.node.children.length - 1];
            const lastChildLeft = lastChild.x + this.node.x;
            const lastWidth = -lastChild.width - 350;
            if (lastChildLeft < lastWidth) {
                this.reset();
            }
        }
    },
    onEnable: function () {
        // if (void 0 !== cc.CORE.GAME_CONFIG.NEWS) {
        //     this.NewsAddArray(cc.CORE.GAME_CONFIG.NEWS);
        // }
    },
    setFixedNews: function () {
        this.setNews();
        if (void 0 !== cc.CORE.GAME_CONFIG.NEWS) {
            this.NewsAddArray(cc.CORE.GAME_CONFIG.NEWS);
        }
    },
    setNews: function () {
        this.node.active = true;
        this.node.position = cc.v2(390, 0);
    },
    reset: function () {
        try {
            this.node.destroyAllChildren();
            this.node.position = cc.v2(0, 0);
            this.setFixedNews();
            // this.node.active = false;
        } catch (e) { }
    },
    onLoad: function () {
        // reset chống làm lag
        setInterval(() => {
            this.reset();
        }, 180000);
    },
    // onData: function (data) {
    //     if (void 0 !== data.thongbao) {
    //         if (void 0 !== data.thongbao.pin & data.thongbao.pin) {
    //             this.NewsAddThongBao(data.thongbao);
    //             this.baotri = false;
    //         } else {
    //             this.NewsAddThongBao(data.thongbao);
    //             this.baotri = false;
    //         }
    //     }

    //     if (void 0 !== data.a) {
    //         this.NewsAddArray(data.a);
    //     }
    //     if (void 0 !== data.t) {
    //         this.NewsAddText(data.t);
    //     }
    // },
    NewsAddItem: function (text) {
        var item = cc.instantiate(this.prefabItem);
        item = item.getComponent(cc.RichText);
        item.string = text;
        this.node.addChild(item.node);
        if (!this.node.active) {
            this.setNews()
        }
    },
    NewsAddArray: function (arrText) {
        arrText.forEach(item => {
            this.NewsAddItem(item);
        });
    }
});
