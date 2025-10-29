cc.Class({
    extends: cc.Component,

    properties: {
		transDuration: 5
	},

    onEnable: function () {
        var rotatePoint = new cc.RotateBy(this.transDuration, 360); // <- Rotate the node by 360 degrees in 5 seconds.
        var rotateForever = new cc.RepeatForever(rotatePoint); // <- Keeps the node rotating forever.
        this.node.runAction(rotateForever); // <- Run the action with your rotationPoint node, not with your moon.
    },
    onDisable: function () {
        this.node.stopAllActions();
    },
});