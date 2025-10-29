// SnowEffect.js
// Author: Kunkeypr
// Date: 2025-10-27
// Description: Hiệu ứng tuyết rơi


cc.Class({
    extends: cc.Component,

    properties: {
        snowSprites: {
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "Danh sách ảnh bông tuyết (PNG trong suốt)"
        },
        maxSnow: {
            default: 80,
            tooltip: "Số lượng tuyết tối đa"
        },
        spawnInterval: {
            default: 0.1,
            tooltip: "Thời gian giữa mỗi lần spawn"
        },
        speedMin: 60,
        speedMax: 150,
        windStrength: {
            default: 20,
            tooltip: "Độ mạnh của gió (ngang)"
        },
        windSpeed: {
            default: 0.3,
            tooltip: "Tốc độ thay đổi hướng gió"
        },
        sizeMin: 0.5,
        sizeMax: 1.2
    },

    onLoad() {
        this._pool = new cc.NodePool();
        this._snowList = [];
        this._acc = 0;
        this._windTime = 0;

        const visibleSize = cc.view.getVisibleSize();
        this._width = visibleSize.width;
        this._height = visibleSize.height;

        // Tạo sẵn 1 số node để tái sử dụng
        for (let i = 0; i < this.maxSnow; i++) {
            const node = this._createSnowNode();
            this._pool.put(node);
        }
    },

    _createSnowNode() {
        const node = new cc.Node('snow');
        const sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.snowSprites[Math.floor(Math.random() * this.snowSprites.length)];
        node.opacity = 180 + Math.random() * 75;
        node.scale = this.sizeMin + Math.random() * (this.sizeMax - this.sizeMin);
        node._vx = 0;
        node._vy = -(this.speedMin + Math.random() * (this.speedMax - this.speedMin));
        node._rotSpeed = -30 + Math.random() * 60;
        return node;
    },

    _spawnSnow() {
        if (this._snowList.length >= this.maxSnow) return;
        let node = this._pool.size() > 0 ? this._pool.get() : this._createSnowNode();
        node.parent = this.node;

        node.x = (Math.random() - 0.5) * this._width;
        node.y = this._height / 2 + 50;
        node._vx = 0;
        node._vy = -(this.speedMin + Math.random() * (this.speedMax - this.speedMin));

        this._snowList.push(node);
    },

    update(dt) {
        // Gió đổi hướng chậm
        this._windTime += dt * this.windSpeed;
        const wind = Math.sin(this._windTime) * this.windStrength;

        // Spawn tuyết định kỳ
        this._acc += dt;
        if (this._acc >= this.spawnInterval) {
            this._acc = 0;
            this._spawnSnow();
        }

        // Cập nhật từng hạt tuyết
        for (let i = this._snowList.length - 1; i >= 0; i--) {
            const node = this._snowList[i];
            node.x += (wind + node._vx) * dt;
            node.y += node._vy * dt;
            node.angle += node._rotSpeed * dt;

            // Nếu rơi ra khỏi màn thì tái sử dụng
            if (node.y < -this._height / 2 - 50) {
                this._recycle(node, i);
            }
        }
    },

    _recycle(node, index) {
        this._snowList.splice(index, 1);
        this._pool.put(node);
    }
});
