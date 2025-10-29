
cc.Class({
    extends: cc.Component,

    properties: {
        timeShow: 1
    },
    onLoad: function () {
        this.node.opacity = 10;
        cc.tween(this.node)
            .to(Number(this.timeShow), { opacity: 255 })
            .call(() => {
                // cc.director.loadScene('Menu');
            })
            .start();
    },
    onEnable: function () {
        this.node.opacity = 10;
        cc.tween(this.node)
            .to(Number(this.timeShow), { opacity: 255 })
            .call(() => {
                // cc.director.loadScene('Menu');
            })
            .start();
    }
});
