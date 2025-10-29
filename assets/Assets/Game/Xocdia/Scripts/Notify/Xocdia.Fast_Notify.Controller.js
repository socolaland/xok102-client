cc.Class({
    extends: cc.Component,

    properties: {
        type: {
            default: [],
            type: cc.Node
        },
        label: cc.Label,
        animationTime: 1,    // Thời gian di chuyển từ trái sang vị trí ban đầu, Thời gian di chuyển từ vị trí ban đầu sang phải
        showTime: 3,    // Thời gian giữ nguyên vị trí
    },

    // LIFE-CYCLE CALLBACKS:

    init(obj) {
        const textColor = {
            win: cc.Color.WHITE,
            success: cc.Color.WHITE,
            error: cc.Color.RED,
            warning: cc.Color.YELLOW,
            info: cc.Color.WHITE,
        };

        this.label.string = obj.text;
        this.type.map((bg) => {
            if (bg.name == obj.type) {
                bg.active = true;
            } else {
                bg.active = false;
            }
        });
        this.showTime = obj.showTime;
        this.animationTime = obj.animationTime;

        this.label.node.color = textColor[obj.type];
    },
    onLoad() {
        this.startNotification();
    },
    startNotification() {
        // Bắt đầu từ scale nhỏ
        this.node.scale = 0;

        // Hiệu ứng zoom vào
        const zoomIn = cc.scaleTo(0.3, 1).easing(cc.easeBackOut()); // Scale to 1, nảy nhẹ
        const delay = cc.delayTime(this.showTime || 2); // Dừng lại bao lâu
        const zoomOut = cc.scaleTo(0.3, 0).easing(cc.easeBackIn()); // Scale về 0, thu nhỏ
        const remove = cc.callFunc(() => {
            if (cc.isValid(this.node)) {
                try {
                    this.node.destroy();
                }catch(e){
                    console.log(e);
                }
            }
        });

        const sequence = cc.sequence(zoomIn, delay, zoomOut, remove);
        this.node.runAction(sequence);
    },
    update(dt) {
        // let currentPage = this.gameTableShow.getCurrentPageIndex();
        // if (this.lastPageIndex !== currentPage) {
        //     console.log("Page changed to:", currentPage);
        //     this.lastPageIndex = currentPage;
        //     this.showPage(currentPage);
        // }
    }
});
