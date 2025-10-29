// WebIframeHelper.js

const WebIframeHelper = {
    iframeId: 'custom-webview',

    /**
     * Tạo iframe và gán src
     */
    createIframe(url = '', zIndex = 0) {
        if (document.getElementById(this.iframeId)) return;

        const iframe = document.createElement('iframe');
        iframe.id = this.iframeId;
        iframe.src = url;
        iframe.style.position = 'absolute';
        iframe.style.zIndex = zIndex;
        iframe.style.border = 'none';
        iframe.style.pointerEvents = 'auto';
        iframe.style.display = 'block';
        iframe.style.background = 'transparent';

        document.body.appendChild(iframe);
    },

    /**
     * Cập nhật vị trí và kích thước iframe theo node Cocos
     */
    updateIframeToNode(node) {
        if (!node || !cc.Camera.main) return;

        const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        const nodeSize = node.getContentSize();
        const screenPos = cc.Camera.main.getWorldToScreenPoint(worldPos);

        const scaleX = cc.view.getScaleX();
        const scaleY = cc.view.getScaleY();

        const iframe = document.getElementById(this.iframeId);
        if (!iframe) return;

        iframe.style.left = `${screenPos.x - (nodeSize.width * scaleX) / 2}px`;
        iframe.style.top = `${screenPos.y - (nodeSize.height * scaleY) / 2}px`;
        iframe.style.width = `${nodeSize.width * scaleX}px`;
        iframe.style.height = `${nodeSize.height * scaleY}px`;
    },

    /** Hiện iframe */
    showIframe() {
        const iframe = document.getElementById(this.iframeId);
        if (iframe) iframe.style.display = 'block';
    },

    /** Ẩn iframe */
    hideIframe() {
        const iframe = document.getElementById(this.iframeId);
        if (iframe) iframe.style.display = 'none';
    },

    /** Xóa iframe */
    removeIframe() {
        const iframe = document.getElementById(this.iframeId);
        if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }
};

window.WebIframeHelper = WebIframeHelper;

module.exports = WebIframeHelper;