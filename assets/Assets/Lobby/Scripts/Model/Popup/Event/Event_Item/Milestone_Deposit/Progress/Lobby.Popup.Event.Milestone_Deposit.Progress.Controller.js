cc.Class({
    extends: cc.Component,

    properties: {
        Line_Progress_Fill: {
            type: cc.Node,
            default: null
        },
        Line_Progress_Percent_Label: {
            type: cc.Label,
            default: null
        },
        Total_Deposit_Amount_Label: {
            type: cc.Label,
            default: null
        },
        Current_Milestone_Label: {
            type: cc.Label,
            default: null
        },
        Current_Milestone_Reward_Label: {
            type: cc.Label,
            default: null
        },

        Chest_Container: {
            type: cc.Node,
            default: null
        },

        // thể lệ phần mốc nạp và phần thưởng nhận được
        Rule_Reward_Container: {
            type: cc.Label,
            default: []
        },


        Status_Reward_Container: {
            type: cc.Node,
            default: null
        },
        Btn_Claim_Reward_Container: {
            type: cc.Node,
            default: null
        },
    },

    // onLoad () {},

    onEnable() { },
    init(obj) {
        this.CORE = obj;
        this.total_betting_amount = 0;
    },
    cleanProgress() {
        this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = 0;
        this.Line_Progress_Percent_Label.string = '0%';
        this.Status_Join.active = false;
        this.Btn_Deposit.active = true;
        this.Btn_Claim_Reward.active = false;
        this.Total_Deposit_Amount_Label.string = 'Đã nạp: 0';
        this.Reward_Value_Label.string = 'Thưởng: 0';
    },
    /**
     * Lấy thông tin mốc nạp theo tên mốc (milestone_amount)
     * @param {Array} milestones - Danh sách các mốc nạp
     * @param {Number|String} tenMoc - Giá trị milestone_amount cần tìm
     * @returns {Object|null} - Trả về object mốc nạp nếu tìm thấy, ngược lại trả về null
     */
    getMilestoneByName(milestones, tenMoc) {
        if (!Array.isArray(milestones)) return null;
        for (let i = 0; i < milestones.length; i++) {
            if (milestones[i].milestone_amount == tenMoc) {
                return milestones[i];
            }
        }
        return null;
    },

    onData(data) {
        // cc.log(data);
        // tính toán thanh tiến trình dựa trên tổng cược / 195000000
        this.Line_Progress_Fill.getComponent(cc.Sprite).fillRange = data.percent_reached / 100;
        this.Line_Progress_Percent_Label.string = `${data.percent_reached.toFixed(2)}%`;

        this.total_betting_amount = data.total_betting_amount;

        this.Total_Deposit_Amount_Label.string = `Đã nạp: ${cc.CORE.UTIL.abbreviateNumber_2(data.total_deposit_amount)}`;
        this.Current_Milestone_Label.string = `Mốc hiện tại: ${cc.CORE.UTIL.abbreviateNumber_2(data.current_milestone)}`;
        if (data.current_milestone == 0) {
            this.Current_Milestone_Reward_Label.string = `Thưởng: ${cc.CORE.UTIL.abbreviateNumber_2(0)}`;
        } else {
            this.Current_Milestone_Reward_Label.string = `Thưởng: ${cc.CORE.UTIL.numberWithCommas(this.getMilestoneByName(data.milestones, data.current_milestone).reward_amount)}`;
        }

        // Render chests dựa trên current_milestone và trạng thái milestones
        this.renderChests(data);
        // set status reward
        this.SetStatusReward(data);
        // set rule reward
        this.setRuleReward(data);
    },

    setRuleReward(data) {
        if (data?.milestones) {
            data.milestones.forEach(milestone => {
                const milestone_amount = milestone.milestone_amount;
                const rule_reward = this.Rule_Reward_Container.find(child => child.node.name == String(milestone_amount));
                if (rule_reward) {
                    rule_reward.string = `${cc.CORE.UTIL.numberWithCommas(milestone.reward_amount)} VND`;
                } else {
                    // this.Rule_Reward_Container.addChild(new cc.Label(milestone_amount, "Arial", 20));
                }
            });
        }
    },


    SetStatusReward(data) {
        if (data?.milestones) {
            data.milestones.forEach(milestone => {
                // Kiểm tra điều kiện nạp tiền và cược
                const isDepositEnough = data.total_deposit_amount >= milestone.milestone_amount;
                const isBettingEnough = data.total_betting_amount >= milestone.required_betting_amount;
                const isConditionMet = isDepositEnough && isBettingEnough;

                if (milestone.is_received) {
                    // Đã nhận thưởng
                    this.Btn_Claim_Reward_Container.getChildByName(String(milestone.milestone_amount)).active = false;
                    this.Status_Reward_Container.getChildByName(String(milestone.milestone_amount)).getComponent(cc.Label).node.active = true;
                    this.Status_Reward_Container.getChildByName(String(milestone.milestone_amount)).getComponent(cc.Label).string = "Đã nhận thưởng";
                    this.Status_Reward_Container.getChildByName(String(milestone.milestone_amount)).getComponent(cc.Label).node.color = new cc.Color().fromHEX('#29FF00');
                } else if (isConditionMet) {
                    // Đủ điều kiện nhưng chưa nhận
                    const claimButton = this.Btn_Claim_Reward_Container.getChildByName(String(milestone.milestone_amount));
                    const statusLabel = this.Status_Reward_Container.getChildByName(String(milestone.milestone_amount)).getComponent(cc.Label);

                    if (claimButton) {
                        claimButton.active = true;
                        statusLabel.string = ""; // Ẩn text để hiển thị nút
                        statusLabel.node.active = false;
                    } else {
                        cc.log(`Không tìm thấy nút claim cho milestone ${milestone.milestone_amount}`);
                        statusLabel.string = "NHẬN THƯỞNG";
                    }
                } else {
                    // Chưa đủ điều kiện
                    const claimButton = this.Btn_Claim_Reward_Container.getChildByName(String(milestone.milestone_amount));
                    const statusLabel = this.Status_Reward_Container.getChildByName(String(milestone.milestone_amount)).getComponent(cc.Label);

                    if (claimButton) {
                        claimButton.active = false;
                        statusLabel.string = "Chưa đủ điều kiện";
                        statusLabel.node.color = new cc.Color().fromHEX('#FFCC00');
                        statusLabel.node.active = true;
                    }
                }
            });
        }
    },

    /**
     * Render các chest dựa trên current_milestone và trạng thái milestones
     * @param {Object} data - Dữ liệu từ server
     */
    renderChests(data) {
        if (!data.milestones || !Array.isArray(data.milestones)) return;

        // Lấy current_milestone từ data
        const currentMilestone = data.current_milestone;

        // Duyệt qua từng milestone để set trạng thái chest
        data.milestones.forEach((milestone, index) => {
            const chestNode = this.Chest_Container.children[index];
            if (!chestNode) return;

            // Tìm các child nodes của chest (chest-off và chest-open)
            const chestOff = chestNode.getChildByName('chest-off');
            const chestOpen = chestNode.getChildByName('chest-open');
            const currentIndicator = chestNode.children[0]; // Đánh dấu mốc hiện tại

            if (!chestOff || !chestOpen) return;

            // Logic render chest:
            // 1. Nếu milestone đã nhận thưởng (is_received = true) -> hiển thị chest-open
            // 2. Nếu milestone chưa đạt được (milestone_amount > current_milestone) -> hiển thị chest-off (không sáng)
            // 3. Nếu milestone đã đạt được nhưng chưa nhận thưởng -> hiển thị chest-off với hiệu ứng sáng

            if (milestone.is_received) {
                // Đã nhận thưởng -> hiển thị chest mở
                chestOff.active = false;
                chestOpen.active = true;
                // Hiển thị đánh dấu mốc hiện tại nếu đây là mốc hiện tại (kể cả khi đã nhận)
                if (currentIndicator) {
                    currentIndicator.active = (milestone.milestone_amount === currentMilestone);
                }
            } else if (milestone.milestone_amount <= currentMilestone) {
                // Đã đạt được milestone nhưng chưa nhận thưởng -> hiển thị chest đóng với hiệu ứng sáng
                chestOff.active = true;
                chestOpen.active = false;
                this.addClaimableEffect(chestOff);

                // Hiển thị đánh dấu mốc hiện tại nếu đây là mốc hiện tại
                if (currentIndicator) {
                    currentIndicator.active = (milestone.milestone_amount === currentMilestone);
                }
            } else {
                // Chưa đạt được milestone -> hiển thị chest đóng bình thường
                chestOff.active = true;
                chestOpen.active = false;
                this.removeClaimableEffect(chestOff);
                // Ẩn đánh dấu mốc hiện tại
                if (currentIndicator) currentIndicator.active = false;
            }
        });
    },

    /**
     * Thêm hiệu ứng cho chest có thể claim
     * @param {cc.Node} chestNode - Node chest cần thêm hiệu ứng
     */
    addClaimableEffect(chestNode) {
        // Thêm hiệu ứng nhấp nháy hoặc màu sắc đặc biệt
        if (chestNode) {
            // Đảm bảo chest sáng
            chestNode.opacity = 255;
            // Tạo hiệu ứng nhấp nháy nhẹ
            const blinkAction = cc.sequence(
                cc.fadeTo(0.5, 180),
                cc.fadeTo(0.5, 255)
            );
            chestNode.runAction(cc.repeatForever(blinkAction));
        }
    },

    /**
     * Xóa hiệu ứng claimable khỏi chest
     * @param {cc.Node} chestNode - Node chest cần xóa hiệu ứng
     */
    removeClaimableEffect(chestNode) {
        if (chestNode) {
            chestNode.stopAllActions();
            // Không set opacity ở đây vì sẽ được set trong renderChests
        }
    },
    setChest(milestone, chest) {
        if (milestone?.is_received) {
            this.Chest_Container.children[1].active = false;
            this.Chest_Container.children[2].active = true;
        } else {
            this.Chest_Container.children[2].active = false;
            this.Chest_Container.children[1].active = true;
        }
    },
    onClick_Deposit() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.CORE.onClick_Deposit();
    },
    onClick_Claim_Reward(event) {
        const milestone = event.target.name;
        this.CORE.onClick_Claim_Reward(milestone);
    },
    // update (dt) {},
});
