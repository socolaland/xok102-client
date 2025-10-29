

cc.Class({
    extends: cc.Component,

    properties: {
        spriteChan: cc.SpriteFrame,
        spriteLe: cc.SpriteFrame,
        spriteSapdoi: cc.SpriteFrame,
        total_chan: cc.Label,
        total_le: cc.Label,
        ChanLeCel: cc.Node,
        total_row: 5,
        total_colume: 11,
        
        scrollView: {
            default: null,
            type: cc.Node
        },
    },
    init(obj) {
        this.CORE = obj;
        // ChanLeCel
        this.ChanLeCel = this.ChanLeCel.children.map(function (cel) {
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
    isEvenSum: function (arr) {
        let countOnes = 0;
        for (let num of arr) if (num === true) countOnes++;
        return countOnes % 2 === 0;
    },
    isEqualFull: function (arr) {
        // Kiểm tra nếu tất cả là 0
        if (arr[0] === 0 && arr[1] === 0 && arr[2] === 0 && arr[3] === 0) return true;
        // Kiểm tra nếu tất cả là 1
        if (arr[0] === 1 && arr[1] === 1 && arr[2] === 1 && arr[3] === 1) return true;
        return false; // Không phải cả 4 là 0 hoặc cả 4 là 1
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
    setThongKe: function () {
        const seft = this;
        seft.gameLogs = seft.CORE.gameLogs;
        seft.gameLogCounts = seft.CORE.gameLogCounts;

        let tmp_DS = -1;
        let tmp_arrA = [];
        let tmp_arrB = [];
        let c_chan = 0;
        let c_le = 0;

        const CreateChanLeDataCel = new Promise((resolve, reject) => {
            var newArr = seft.gameLogs.slice();
            newArr.reverse();  // Lật ngược mảng gameLogs để xét từ mới đến cũ
        
            for (var newDS of newArr) {
                var diceValues = newDS.result;
        
                // Kiểm tra số mặt đỏ xuất hiện (giả sử mặt đỏ là true)
                const type = seft.countOccurrences(diceValues, true);  // Đếm số mặt đỏ
                const isEven = seft.isEvenSum(diceValues);  // Kiểm tra xem tổng có phải là chẵn không
        
                // Phân loại theo kiểu chẵn/lẻ
                const isChan = isEven ? true : false; // true = chẵn, false = lẻ
                

                // Nếu loại mặt thay đổi hoặc mảng tmp_arrB đã đủ số ô (this.total_row)
                if (tmp_DS === -1) tmp_DS = isChan; // Đặt giá trị ban đầu nếu chưa có loại mặt
        
                // Điều kiện khi loại mặt thay đổi hoặc mảng tmp_arrB đủ dài
                if (isChan !== tmp_DS || tmp_arrB.length >= this.total_row) {
                    tmp_DS = isChan;  // Cập nhật loại mặt (chẵn/lẻ)
                    tmp_arrA.push(tmp_arrB);  // Đẩy cột kết quả vào mảng tmp_arrA
                    tmp_arrB = [];  // Tạo mới mảng tmp_arrB để nhóm các mặt đỏ tiếp theo
                }
        
                // Thêm kết quả vào cột hiện tại dưới dạng [chẵn/lẻ, số mặt đỏ]
                tmp_arrB.push([isChan, type]);  // Lưu trữ kiểu (chẵn/lẻ) và số mặt đỏ
            }
        
            // Đảm bảo mảng tmp_arrB cuối cùng được thêm vào tmp_arrA
            if (tmp_arrB.length > 0) tmp_arrA.push(tmp_arrB);
        
            // Gửi kết quả trả về khi hoàn thành
            resolve(tmp_arrA);
        })
        // .then(rs => {
        //     cc.log(rs)
        // });
        // return;

        CreateChanLeDataCel.then(values => {
            // set all dot to dot_default
            Promise.all(
                seft.ChanLeCel.map(function (obj, i) {
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
                seft.ChanLeCel.map(function (obj, i) {
                    var data = newData[i];
                    if (void 0 !== data) {
                        obj.active = true;
                        return Promise.all(
                            obj.CORE.map(function (current, index) {
                                const data_Cel = data[index];
                                if (void 0 !== data_Cel) {
                                    const isEven = data_Cel[0];
                                    const countRedDot = data_Cel[1];

                                    (isEven) ? c_chan++: c_le++;

                                    let spriteFr = isEven ? seft.spriteChan : seft.spriteLe;
                                    let typeDoor = countRedDot;

                                    current.active = true;
                                    current.session = 123;
                                    current.getComponent(cc.Sprite).spriteFrame = spriteFr;
                                    current.node.setContentSize(35, 35);
                                    current.node.children[0].getComponent(cc.Label).string = typeDoor;
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
                seft.total_chan.string = seft.gameLogCounts.even;
                seft.total_le.string = seft.gameLogCounts.odd;
            });
        });
    },
    update(dt) {
    }
});
