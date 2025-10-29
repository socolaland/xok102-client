cc.Class({
    extends: cc.Component,

    properties: {
        time: 0.3
    },
    onLoad: function () {
        this.node.runAction(
			cc.repeatForever(
				cc.sequence(
					cc.fadeIn(this.time),
					cc.fadeOut(this.time),
				)
			)
		);
    },
    onEnable: function () {
        this.node.runAction(
			cc.repeatForever(
				cc.sequence(
					cc.fadeIn(this.time),
					cc.fadeOut(this.time),
				)
			)
		);
    }
});
