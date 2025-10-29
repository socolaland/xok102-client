cc.Class({
    extends: cc.Component,

    properties: {
        spriteEyeOpen: cc.Node,
        spriteEyeClose: cc.Node,
        inputPwd: cc.EditBox
    },

    onLoad: function () {
        this.isVisible = false;
        this.spriteEyeOpen.on(cc.Node.EventType.TOUCH_END, this.onEyeOpen, this);
        this.spriteEyeClose.on(cc.Node.EventType.TOUCH_END, this.onEyeClose, this);

        // Đảm bảo mặc định là password
        this.inputPwd.inputFlag = cc.EditBox.InputFlag.PASSWORD;
    },

    onEyeOpen: function () {
        this.isVisible = true;
        this.spriteEyeOpen.active = false;
        this.spriteEyeClose.active = true;

        // Đổi sang hiển thị bình thường
        this.inputPwd.inputFlag = cc.EditBox.InputFlag.DEFAULT;

        // Force refresh lại text (hack nhỏ)
        let text = this.inputPwd.string;
        this.inputPwd.string = '';
        this.inputPwd.string = text;
    },

    onEyeClose: function () {
        this.isVisible = false;
        this.spriteEyeOpen.active = true;
        this.spriteEyeClose.active = false;

        // Đổi lại về password
        this.inputPwd.inputFlag = cc.EditBox.InputFlag.PASSWORD;

        // Force refresh lại text
        let text = this.inputPwd.string;
        this.inputPwd.string = '';
        this.inputPwd.string = text;
    }
});
