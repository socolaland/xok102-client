const AssetManager = require("AssetManager");

cc.Class({
    extends: cc.Component,

    properties: {},
    // onLoad () {},

    init(obj) {
        this.CORE = obj;
    },
    setEmoji: function (emoji) {
        this.text = emoji;
        AssetManager.loadFromBundle("Common_Bundle", `Images/Emojis/${emoji}`, cc.SpriteFrame)
            .then(emojiSpriteFrame => {
                const emojiNode = this.node.getComponent(cc.Sprite);
                emojiNode.spriteFrame = emojiSpriteFrame;
            })
            .catch(err => console.error("❌ Error loading:", err));
    },
    onClick: function () {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClickChatQuickEmojiItem(this.text);
    }
    // update (dt) {},
});
