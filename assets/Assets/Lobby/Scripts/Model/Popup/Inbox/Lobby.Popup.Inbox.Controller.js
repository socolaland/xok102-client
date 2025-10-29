cc.Class({
    extends: cc.Component,

    properties: {
        header: cc.Node,
        listInboxNode: cc.Node,
        listInboxContent: cc.Node,
        listInboxContentItem: cc.Prefab,
        showInboxNode: cc.Node,
        showInboxTitle: cc.RichText,
        showInboxTime: cc.Label,
        showInboxFrom: cc.Label,
        showInboxContent: cc.RichText,
        emptyInbox: cc.Node,
    },

    init(obj) {
        this.CORE = obj;
        this.tabShow = "news";
    },
    onLoad() {
    },
    onEnable() {
        this.emptyInbox.active = true;
        this.listInboxContent.removeAllChildren();
        this.listInboxNode.active = true;
        this.showInboxNode.active = false;
        this.getData("news");
    },
    getData: function (type = "news", limit = 30) {
        this.listInboxContent.removeAllChildren();
        this.listInboxNode.active = true;
        this.showInboxNode.active = false;
        this.emptyInbox.active = true;

        const dataPost = {
            event: "inbox",
            data: {
                get_list: {
                    type: type,
                    limit: limit
                }
            }
        };
        cc.CORE.NETWORK.APP.Send(dataPost);
    },
    wrapText: function (text) {
        const maxLineLength = 40;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        let hasWrapped = false;
        
        for (const word of words) {
            if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxLineLength) {
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
    onData: function (dataInbox) {
        if (void 0 !== dataInbox.get_list) {
            const data = dataInbox.get_list;
            this.emptyInbox.active = (data.length > 0) ? false : true;

            data.forEach(item => {
                const node = cc.instantiate(this.listInboxContentItem);
                const nodeComp = node.getComponent("Lobby.Popup.Inbox.Item.Controller");
                nodeComp.init(this, item);
                nodeComp.title.string = item.title;
                nodeComp.time.string = cc.CORE.UTIL.getStringDateByTime(item.createdAt);

                nodeComp.from.string = (this.tabShow == "inbox") ? item?.from_username?.toUpperCase() : item?.admin_username?.toUpperCase();

                if (this.tabShow == "inbox") {
                    nodeComp.new_icon.active = (item.seen) ? false : true;
                }
                if (this.tabShow == "news") {
                    nodeComp.new_icon.active = false;
                }

                this.listInboxContent.addChild(node);
            });
        }
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    onSelectHeader: function (event) {
        cc.CORE.GAME_SCENCE.PlayClick();
        const name = event.target.name;
        this.header.children.forEach(node => {
            if (node.name == name) {
                node.getChildByName("active").active = true; node.getChildByName("none").active = false;
            } else {
                node.getChildByName("active").active = false; node.getChildByName("none").active = true;
            }
        });
        this.getData(name);
        this.tabShow = name;
    },
    onRemoveInbox: function (data) {
        // if (data.type == "notify") return cc.CORE.GAME_SCENCE.FastNotify("Không thể xóa tin tức!", "info", 1);
        const dataPost = {
            event: "inbox",
            data: { remove: { id: data.id } }
        };
        cc.CORE.NETWORK.APP.Send(dataPost);
        setTimeout(() => {
            this.getData(this.tabShow);
        }, 300);
    },
    onClickViewInbox: function (data) {
        if (this.tabShow == "inbox") {
            const dataPost = {
                event: "inbox",
                data: { view: { id: data.id } }
            };
            setTimeout(() => {
                cc.CORE.NETWORK.APP.UTIL.GetCountNewInbox();
            }, 500);
            cc.CORE.NETWORK.APP.Send(dataPost);
        }

        this.listInboxNode.active = false;
        this.showInboxNode.active = true;

        this.showInboxTitle.string = data.title;
        this.showInboxTime.string = cc.CORE.UTIL.getStringDateByTime(data.createdAt);
        this.showInboxFrom.string = (this.tabShow == "inbox") ? data?.from_username?.toUpperCase() : data?.admin_username?.toUpperCase();
        // this.showInboxContent.string = this.wrapText(data.content).text;
        this.showInboxContent.string = data.content;
    },
    update(dt) {
    }
});
