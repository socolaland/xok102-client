// ClockOverlayManager.js

const RED_DOT = 'https://kunkey.github.io/demo-bestgate/web/public/BIDO.png';
const WHITE_DOT = 'https://kunkey.github.io/demo-bestgate/web/public/BITRANG.png';

const ClockOverlayManager = {
    id: 'cocos-result-dot-overlay',

    create() {
        return;
        
        let el = document.getElementById(this.id);
        if (el) return;

        // Tạo div chứa các mặt đỏ
        el = document.createElement('div');
        el.id = this.id;
        // Đặt nền cho div từ ảnh URL
        el.style.backgroundImage = "url('https://kunkey.github.io/demo-bestgate/web/public/929415ed-9092-46c2-8c32-f5f9f1a00853.95a0b.png')";
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundSize = 'contain';  // Đảm bảo hình ảnh bao phủ hết div
        el.style.width = '79px';  // Đặt kích thước cho div
        el.style.height = '24px';
        el.style.position = 'absolute';
        el.style.display = 'flex';  // Sử dụng flexbox để bố trí các mặt đỏ
        el.style.alignItems = 'center';  // Căn giữa theo chiều dọc
        el.style.justifyContent = 'center';  // Căn giữa theo chiều ngang
        el.style.bottom = "13px";
        el.style.right = "45px";
        el.style.scale = "2";
        

        // Tạo các mặt đỏ bên trong div
        for (let i = 0; i < 2; i++) {
            const redCircle = document.createElement('img');
            redCircle.src = RED_DOT; // Icon mặt đỏ
            redCircle.style.width = '16px';  // Điều chỉnh kích thước icon
            redCircle.style.height = '16px';
            redCircle.style.marginRight = '1px';  // Khoảng cách giữa các mặt đỏ
            el.appendChild(redCircle);
        }
        // Tạo các mặt trắng bên trong div
        for (let i2 = 0; i2 < 2; i2++) {
            const redCircle = document.createElement('img');
            redCircle.src = WHITE_DOT; // Icon mặt đỏ
            redCircle.style.width = '16px';  // Điều chỉnh kích thước icon
            redCircle.style.height = '16px';
            redCircle.style.marginRight = '1px';  // Khoảng cách giữa các mặt đỏ
            el.appendChild(redCircle);
        }
        el.style.visibility = 'collapse';
        // Gắn div vào body hoặc container mong muốn
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
            el.style.scale = '1.2';
        } else {
            el.style.position = 'absolute';
            el.style.right = `${x}px`;
            el.style.top = `${y}px`;
        }
    },

    /** Cập nhật nội dung kết quả */
    setResult(results) {
        return;
        
        // Truyền vào mảng kết quả (true = mặt đỏ, false = mặt trắng)
        const el = document.getElementById(this.id);
        if (!el) return;
        // Lấy tất cả các icon mặt trong el
        const circles = el.querySelectorAll('img');
        // Lặp qua kết quả và thay đổi ảnh tương ứng
        for (let i = 0; i < results.length; i++) {
            const circle = circles[i];
            // Kiểm tra kết quả và thay đổi hình ảnh tương ứng
            if (results[i]) {
                circle.src = RED_DOT;  // Mặt đỏ
            } else {
                circle.src = WHITE_DOT;  // Mặt trắng (hoặc ảnh khác)
            }
        }
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