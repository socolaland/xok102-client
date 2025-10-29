cc.Class({
    extends: cc.Component,
 
    properties: {
        progressBar: cc.Sprite,
        percent: cc.Label
    },
    onLoad () {},
    progressBarTo: function (percent) {
        if (percent < 0 || percent > 1.0) return;
        this.progressBar.fillRange = Number(percent);
    },
    progressLabelTo: function (percent) {
        if (percent < 0 || percent > 1.0) return;
        this.percent.string = percent;
    },
});