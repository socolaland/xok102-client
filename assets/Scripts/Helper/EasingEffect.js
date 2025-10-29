cc.Class({
    extends: cc.Component,

    properties: {
        timeEffect: 0.8,
        opacityStart: 0,
        opacityFinish: 255,
        nodeScaleStart: 0.6,
        nodeScaleFinish: 1,
        moveNode: false,
        moveFromX: 0,
        moveFromY: 0,
        moveToX: 0,
        moveToY: 0
    },

    onEnable() {
        this.node.opacity = this.opacityStart;
        this.node.scale = this.nodeScaleStart;

        this.node.position = this.moveNode
            ? cc.v2(this.moveFromX, this.moveFromY)
            : this.node.position;

        this.moveToPos = this.moveNode
            ? cc.v2(this.moveToX, this.moveToY)
            : this.node.position;

        cc.tween(this.node)
            .to(this.timeEffect, {
                scale: this.nodeScaleFinish,
                opacity: this.opacityFinish,
                position: this.moveToPos
            }, { easing: "quartInOut" })
            .start();
    },

    onDisable() {
        // Thiết lập lại giá trị ban đầu để tween trở về
        this.moveFromPos = this.moveNode
            ? cc.v2(this.moveFromX, this.moveFromY)
            : this.node.position;

        cc.tween(this.node)
            .to(this.timeEffect, {
                scale: this.nodeScaleStart,
                opacity: this.opacityStart,
                position: this.moveFromPos
            }, { easing: "quartInOut" })
            .call(() => {
                // Sau khi hiệu ứng tắt xong, ẩn node
                // this.node.active = false;
            })
            .start();
    }
});
