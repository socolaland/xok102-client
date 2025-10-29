cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,  // Trang PageView
        bannerContent: cc.Node,
        bannerItem: cc.Prefab,
        paginationItem: cc.Prefab,
        paginationContent: cc.Node,
        slideDuration: 2,  // Thời gian chuyển slide tự động
    },

    init(obj) {
        this.CORE = obj;
    },

    onLoad() {
        this.pageIndex = 0;
        this.initPagination();
        this.setupAutoSlide();
        // Ép lại kích thước bannerContent bằng với vùng hiển thị cha
        if (this.bannerContent.parent) {
            this.bannerContent.width = this.bannerContent.parent.width;
            this.bannerContent.height = this.bannerContent.parent.height;
        }
        // Thêm log debug vào TOUCH_START
        this.bannerContent.on(cc.Node.EventType.TOUCH_START, this.onBannerTouchStart, this);
        this.bannerContent.on(cc.Node.EventType.TOUCH_MOVE, this.onBannerTouchMove, this);
        this.bannerContent.on(cc.Node.EventType.TOUCH_END, this.onBannerTouchEnd, this);
        this.bannerContent.on(cc.Node.EventType.TOUCH_CANCEL, this.onBannerTouchEnd, this);
    },

    initPagination() {
        // Lấy tổng số trang dựa trên số lượng bannerItem thực tế
        this.totalPage = this.bannerContent.children.length;
        // Xóa các item cũ
        this.paginationContent.removeAllChildren();
        // Tạo các item cho pagination
        for (let i = 0; i < this.totalPage; i++) {
            const item = cc.instantiate(this.paginationItem);
            const isActive = i === this.pageIndex;
            item.color = cc.color().fromHEX(isActive ? "#FF0000" : "#FFFFFF");
            item.opacity = isActive ? 158 : 255;
            this.paginationContent.addChild(item);
        }
    },

    updatePagination() {
        this.paginationContent.children.forEach((node, index) => {
            const isActive = index === this.pageIndex;
            node.color = cc.color().fromHEX(isActive ? "#FF0000" : "#FFFFFF");
            node.opacity = isActive ? 158 : 255;
        });
    },

    setupAutoSlide() {
        // Hủy lịch cũ nếu có
        this.unschedule(this.slideNext);
        // Lên lịch chuyển trang mới
        this.schedule(this.slideNext, this.slideDuration);
    },

    setSlide() {
        try {
            const self = this;
            const banner_data = cc.CORE.GAME_CONFIG.BANNER;

            if (void 0 !== banner_data && banner_data.length > 0) {
                this.bannerContent.removeAllChildren();
                // Đặt lại vị trí bannerContent về 0
                this.bannerContent.x = 0;
                // Thêm item đầu tiên vào cuối để tạo hiệu ứng loop
                const extendedData = [...banner_data, banner_data[0]];

                extendedData.forEach((item, i) => {
                    const bannerItem = cc.instantiate(this.bannerItem);
                    const itemComp = bannerItem.getComponent("Lobby.Banner.Image.Item.Controler");
                    itemComp.init(this, item);
                    cc.CORE.UTIL.LoadImgFromUrl(itemComp.image, item.image, null, function (err, spriteFrame) {
                        try {
                            // Lấy kích thước vùng hiển thị (cha của bannerContent)
                            let viewWidth = self.bannerContent.parent.width;
                            let viewHeight = self.bannerContent.parent.height;
                            // Đảm bảo mỗi bannerItem có kích thước đúng
                            bannerItem.width = viewWidth;
                            bannerItem.height = viewHeight;
                            // Xếp ngang
                            bannerItem.x = i * viewWidth;
                            bannerItem.y = 0;
                            // Gán sự kiện kéo trực tiếp cho từng bannerItem
                            bannerItem.on(cc.Node.EventType.TOUCH_START, self.onBannerTouchStart, self);
                            bannerItem.on(cc.Node.EventType.TOUCH_MOVE, self.onBannerTouchMove, self);
                            bannerItem.on(cc.Node.EventType.TOUCH_END, self.onBannerTouchEnd, self);
                            bannerItem.on(cc.Node.EventType.TOUCH_CANCEL, self.onBannerTouchEnd, self);
                            self.bannerContent.addChild(bannerItem);
                            if (self.bannerContent.children.length === extendedData.length) {
                                self.pageIndex = 0;
                                self.slideToPage(0, true);
                                self.initPagination();
                                self.setupAutoSlide && self.setupAutoSlide();
                            }
                        } catch (error) {
                            // console.log(error)
                        }
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    },

    slideNext() {
        if (!this.bannerContent || this.bannerContent.children.length === 0) return;
        let nextIndex = this.pageIndex + 1;

        if (nextIndex >= this.bannerContent.children.length - 1) {
            // Chuyển đến item clone
            this.slideToPage(nextIndex, false);
            // Sau khi chuyển xong, reset về item đầu một cách mượt mà
            this.scheduleOnce(() => {
                this.bannerContent.x = 0;
                this.pageIndex = 0;
                this.updatePagination();
            }, 0.5);
        } else {
            this.slideToPage(nextIndex);
        }
    },

    slideToPage(index, instant = false) {
        let targetX = -index * this.bannerContent.parent.width;
        if (instant) {
            this.bannerContent.x = targetX;
        } else {
            cc.tween(this.bannerContent)
                .to(0.5, { x: targetX }, { easing: 'smooth' })
                .start();
        }
        this.pageIndex = index;
        this.updatePagination && this.updatePagination();
    },

    onBannerTouchStart(event) {
        this._dragStartX = event.getLocationX();
        this._startBannerX = this.bannerContent.x;
        this.unschedule(this.slideNext); // Tạm dừng auto slide khi kéo
    },

    onBannerTouchMove(event) {
        let deltaX = event.getLocationX() - this._dragStartX;
        let viewWidth = this.bannerContent.parent.width;
        let minX = -viewWidth * (this.bannerContent.children.length - 1);
        let maxX = 0;
        let newX = this._startBannerX + deltaX;
        // Giới hạn biên
        newX = Math.max(minX, Math.min(maxX, newX));
        this.bannerContent.x = newX;
    },

    onBannerTouchEnd(event) {
        let viewWidth = this.bannerContent.parent.width;
        let delta = this.bannerContent.x - (-this.pageIndex * viewWidth);

        if (Math.abs(delta) > viewWidth / 4) {
            if (delta < 0 && this.pageIndex < this.bannerContent.children.length - 1) {
                this.pageIndex++;
            } else if (delta > 0 && this.pageIndex > 0) {
                this.pageIndex--;
            }
        }

        if (this.pageIndex >= this.bannerContent.children.length - 1) {
            this.slideToPage(this.pageIndex, false);
            this.scheduleOnce(() => {
                this.bannerContent.x = 0;
                this.pageIndex = 0;
                this.updatePagination();
            }, 0.5);
        } else {
            this.slideToPage(this.pageIndex);
        }

        this.setupAutoSlide && this.setupAutoSlide();
    },
});
