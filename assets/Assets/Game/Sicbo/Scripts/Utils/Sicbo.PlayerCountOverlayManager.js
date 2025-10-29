// ClockOverlayManager.js

const ClockOverlayManager = {
    id: 'cocos-players-count-overlay',
    textId: 'cocos-players-count-overlay-txt',

    create(initialText = '0') {
        return;
        
        let el = document.getElementById(this.id);
        if (el) return;
    
        // Tạo div chứa icon và số lượng
        el = document.createElement('div');
        el.id = this.id;
    
        // Tạo phần tử chứa icon
        const icon = document.createElement('img');
        icon.src = 'https://kunkey.github.io/demo-bestgate/web/public/ICON-PERSON.png.png';  // Icon người dùng
        icon.alt = 'User Icon';
        icon.style.width = '15px';  // Điều chỉnh kích thước icon
        icon.style.height = '15px';
        icon.style.marginRight = '7px';  // Khoảng cách giữa icon và số lượng
        icon.style.marginLeft = '-3px';
        icon.style.marginTop = '-2px';
        // Tạo phần tử chứa số lượng người
        const text = document.createElement('span');
        text.id = this.textId;
        text.innerText = initialText;  // Số lượng người
        text.style.color = 'rgb(255, 255, 255)';
        text.style.fontSize = '17px';
        text.style.fontWeight = 'bold';
        text.style.fontFamily = 'sans-serif';
    
        // Thêm icon và số lượng vào div
        el.appendChild(icon);
        el.appendChild(text);
    
        // Gán style cho div
        el.style.width = 'auto';  // Tự động căn chỉnh chiều rộng
        el.style.height = '30px';  // Chiều cao div
        el.style.position = 'absolute';
        el.style.color = "rgb(255, 255, 255)";
        el.style.fontSize = "18px";
        el.style.fontWeight = "bold";
        el.style.fontFamily = 'Digital7, monospace';
        el.style.display = 'flex';
        el.style.alignItems = 'center';  // Căn giữa dọc
        el.style.justifyContent = 'center';  // Căn giữa ngang
        el.style.textAlign = 'center';
        el.style.zIndex = 9999;
        el.style.pointerEvents = 'none';
        el.style.top = "40px";
        el.style.scale = "1.5";
        el.style.right = "19px";
    
        // Gắn vào body hoặc container mong muốn
        document.getElementById("iframe-overlay-div").appendChild(el);
    },

    updateFixedPosition(x = 0, y = 0) {
        return;
        
        const canvas = document.getElementById('GameCanvas') || document.querySelector('canvas');
        const el = document.getElementById(this.id);
        if (!canvas || !el) return;
    
        if (!cc.CORE.UTIL.isMobile()) {
            // Lấy kích thước của canvas và vị trí của nó trên màn hình
            const rect = canvas.getBoundingClientRect();
            // Tính toán vị trí căn giữa màn hình (hoặc canvas)
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            // Cập nhật vị trí căn từ chính giữa, cộng với x và y truyền vào
            el.style.position = 'absolute';
            el.style.right = `${centerX - el.offsetWidth / 2 + x}px`; // Căn giữa và dịch chuyển theo x
            el.style.top = `${centerY - el.offsetHeight / 2 + y}px`; // Căn giữa và dịch chuyển theo y
        } else {
            el.style.scale = '0.8';
            el.style.position = 'absolute';
            el.style.right = `${x}px`;
            el.style.top = `${y}px`;
        }
    },

    /** Cập nhật nội dung text */
    setText(text) {
        return;
        
        const el = document.getElementById(this.textId);
        if (el) el.innerText = text;
    },

    /** Ẩn overlay */
    hide() {
        return;
        
        const el = document.getElementById(this.id);
        if (el) el.style.visibility = 'collapse';
    },

    /** Hiện overlay */
    show() {
        return;
        
        const el = document.getElementById(this.id);
        if (el) el.style.visibility = 'unset';
    },

    /** Xoá overlay */
    destroy() {
        return;
        
        const el = document.getElementById(this.id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }
};

window.ClockOverlayManager = ClockOverlayManager;

module.exports = ClockOverlayManager;