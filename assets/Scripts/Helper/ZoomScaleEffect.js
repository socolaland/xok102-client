cc.Class({
    extends: cc.Component,
	properties: {
		scaleFrom: 0.85,
		scaleTo: 1.15,
		scaleDuration: 0.15
	},
    onEnable: function(){
		cc.tween(this.node)
			.repeatForever(
				cc.tween()
					.to(this.scaleDuration, { scale: this.scaleFrom })
					.to(this.scaleDuration, { scale: this.scaleTo })
			)
			.start();
    },
    onDisable: function(){
        this.node.scale = 1;
        cc.Tween.stopAllByTarget(this.node);
    },
});