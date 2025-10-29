cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },
        avatarItemPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        this.content.removeAllChildren();
        this.loadAvatarList();
    },
    onDisable() {
        this.content.removeAllChildren();
    },

    onChangeAvatar(avatar_id) {
        if (!cc.CORE.IS_LOGIN) return cc.CORE.GAME_SCENCE.Popup.show("signin");

        cc.CORE.NETWORK.APP.Send({
            event: "user",
            data: { set_avatar: avatar_id }
        });
    },

    loadAvatarList() {
        const bundleName = 'Common_Bundle';
        // Đường dẫn đến thư mục chứa ảnh avatar trong bundle
        // Nhớ rằng đường dẫn này là TƯƠNG ĐỐI với gốc của bundle (Assets/)
        const folderPathInBundle = 'Images/Avatar';

        // 1. Tải Bundle
        cc.assetManager.loadBundle(bundleName, (err, bundle) => {
            if (err) {
                console.error("Lỗi khi tải bundle:", err);
                return;
            }

            // 2. Tải tất cả SpriteFrame trong thư mục 'Images/Avatar'
            // cc.SpriteFrame là kiểu tài nguyên chúng ta mong muốn
            bundle.loadDir(folderPathInBundle, cc.SpriteFrame, (err, spriteFrames) => {
                if (err) {
                    console.error("Lỗi khi tải tất cả avatar từ thư mục:", err);
                    return;
                }

                // Sắp xếp các SpriteFrame theo tên (ID) để đảm bảo thứ tự hiển thị đúng
                // Vì tên là số (0, 1, 20), chúng ta cần sắp xếp theo giá trị số.
                spriteFrames.sort((a, b) => {
                    return parseInt(a.name) - parseInt(b.name);
                });

                // 3. Duyệt qua từng SpriteFrame đã tải và tạo Item Node
                spriteFrames.forEach(spriteFrame => {
                    // Tên của SpriteFrame sẽ là tên file gốc (ví dụ: "0", "1", "20")
                    const avatarId = spriteFrame.name;

                    // Tạo một item mới từ Prefab
                    const avatarItem = cc.instantiate(this.avatarItemPrefab);
                    
                    // Thêm item vào Node cha (ví dụ: content của ScrollView)
                    this.content.addChild(avatarItem);

                    // Gán SpriteFrame cho Sprite component trên Item Node
                    const spriteComponent = avatarItem.getComponent(cc.Sprite);
                    if (spriteComponent) {
                        spriteComponent.spriteFrame = spriteFrame;
                    } else {
                        console.warn("Prefab avatarItemPrefab không có component cc.Sprite!");
                    }

                    // Tùy chọn: Gán ID (tên) cho Item Node và/hoặc truyền vào script con
                    avatarItem.name = `${avatarId}`; // Đặt tên Node cho dễ quản lý trong Hierarchy

                    // Giả sử Prefab của bạn có một script tên là 'AvatarItemScript'
                    // và script đó có hàm 'setAvatarId' để lưu ID.
                    const itemScript = avatarItem.getComponent('Lobby.Popup.ChangeAvatar.Item.Controller');
                    itemScript.init(this);
                    if (itemScript && itemScript.setAvatarId) {
                        itemScript.setAvatarId(avatarId);
                    } else {
                        console.warn("Không tìm thấy script Lobby.Popup.ChangeAvatar.Item.Controller hoặc hàm setAvatarId trên Prefab!");
                    }
                    // console.log(`Đã tạo item cho avatar ID: ${avatarId}`);
                });
            });
        });
    },

    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    update(dt) {
    }
});
