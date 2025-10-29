/**
 * GameOverlay.js
 * Quản lý overlay div che phủ game canvas với nút button có thể di chuyển
 */

const GameOverlay = {
    id: 'GameOverlayDiv',
    buttonId: 'GameOverlayButton',
    isDragging: false,
    wasDragging: false, // Thêm biến để theo dõi xem có phải vừa kéo thả hay không
    dragStartPos: { x: 0, y: 0 }, // Lưu vị trí bắt đầu để so sánh
    dragThreshold: 10, // Ngưỡng pixel để xác định có phải kéo hay không
    dragOffset: { x: 0, y: 0 },
    customCallback: null, // Thêm thuộc tính để lưu custom callback
    
    /**
     * Tạo overlay div
     * @param {Function} callback - Custom callback function khi click button
     */
    create(callback = null) {
        // Lưu custom callback
        this.customCallback = callback;
        
        // Kiểm tra xem overlay đã tồn tại chưa
        if (document.getElementById(this.id)) {
            // console.log('GameOverlay: Overlay đã tồn tại');
            return;
        }

        // Tạo div overlay chính
        const overlayDiv = document.createElement('div');
        overlayDiv.id = this.id;
        overlayDiv.className = 'GameOverlay';
        overlayDiv.style.cssText = `
            position: absolute;
            z-index: 5;
            margin: auto;
            width: 100% !important;
            height: 100% !important;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            overflow: hidden;
            background-color: #000;
        `;

        // Tạo iframe (nếu cần)
        const iframe = document.createElement('iframe');
        iframe.id = 'GameOverlayIframe';
        iframe.style.cssText = `
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            border: none;
            width: calc(100% + 35px);
            width: 100%;
            height: 100%;
            overflow: auto;
        `;
        // iframe.src = 'https://example.com'; // Thay đổi URL nếu cần

        // Tạo button có thể di chuyển
        const button = document.createElement('button');
        button.id = this.buttonId;
        button.className = 'GameOverlayButton';
        button.style.cssText = `
            display: block;
            background-image: url('https://kunkey.github.io/demo-bestgate/web/public/image-removebg-preview.png');
            background-repeat: no-repeat;
            background-size: contain;
            background-color: rgba(255, 255, 255, 0);
            position: absolute;
            top: 10vh;
            right: 4vh;
            border: none;
            width: 6vh;
            height: 6vh;
            z-index: 6;
        `;
        button.innerHTML = '';
        // button.title = 'Game Overlay Button (Có thể kéo thả)';

        // Thêm các element vào overlay
        overlayDiv.appendChild(iframe);
        overlayDiv.appendChild(button);

        // Thêm overlay vào body
        document.body.appendChild(overlayDiv);

        // Thiết lập sự kiện cho button
        this.setupButtonEvents(button);

        // console.log('GameOverlay: Đã tạo overlay thành công');
        return overlayDiv;
    },

    /**
     * Thiết lập sự kiện cho button
     */
    setupButtonEvents(button) {
        // Sự kiện mouse down
        button.addEventListener('mousedown', (e) => {
            this.startDragging(e);
        });

        // Sự kiện touch start (cho mobile)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDragging(e.touches[0]);
        });

        // Sự kiện mouse move
        document.addEventListener('mousemove', (e) => {
            if (this.dragStartPos.x !== 0 || this.dragStartPos.y !== 0) {
                this.checkAndStartDragging(e);
            }
        });

        // Sự kiện touch move (cho mobile)
        document.addEventListener('touchmove', (e) => {
            if (this.dragStartPos.x !== 0 || this.dragStartPos.y !== 0) {
                e.preventDefault();
                this.checkAndStartDragging(e.touches[0]);
            }
        });

        // Sự kiện mouse up
        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });

        // Sự kiện touch end (cho mobile)
        document.addEventListener('touchend', () => {
            this.stopDragging();
        });

        // Sự kiện click cho button (desktop)
        button.addEventListener('click', (e) => {
            // console.log('Button click event triggered desktop');
            e.preventDefault(); // Ngăn chặn hành vi mặc định
            if (!this.isDragging && !this.wasDragging) {
                this.onButtonClick(e);
            }
        });

        // Sự kiện touchend cho button (mobile)
        button.addEventListener('touchend', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định

            // Nếu đang kéo thả hoặc vừa kéo thả thì không gọi click
            if (this.isDragging || this.wasDragging) {
                return;
            }
            
            // Gọi onClick ngay lập tức nếu không phải kéo thả
            this.onButtonClick(e);
        });

        // Thêm sự kiện mousedown để debug
        // button.addEventListener('mousedown', (e) => {
        //     console.log('Button mousedown event triggered');
        // });
    },

    /**
     * Bắt đầu kéo thả
     */
    startDragging(e) {
        // Lưu vị trí bắt đầu để so sánh
        this.dragStartPos.x = e.clientX;
        this.dragStartPos.y = e.clientY;
        
        this.isDragging = false; // Chưa kéo thực sự, chỉ mới bắt đầu
        this.wasDragging = false; // Reset wasDragging
        
        const button = document.getElementById(this.buttonId);
        if (!button) return;

        const rect = button.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        button.style.transition = 'none';
        button.style.transform = 'scale(1.1)';
    },

    /**
     * Kiểm tra và bắt đầu kéo thả nếu vượt ngưỡng
     */
    checkAndStartDragging(e) {
        if (this.isDragging) {
            // Đã đang kéo, tiếp tục kéo
            this.drag(e);
            return;
        }

        // Tính khoảng cách di chuyển
        const deltaX = Math.abs(e.clientX - this.dragStartPos.x);
        const deltaY = Math.abs(e.clientY - this.dragStartPos.y);
        
        // Nếu vượt ngưỡng thì bắt đầu kéo thực sự
        if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
            this.isDragging = true;
            this.drag(e);
        }
    },

    /**
     * Kéo thả
     */
    drag(e) {
        if (!this.isDragging) return;

        const button = document.getElementById(this.buttonId);
        if (!button) return;

        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;

        // Giới hạn button trong viewport
        const maxX = window.innerWidth - button.offsetWidth;
        const maxY = window.innerHeight - button.offsetHeight;

        button.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        button.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    },

    /**
     * Dừng kéo thả
     */
    stopDragging() {
        const wasActuallyDragging = this.isDragging;
        
        // Reset tất cả trạng thái
        this.isDragging = false;
        this.dragStartPos.x = 0;
        this.dragStartPos.y = 0;
        
        // Chỉ đánh dấu wasDragging nếu thực sự đã kéo
        if (wasActuallyDragging) {
            this.wasDragging = true;
            // Reset wasDragging sau một khoảng thời gian ngắn
            setTimeout(() => {
                this.wasDragging = false;
            }, 100);
        }
        
        const button = document.getElementById(this.buttonId);
        if (!button) return;

        button.style.transition = 'all 0.3s ease';
        button.style.transform = 'scale(1)';
    },

    /**
     * Xử lý sự kiện click button
     */
    onButtonClick(e) {
        // Thêm logic xử lý click ở đây
        // Ví dụ: hiển thị popup, toggle overlay, v.v.
        if (this.customCallback) {
            this.customCallback();
        }
    },

    /**
     * Hiển thị overlay
     */
    show() {
        const overlay = document.getElementById(this.id);
        if (overlay) {
            overlay.style.display = 'block';
        }
    },

    /**
     * Ẩn overlay
     */
    hide() {
        const overlay = document.getElementById(this.id);
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    /**
     * Toggle overlay
     */
    toggle() {
        const overlay = document.getElementById(this.id);
        if (overlay) {
            if (overlay.style.display === 'none') {
                this.show();
            } else {
                this.hide();
            }
        }
    },

    /**
     * Xóa overlay
     */
    destroy() {
        const overlay = document.getElementById(this.id);
        if (overlay) {
            document.body.removeChild(overlay);
        }
    },

    /**
     * Cập nhật vị trí button
     */
    setButtonPosition(x, y) {
        const button = document.getElementById(this.buttonId);
        if (button) {
            button.style.right = x + 'px';
            button.style.top = y + 'px';
        }
    },

    /**
     * Thay đổi nội dung iframe
     */
    setIframeSrc(url) {
        const iframe = document.getElementById('GameOverlayIframe');
        if (iframe) {
            iframe.src = url;
        }
    },

    /**
     * Thay đổi nội dung button
     */
    setButtonContent(content) {
        const button = document.getElementById(this.buttonId);
        if (button) {
            button.innerHTML = content;
        }
    },

    /**
     * Thiết lập custom callback cho button click
     * @param {Function} callback - Custom callback function
     */
    setCustomCallback(callback) {
        this.customCallback = callback;
    },

    /**
     * Lấy custom callback hiện tại
     * @returns {Function|null} Custom callback function hoặc null
     */
    getCustomCallback() {
        return this.customCallback;
    },

    /**
     * Xóa custom callback
     */
    removeCustomCallback() {
        this.customCallback = null;
    },

    /**
     * Kiểm tra trạng thái overlay
     */
    debug() {
        const overlay = document.getElementById(this.id);
        const button = document.getElementById(this.buttonId);
        
        console.log('=== GameOverlay Debug ===');
        console.log('Overlay exists:', !!overlay);
        console.log('Button exists:', !!button);
        
        if (overlay) {
            console.log('Overlay display:', overlay.style.display);
            console.log('Overlay pointer-events:', overlay.style.pointerEvents);
            console.log('Overlay z-index:', overlay.style.zIndex);
        }
        
        if (button) {
            console.log('Button display:', button.style.display);
            console.log('Button pointer-events:', button.style.pointerEvents);
            console.log('Button z-index:', button.style.zIndex);
            console.log('Button position:', {
                left: button.style.left,
                top: button.style.top
            });
        }
        
        console.log('Is dragging:', this.isDragging);
        console.log('Was dragging:', this.wasDragging);
        console.log('Drag start pos:', this.dragStartPos);
        console.log('Custom callback:', this.customCallback);
        console.log('========================');
    }
};

// Export cho Cocos Creator
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameOverlay;
} else if (typeof cc !== 'undefined') {
    cc.GameOverlay = GameOverlay;
} else {
    window.GameOverlay = GameOverlay;
}
