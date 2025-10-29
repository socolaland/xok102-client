const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.Label,
        message_text: cc.RichText,
        message_emoji: cc.Node,
    },
    // onLoad () {},

    init(obj) {
        this.CORE = obj;
    },

    onEnable: function () {
    },
    wrapText: function (text) {
        const maxLineLength = 46;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        let hasWrapped = false;
        
        for (const word of words) {
            if ((currentLine + (currentLine ? ' ' : '') + word).length + this.username.string.length <= maxLineLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    hasWrapped = true;
                }
                currentLine = word;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        // cc.log(lines);
        return {
            text: lines.join('\n'),
            isWrapped: hasWrapped
        };
    },
    addMessage: function (type, username, message, color_username, color_content) {
        this.username.string = username;
        this.username.node.color = cc.color().fromHEX(color_username); // Set màu

        if (type == "text") {
            this.message_text.node.active = true;
            this.message_emoji.active = false;

            let wrappedResult = this.wrapText(message);
            let text = `<color=${color_content}>${wrappedResult.text}</color>`;
            this.message_text.string = text;
            
            // // Có thể sử dụng wrappedResult.isWrapped để biết văn bản có bị xuống dòng hay không
            // cc.log("Văn bản có bị xuống dòng:", wrappedResult.isWrapped);

            // Set chiều cao của chatNode bằng chiều cao của contentNode
            setTimeout(() => {
                this.node.height = this.message_text.node.height + (wrappedResult.isWrapped ? 20 : 0);
            }, 100)
        } else if (type == "emoji") {
            this.message_text.node.active = false;
            this.message_emoji.active = true;

            AssetManager.loadFromBundle("Common_Bundle", `Images/Emojis/${message}`, cc.SpriteFrame)
                .then(emoji => {
                    const emojiNode = this.message_emoji.children[0].getComponent(cc.Sprite);
                    emojiNode.spriteFrame = emoji;
                })
                .catch(err => console.error("❌ Error loading:", err));
        }
    }
    // update (dt) {},
});
