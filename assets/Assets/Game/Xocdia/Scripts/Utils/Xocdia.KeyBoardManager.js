let keyState = {};
let keyCooldown = {};
let justPressed = {}; // ← mới thêm
const DEFAULT_COOLDOWN = 0.2;

const KeyboardManager = {
    init() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    },

    _onKeyDown(event) {
        // cc.log(`[KeyboardManager] Key down: ${event.keyCode}`);
        if (!keyState[event.keyCode]) {
            justPressed[event.keyCode] = true; // đánh dấu vừa bấm
            // cc.log(`[KeyboardManager] Just pressed: ${event.keyCode}`);
        }
        keyState[event.keyCode] = true;
    },

    _onKeyUp(event) {
        keyState[event.keyCode] = false;
        keyCooldown[event.keyCode] = 0;
    },

    isKeyPressed(keyCode) {
        return !!keyState[keyCode];
    },

    wasKeyJustPressed(keyCode) {
        const result = justPressed[keyCode] === true;
        // cc.log(`[KeyboardManager] wasKeyJustPressed(${keyCode}) = ${result}`);
        return result;
    },

    consumeJustPressed(keyCode) {
        justPressed[keyCode] = false;
    },

    canUseKey(keyCode) {
        return !keyCooldown[keyCode] || keyCooldown[keyCode] <= 0;
    },

    consumeKey(keyCode, cooldown = DEFAULT_COOLDOWN) {
        keyCooldown[keyCode] = cooldown;
    },

    update(dt) {
        for (let key in keyCooldown) {
            if (keyCooldown[key] > 0) keyCooldown[key] -= dt;
        }
    },

    destroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }
};

module.exports = KeyboardManager;
