const Header_User = require('Lobby.Header_User.Controller');

cc.Class({
    extends: cc.Component,

    properties: {
        Node_Header_Guest: cc.Node,
        Node_Header_User: cc.Node,
        Header_User: Header_User,
        Header_NewInbox: cc.Node
    },

    init(obj) {
    },
    onLoad: function () {
    },
    onDataAuth: function (data) {
        // set header 
        this.Header_User.onData(data);
    },
    onDataNewInbox (count) {
        this.Header_NewInbox.active = (count > 0) ? true: false;
    },
    setHeader() {
        if (cc.CORE.IS_LOGIN) {
            this.Node_Header_Guest.active = false;
            this.Node_Header_User.active = true;
        }else {
            this.Node_Header_Guest.active = true;
            this.Node_Header_User.active = false;
            this.Header_NewInbox.active = false;
        }
    }
    // update (dt) {},
});
