cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        label: cc.Label,
    },
    onLoad() {
    },

    showNotify(title, content) {
        this.title.string = title;
        this.label.string = content;
        this.node.active = true;
    },
    hideNotify() {
        this.node.active = false;
    },
    update(dt) {
    }
});
