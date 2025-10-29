const DICE_SICBO_IMAGE = [
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_UN_SET.png',
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_1.png',
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_2.png',
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_3.png',
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_4.png',
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_5.png',
    'https://kunkey.github.io/demo-bestgate/web/public/XUCXAC_6.png',
];

const ResultDotOverlayManager = {
    id: 'cocos-result-dot-overlay',

    create() {
        return;
        
        let el = document.getElementById(this.id);
        if (el) return;

        // Tạo div chứa các mặt xúc xắc
        el = document.createElement('div');
        el.id = this.id;
        // Đặt nền cho div từ ảnh URL
        el.style.backgroundImage = "url('https://kunkey.github.io/demo-bestgate/web/public/929415ed-9092-46c2-8c32-f5f9f1a00853.95a0b.png')";
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundSize = 'contain';  // Đảm bảo hình ảnh bao phủ hết div
        el.style.width = '97px';  // Đặt kích thước cho div
        el.style.height = '34px';
        el.style.position = 'absolute';
        el.style.display = 'flex';  // Sử dụng flexbox để bố trí các mặt xúc xắc
        el.style.alignItems = 'center';  // Căn giữa theo chiều dọc
        el.style.justifyContent = 'center';  // Căn giữa theo chiều ngang
        el.style.bottom = "22px";
        el.style.right = "47px";
        el.style.gap = "3px";
        el.style.scale = "2";


        // Tạo 3 mặt xúc xắc bên trong div
        for (let i = 0; i < 3; i++) {
            const diceFace = document.createElement('img');
            diceFace.src = DICE_SICBO_IMAGE[0]; // Icon mặt mặc định
            diceFace.style.width = '25px';  // Điều chỉnh kích thước icon
            diceFace.style.height = '25px';
            diceFace.style.marginRight = '1px';  // Khoảng cách giữa các mặt xúc xắc
            el.appendChild(diceFace);
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
        
        // Truyền vào mảng kết quả 3 mặt xúc xắc (số từ 1-6)
        // Ví dụ: setResult([1, 3, 6]) sẽ hiển thị mặt 1, 3, 6
        const el = document.getElementById(this.id);
        if (!el) return;

        // Lấy tất cả các icon mặt trong el
        const diceFaces = el.querySelectorAll('img');

        // Ẩn tất cả các icon mặt xúc xắc trước khi cập nhật
        diceFaces.forEach((diceFace, index) => {
            diceFace.style.visibility = 'collapse';
        });

        // Sử dụng Promise.all để tải tất cả hình ảnh cùng lúc
        const promises = results.map((result, index) => {
            return new Promise((resolve) => {
                if (index < diceFaces.length) {
                    const diceFace = diceFaces[index];

                    // Kiểm tra kết quả và thay đổi hình ảnh tương ứng
                    if (result >= 1 && result <= 6) {
                        diceFace.src = DICE_SICBO_IMAGE[result];  // Sử dụng index tương ứng với số mặt
                    } else {
                        diceFace.src = DICE_SICBO_IMAGE[0];  // Mặt mặc định nếu số không hợp lệ
                    }
                    // diceFace.style.visibility = 'unset';
                    // Đợi hình ảnh load xong
                    diceFace.onload = () => resolve();
                    diceFace.onerror = () => resolve(); // Vẫn resolve nếu lỗi
                } else {
                    resolve();
                }
            });
        });

        // Ẩn tất cả các icon mặt xúc xắc trước khi cập nhật
        diceFaces.forEach((diceFace, index) => {
            diceFace.style.visibility = 'unset';
        });

        // Chờ tất cả hình ảnh load xong
        Promise.all(promises).then(() => {
            // console.log('Tất cả hình ảnh xúc xắc đã được tải xong');
        });
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

window.ResultDotOverlayManager = ResultDotOverlayManager;

module.exports = ResultDotOverlayManager;