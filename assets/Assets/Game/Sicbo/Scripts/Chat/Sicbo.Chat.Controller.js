cc.Class({
    extends: cc.Component,

    properties: {
        inputChat: cc.EditBox,
        content: cc.Node,
        itemChatPrefab: cc.Prefab,
        itemChatQuickTextPrefab: cc.Prefab,
        itemChatQuickEmojiPrefab: cc.Prefab,

        chatMain_Node: cc.Node,
        chatQuickText_Node: cc.Node,
        chatQuickEmoji_Node: cc.Node,

        contentQuickText: cc.Node,
        contentQuickEmoji: cc.Node,
    },
    // onLoad () {},

    init(obj) {
        this.CORE = obj;
        this.quickchat_text_list = ['Tài', 'Xỉu', 'Kết Tài', 'Kết Xỉu', 'Chạm 1', 'Chạm 2', 'Chạm 3', 'Chạm 4', 'Chạm 5', 'Chạm 6', 'Đen Quá', 'Lại thua', 'Còn cái nịt', 'Đen quá', 'Đánh gì đây', 'Bộ sáp']
        this.quickchat_emoji_list = [
            "EMO1", "EMO2", "EMO3", "EMO4", "EMO5", "EMO6", "EMO7", "EMO8", "EMO9", "EMO10",
            "EMO11", "EMO12", "EMO13", "EMO14", "EMO15", "EMO16", "EMO17", "EMO18", "EMO19",
            "EMO20", "ICONEMO"
        ];

        this.contentQuickText.removeAllChildren();
        this.quickchat_text_list.forEach(chatText => {
            const node = cc.instantiate(this.itemChatQuickTextPrefab);
            const nodeComp = node.getComponent("Sicbo.Chat.QuickText.Item.Controller");
            nodeComp.init(this);
            nodeComp.text.string = chatText;
            this.contentQuickText.addChild(node);
        });

        this.contentQuickEmoji.removeAllChildren();
        this.quickchat_emoji_list.forEach(chatEmoji => {
            const node = cc.instantiate(this.itemChatQuickEmojiPrefab);
            const nodeComp = node.getComponent("Sicbo.Chat.QuickEmoji.Item.Controller");
            nodeComp.init(this);
            nodeComp.setEmoji(chatEmoji);
            this.contentQuickEmoji.addChild(node);
        });
    },
    onEnable: function () {
        this.chatMain_Node.active = true;
        this.chatQuickText_Node.active = false;
        this.chatQuickEmoji_Node.active = false;
    },
    toggle: function () {
        this.node.active = !this.node.active;
    },
    openChatBoard: function () {
        this.node.active = true;
    },
    closeChatBoard: function () {
        this.node.active = false;
    },
    openChatTab: function (event, customEventData) {
        this.node.active = true;
        if (customEventData == "text") {
            this.chatMain_Node.active = false;
            this.chatQuickText_Node.active = true;
            this.chatQuickEmoji_Node.active = false;
        } else if (customEventData == "emoji") {
            this.chatMain_Node.active = false;
            this.chatQuickText_Node.active = false;
            this.chatQuickEmoji_Node.active = true;
        } else {
            this.chatMain_Node.active = true;
            this.chatQuickText_Node.active = false;
            this.chatQuickEmoji_Node.active = false;
        }
    },
    sendMessage: function () {
        if (this.inputChat.string.length <= 0) return;
        if (this.inputChat.string.length > 80) return cc.CORE.GAME_SCENCE.FastNotify("Nội dung chat quá dài!", "info", 1, false);

        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    chat: {
                        send_chat: {
                            room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                            message: this.inputChat.string,
                            type: "text"
                        }
                    }
                }
            }
        });
        this.inputChat.string = "";
    },
    onClickChatQuickTextItem: function (text) {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    chat: {
                        send_chat: {
                            room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                            message: text,
                            type: "text"
                        }
                    }
                }
            }
        });
        this.openChatTab(null, null);
    },
    onClickChatQuickEmojiItem: function (text) {
        cc.CORE.NETWORK.APP.Send({
            event: "game",
            data: {
                sicbo: {
                    chat: {
                        send_chat: {
                            room_code: cc.CORE.GAME_ROOM.ROOM_CODE,
                            message: text,
                            type: "emoji"
                        }
                    }
                }
            }
        });
        this.openChatTab(null, null); this.openChatTab(null, null);
    },
    MessagePush: function (type, username, message, color_username = "#FFC200", color_content = "#FFFFFF") {
        const node = cc.instantiate(this.itemChatPrefab);
        const nodeComp = node.getComponent("Sicbo.Chat.Item.Controller");
        nodeComp.init(this);
        nodeComp.addMessage(type, username, message, color_username, color_content);
        this.content.addChild(node);
    },
    onData: function (data) {
        if (void 0 !== data.get_chat) {
            data.get_chat.forEach(chat => {
                this.MessagePush(chat.type, chat.nickname, chat.content, chat.color_username, chat.color_content);
            });
        }
        if (void 0 !== data.new_chat) {
            const chat = data.new_chat;
            this.MessagePush(chat.type, chat.nickname, chat.content, chat.color_username, chat.color_content);
        }
    }
    // update (dt) {},
});
