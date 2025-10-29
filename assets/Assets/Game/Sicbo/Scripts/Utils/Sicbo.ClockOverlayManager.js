// ClockOverlayManager.js

const ClockOverlayManager = {
    id: 'cocos-timer-overlay',

    create(initialText = '00') {
        return;

        const style = document.createElement('style');
        style.innerHTML = `
          @font-face {
            font-family: 'Digital7';
            src: url('https://kunkey.github.io/demo-bestgate/web/public/do19k0.woff') format('woff');
          }
        `;
        document.head.appendChild(style);

        let el = document.getElementById(this.id);
        if (el) return;

        el = document.createElement('div');
        el.id = this.id;
        el.innerText = initialText; // Giá trị hiển thị

        el.className = "chakra-petch-regular";

        // Gán style
        el.style.width = "50px";
        el.style.height = "50px";
        el.style.position = 'absolute';
        el.style.color = "rgb(255, 255, 255)";
        el.style.fontSize = "30px";
        el.style.fontWeight = "bold";
        el.style.fontFamily = 'Digital7, monospace';
        el.style.pointerEvents = "none";
        el.style.backgroundImage = "url('https://kunkey.github.io/demo-bestgate/web/public/DONGHO.png')";
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundSize = "contain";

        // Căn giữa nội dung
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.textAlign = "center";

        el.style.zIndex = 9999;
        el.style.pointerEvents = 'none';
        el.style.bottom = "75px";
        el.style.left = "25px";
        el.style.scale = "1.8";

        // Gắn vào body hoặc container mong muốn
        document.getElementById("iframe-overlay-div").appendChild(el);
    },

    /** Cập nhật vị trí theo node Cocos */
    // updateFixedPosition(x = 0, y = 0) {
    //     const canvas = document.getElementById('GameCanvas') || document.querySelector('canvas');
    //     const el = document.getElementById(this.id);
    //     if (!canvas || !el) return;

    //     const rect = canvas.getBoundingClientRect();

    //     // Vị trí tính theo canvas
    //     el.style.left = `${rect.left + x}px`;
    //     el.style.top = `${rect.top + y}px`;
    // },
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
            el.style.left = `${centerX - el.offsetWidth / 2 + x}px`; // Căn giữa và dịch chuyển theo x
            el.style.top = `${centerY - el.offsetHeight / 2 + y}px`; // Căn giữa và dịch chuyển theo y
        } else {
            
            el.style.position = 'absolute';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }
    },

    /** Cập nhật nội dung text */
    setText(text) {
        return;
        
        const el = document.getElementById(this.id);
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