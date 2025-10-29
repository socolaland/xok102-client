cc.Class({
    extends: cc.Component,

    properties: {
        tab_select_container: {
            default: null,
            type: cc.Node
        },
        scrollViewContent: {
            default: null,
            type: cc.ScrollView
        }
    },

    // onLoad () {},

    onLoad() {
        this.category_name = [
            "Tab_Hot",
            "Tab_Live_Casino",
            "Tab_Lottery",
            "Tab_Sport",
            "Tab_SLot",
            "Tab_Fish"
        ];
        this.category_offset = [
            0, // Tab_Hot
            635, // Tab_Live_Casino
            1928.7229199845694, // Tab_Lottery
            2599.4223490395125, // Tab_Sport
            3275.984964665731, // Tab_SLot
            5393.610708400109 // Tab_Fish
        ];
        this.category_offset_click_tab = [
            0, // Tab_Hot
            820.3489337150303, // Tab_Live_Casino
            2190.078034103539, // Tab_Lottery
            3003.089499569084, // Tab_Sport
            3825.3371746806934, // Tab_SLot
            6083.176044819049 // Tab_Fish
        ];
        // thêm sự kiện click vào tab chuyên mục
        this.tab_select_container.children.forEach((category, index) => {
            category.on(cc.Node.EventType.TOUCH_END, (event) => this.activeTab({ target: { name: this.category_name[index] } }, index), this);
        });

        // giả định bạn có mảng lưu vị trí bắt đầu của từng section
        this.scrollViewContent.node.on('scrolling', () => {
            let posY = this.scrollViewContent.content.y;
            // cc.log("game content posY: ", posY);
            for (let i = 0; i < this.category_offset.length; i++) {
                if (posY < this.category_offset[i + 1] || i === this.category_offset.length - 1) {
                    this.changerTab({ target: { name: this.category_name[i] } });
                    break;
                }
            }
        });
    },
    changerTab: function (event, tabIndex = null) {
        const currentSelect = event.target.name;
        this.tab_select_container.children.forEach((category, index) => {
            if (category.name == currentSelect) {
                category.getChildByName("active").active = true;
                category.getChildByName("none").active = false;
                category.getChildByName("arrow").active = true;
            } else {
                category.getChildByName("active").active = false;
                category.getChildByName("none").active = true;
                category.getChildByName("arrow").active = false;
            }
        });

        if (tabIndex !== null) {
            this.scrollToTab(tabIndex, true);
        }
    },
    activeTab: function (event) {
        this.scroll_with_manual = false;
        const currentSelect = event.target.name;
        let tabIndex = null;
        this.tab_select_container.children.forEach((category, index) => {
            if (category.name == currentSelect) {
                tabIndex = index;
                category.getChildByName("active").active = true;
                category.getChildByName("none").active = false;
                category.getChildByName("arrow").active = true;
            } else {
                category.getChildByName("active").active = false;
                category.getChildByName("none").active = true;
                category.getChildByName("arrow").active = false;
            }
        });
        if (tabIndex !== null) this.scrollToTab(tabIndex, false);
    },
    scrollToTab: function (index, manual = false) {
        let targetY = manual ? this.category_offset[index] : this.category_offset_click_tab[index];
        // cc.log("targetY: ", targetY);
        this.scrollViewContent.scrollToOffset(cc.v2(0, targetY), 0.5); // scroll mượt trong 0.5 giây
    },
    clickGameScrollToTab: function (event, value, manual = false) {
        let targetY = manual ? this.category_offset[Number(value)] : this.category_offset_click_tab[Number(value)];
        // cc.log("targetY: ", targetY);
        this.scrollViewContent.scrollToOffset(cc.v2(0, targetY), 0.5); // scroll mượt trong 0.5 giây
    },
    // update (dt) {},
});
