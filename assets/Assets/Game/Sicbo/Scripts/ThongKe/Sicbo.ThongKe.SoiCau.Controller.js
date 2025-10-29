cc.Class({
    extends: cc.Component,

    properties: {
        total_tai: cc.Label,
        total_xiu: cc.Label,
        TaiXiuCell: cc.Node,
        total_row: 5,
        total_colume: 11,
        total_dice_colume: 11,

        scrollView: {
            default: null,
            type: cc.Node
        },

        nodeResultDot: {
            default: null,
            type: cc.Node
        },
        prefabResultDot: {
            default: null,
            type: cc.Prefab
        }
    },
    init(obj) {
        this.CORE = obj;
        // TaiXiuCell   
        this.TaiXiuCell = this.TaiXiuCell.children.map(function (cel) {
            cel.CORE = cel.children.map(function (obj) {
                obj = obj.getComponent(cc.Sprite);
                return obj;
            });
            return cel;
        });
    },
    onScrollViewScrollToBottom() {
        this.scrollView.getComponent(cc.ScrollView).scrollToRight(0.5);
    },
    onLoad() {
    },
    onData: function (data) {
        // console.log(data);
    },
    onClickDot: function (event) {
        cc.log(event);
    },
    // Tính tổng 3 xúc xắc và kiểm tra Tài/Xỉu
    isTai: function (diceValues) {
        return diceValues[0] + diceValues[1] + diceValues[2] >= 11;
    },
    isXiu: function (diceValues) {
        return diceValues[0] + diceValues[1] + diceValues[2] <= 10;
    },
    // Đếm số mặt đỏ (mặt có số chẵn: 2,4,6)
    countRedFaces: function (diceValues) {
        let redCount = 0;
        for (let i = 0; i < diceValues.length; i++) {
            // Mặt đỏ là các mặt có số chẵn (2,4,6)
            if (diceValues[i] % 2 === 0) {
                redCount++;
            }
        }
        return redCount;
    },
    // Kiểm tra xem có phải sập đôi không (3 mặt giống nhau)
    isTriple: function (diceValues) {
        return diceValues[0] === diceValues[1] && diceValues[1] === diceValues[2];
    },
    countOccurrences: function (arr, value) {
        let count = 0;
        for (let num of arr) if (num === value) count++;
        return count;
    },
    toggle: function () {
        this.node.active = !this.node.active;
        this.onScrollViewScrollToBottom();
    },
    //===== SET THONG KE =====//
    setThongKe: function () {
        const seft = this;
        seft.gameLogs = seft.CORE.gameLogs;
        seft.gameLogCounts = seft.CORE.gameLogCounts;

        let tmp_DS = -1;
        let tmp_arrA = [];
        let tmp_arrB = [];
        let c_tai = 0;
        let c_xiu = 0;

        const CreateTaiXiuDataCel = new Promise((resolve, reject) => {
            var newArr = seft.gameLogs.slice();
            newArr.reverse();  // Lật ngược mảng gameLogs để xét từ mới đến cũ

            for (var newDS of newArr) {
                var diceValues = newDS.result;

                // Kiểm tra tổng 3 xúc xắc có tai hay x
                const isTai = seft.isTai(diceValues);

                // Nếu loại mặt thay đổi hoặc mảng tmp_arrB đã đủ số ô (this.total_row)
                if (tmp_DS === -1) tmp_DS = isTai; // Đặt giá trị ban đầu nếu chưa có loại mặt

                // Nếu loại mặt thay đổi, tạo cột mới ngay lập tức
                if (isTai !== tmp_DS) {
                    if (tmp_arrB.length > 0) {
                        tmp_arrA.push(tmp_arrB);  // Đẩy cột kết quả vào mảng tmp_arrA
                        tmp_arrB = [];  // Tạo mới mảng tmp_arrB
                    }
                    tmp_DS = isTai;  // Cập nhật loại mặt
                }

                // Thêm kết quả vào cột hiện tại
                tmp_arrB.push([isTai]);

                // Nếu đủ 5 hàng, tạo cột mới
                if (tmp_arrB.length >= this.total_row) {
                    tmp_arrA.push(tmp_arrB);  // Đẩy cột kết quả vào mảng tmp_arrA
                    tmp_arrB = [];  // Tạo mới mảng tmp_arrB
                }
            }

            // Đảm bảo mảng tmp_arrB cuối cùng được thêm vào tmp_arrA
            if (tmp_arrB.length > 0) tmp_arrA.push(tmp_arrB);

            // Gửi kết quả trả về khi hoàn thành
            resolve(tmp_arrA);
        });

        CreateTaiXiuDataCel.then(values => {
            // set all dot to dot_default
            Promise.all(
                seft.TaiXiuCell.map(function (obj, i) {
                    obj.active = true;
                    return Promise.all(
                        obj.CORE.map(function (current, index) {
                            current.active = true;
                            current.getComponent(cc.Sprite).spriteFrame = null;
                            current.node.children[0].getComponent(cc.Label).string = "";
                            return void 0;
                        })
                    );
                })
            ).then((varT) => { });

            var newData = values;
            newData.reverse();
            newData = newData.slice(0, this.total_colume);
            newData.reverse();

            Promise.all(
                seft.TaiXiuCell.map(function (obj, i) {
                    var data = newData[i];
                    if (void 0 !== data) {
                        obj.active = true;
                        return Promise.all(
                            obj.CORE.map(function (current, index) {
                                const data_Cel = data[index];
                                if (void 0 !== data_Cel) {
                                    const isTai = data_Cel[0];

                                    (isTai) ? c_tai++ : c_xiu++;

                                    // let spriteFr = isTai ? seft.spriteTai : seft.spriteXiu;
                                    let typeDoor = isTai ? "T" : "X";
                                    current.active = true;
                                    current.session = 123;
                                    // current.getComponent(cc.Sprite).spriteFrame = spriteFr;
                                    current.node.setContentSize(35, 35);
                                    current.node.children[0].getComponent(cc.Label).string = typeDoor;
                                    current.node.children[0].getComponent(cc.Label).node.color = isTai ? cc.color().fromHEX("#FF0000")  : cc.color().fromHEX("#D7D7DD");
                                } else {
                                    current.active = false;
                                }
                                return void 0;
                            })
                        );
                    } else {
                        obj.active = false;
                    }
                    return void 0;
                })
            ).then((varT) => {
                seft.total_tai.string = seft.gameLogCounts.tai;
                seft.total_xiu.string = seft.gameLogCounts.xiu;
            });
        });


        // ===== SET RESULT DOT =====//        
        // cat 11 phien cuoi cung
        let DiceColumnLogs = seft.gameLogs.slice(0, seft.total_dice_colume);
        DiceColumnLogs.reverse();
        seft.nodeResultDot.removeAllChildren(); // remove all children
        Promise.all(
            DiceColumnLogs.map(function (session, i) {
                const diceColumn = cc.instantiate(seft.prefabResultDot);
                const diceColumnController = diceColumn.getComponent("Sicbo.ThongKe.SoiCau.DiceLog.Item.Controller");
                diceColumnController.init(session);
                if (session?.result) diceColumnController.setSessionDiceLogs(session.result);
                seft.nodeResultDot.addChild(diceColumn);
            })
        ).then((varT) => {
            // cc.log("Done");
        });
    },
    update(dt) {
    }
});
