const KeyboardManager = require("Sicbo.KeyBoardManager");

const KEY = cc.macro.KEY;

const DealerKeyboardManager = {
        handleInput(dt) {
                KeyboardManager.update(dt);

                // Xử lý phím số từ 0-9
                for (let i = 0; i <= 9; i++) {
                        const keyCode = KEY["num" + i];
                        if (KeyboardManager.wasKeyJustPressed(keyCode)) {
                                this.onNumberPressed(i);
                                KeyboardManager.consumeJustPressed(keyCode);
                        }
                }

                // Xử lý phím Enter

                if (
                        KeyboardManager.wasKeyJustPressed(KEY.enter) || // thường là 13
                        KeyboardManager.wasKeyJustPressed(108)          // numpad Enter
                ) {
                        this.onEnterPressed();
                        KeyboardManager.consumeJustPressed(KEY.enter);
                        KeyboardManager.consumeJustPressed(108);
                }
        },

        onNumberPressed(number) {
                cc.log("[DealerKeyboardManager] Bấm số:", number);
                // Thực hiện hành động tương ứng, ví dụ:
                // if (number === 1) this.switchWeapon(1);

                
                //==== DEALER ====//
                //*** Gửi phím lên máy chủ ***//
                if (void 0 !== number) {
                        if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
                                if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {

                                        if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, false);

                                        cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím lên máy chủ:", number);
                                        cc.CORE.NETWORK.DEALER.Send({
                                                event: "dealer_machine_signal",
                                                data: { command: String(number) }
                                        });
                                }
                        }
                }
        },

        onEnterPressed() {
                cc.log("[DealerKeyboardManager] Bấm phím Enter");

                //==== DEALER ====//
                //*** Gửi phím Enter lên máy chủ ***//
                if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
                        if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {

                                if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, false);

                                cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím Enter lên máy chủ");
                                cc.CORE.NETWORK.DEALER.Send({
                                        event: "dealer_machine_signal",
                                        data: { command: "enter" }
                                });
                        }
                }
        }
};

module.exports = DealerKeyboardManager;
