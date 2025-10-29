const KeyboardManager = require("Xocdia.KeyBoardManager");

const KEY = cc.macro.KEY;

const DealerKeyboardManager = {
        handleInput(dt) {
                KeyboardManager.update(dt);

                for (let i = 0; i <= 9; i++) {
                        const keyCode = KEY["num" + i];
                        if (KeyboardManager.wasKeyJustPressed(keyCode)) {
                                this.onNumberPressed(i);
                                KeyboardManager.consumeJustPressed(keyCode);
                        }
                }

                // Xử lý phím Enter
                // if (KeyboardManager.wasKeyJustPressed(KEY.enter)) {
                //         this.onEnterPressed();
                //         KeyboardManager.consumeJustPressed(KEY.enter);
                // }
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

                //==== DEALER ====//
                //*** Gửi phím lên máy chủ ***//
                if (void 0 !== number) {
                        if (void 0 !== cc.CORE.USER.account_type && cc.CORE.USER.account_type == "dealer") {
                                if (void 0 !== cc.CORE.NETWORK.DEALER && cc.CORE.NETWORK.DEALER.IS_CONNECTED) {

                                        if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, false);

                                        // Lưu phím gần nhất
                                        cc.CORE.GAME_SCENCE.DealerKeyLatest = number;

                                        cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím lên máy chủ:", number);
                                        cc.CORE.NETWORK.DEALER.Send({
                                                event: "dealer_machine_signal",
                                                data: {
                                                        command: String(number),
                                                        confirm: false
                                                },
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
                                // Kiểm tra có phím đã lưu không
                                if (void 0 !== cc.CORE.GAME_SCENCE.DealerKeyLatest) {

                                        if (cc.CORE.GAME_SCENCE.DealerLockedPressKey) return cc.CORE.GAME_SCENCE.FastNotify("Vui lòng chờ xử lý hoàn tất!.", "warning", 1, false);


                                        cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Gửi phím Enter lên máy chủ với confirm=true");
                                        cc.CORE.NETWORK.DEALER.Send({
                                                event: "dealer_machine_signal",
                                                data: {
                                                        command: String(cc.CORE.GAME_SCENCE.DealerKeyLatest),
                                                        confirm: true
                                                },
                                        });
                                } else {
                                        cc.log(new Date().toISOString() + ": [DealerKeyboardManager] Không có phím nào được lưu để confirm");
                                }
                        }
                }
        }
};

module.exports = DealerKeyboardManager;
