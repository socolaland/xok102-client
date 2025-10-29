const md5 = require('md5');
const BrowserUtil = require('BrowserUtil');
const HttpRequest = require("HttpRequest");

// Set FPS Framerate Scene Coccos
function setFrameRate(frameRate) {
    const listDeviceLowPerf = [
        "iPhone OS 14",
        "iPhone OS 15",
        "iPhone OS 16",
        "Android 10",
        "Android 11",
        "Android 12",
        "iPad",
        "Macintosh",
    ];
    let isLowGPU = false;
    listDeviceLowPerf.forEach((device) => {
        const checkDevice = cc.sys.isBrowser && window.navigator.userAgent.includes(device);
        if (checkDevice) {
            console.log(`Detected ${device} Is Low GPU Device! ...`);
            // cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
            //     if (this.vertexOffset + vertexCount > 65535) {
            //         this.uploadData();
            //         this._batcher._flush();
            //     }
            // };
            // cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
            //     this.uploadData();
            //     this.switchBuffer();
            // };
            return isLowGPU = true;
        }
    });
    (!isLowGPU) ? cc.game.setFrameRate(frameRate) : cc.game.setFrameRate(60);
}

function optimizeMeshBuffer() {
    // Điều chỉnh lại MeshBuffer để xử lý các vấn đề hiệu suất trên thiết bị yếu
    cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
        if (this.vertexOffset + vertexCount > 65535) {
            this.uploadData();
            this._batcher._flush();
        }
    };
    cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
        this.uploadData();
        this.switchBuffer();
    };
}

function isDynamicDevice() {
    // kiểm tra thiết bị có notch hoặc Dynamic Island
    let safeRect = cc.sys.getSafeAreaRect();
    // cc.winSize = kích thước toàn màn hình theo designResolution
    let winSize = cc.winSize;

    // Nếu vùng safe area nhỏ hơn màn hình → có notch hoặc cutout
    if (safeRect.width < winSize.width || safeRect.height < winSize.height || safeRect.x !== 0 || safeRect.y !== 0) {
        // cc.log('Thiết bị có notch hoặc Dynamic Island');
        return true;
    } else {
        // cc.log('Thiết bị không có notch');
        return false;
    }
}

function forceEnableAudio() {
    if (cc.sys.isBrowser) {
        let ctx = cc.audioEngine._audioID || cc.audioEngine._context;
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (ctx.state === "running") {
            cc.CORE.AUDIO.licensedAudio = true;
            // cc.log("✅ Audio đã được cấp phép và hoạt động");
        } else if (ctx.state === "suspended") {
            // console.log("⛔ Audio chưa được cấp phép");
        }
    }
}

function isMobile() {
    if (cc.sys.isNative) {
        return true;
    } else if (cc.sys.isBrowser) {
        // Lấy thông tin user-agent
        var userAgent = navigator.userAgent.toLowerCase();
        // Kiểm tra nếu là điện thoại hoặc máy tính bảng (mobile devices)
        if (/android|iphone|ipod|ipad|windows phone/i.test(userAgent)) {
            return true; // Trả về "Mobile" nếu là điện thoại hoặc máy tính bảng
        } else {
            return false; // Trả về "Desktop" nếu là máy tính
        }
    } else {
        return false;
    }
}

function initSpriteBase64(spriteNode, base64Data) {
    // spriteNode.node.active = true;
    let o = new Image;
    o.src = base64Data;
    // o.width = spriteNode.node.width;
    // o.height = spriteNode.node.height;
    setTimeout(function () {
        let base64Data = new cc.Texture2D;
        base64Data.initWithElement(o);
        base64Data.handleLoadedTexture();
        let e = new cc.SpriteFrame(base64Data);
        spriteNode.spriteFrame = e;
    }.bind(this), 10)
}

function signHash(input) {
    var key = "3DsGqAndp32mErJjzflz6Uvz0ni1HYuP";
    return md5(input + key);
}

function getQueryValue(queryName) {
    let queryValue = null;
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) {
            if (pair[1] == '') return queryValue;
            queryValue = pair[1];
            return queryValue;
        }
    }
    return queryValue;
}

function isEmpty(str) {
    return (!str || 0 === str.length)
}

function validateEmail(t) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t);
}

function checkPhoneValid(phone) {
    return /^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))[0-9]{7,10}$/im.test(phone);
}

function maskPhoneNumber(phone) {
    if (!phone || phone.length < 7) return phone; // không đủ dài thì không mask

    const start = phone.slice(0, 3);
    const end = phone.slice(-2);
    const masked = '*'.repeat(phone.length - 7);

    return `${start}${masked}${end}`;
}


function nFormatter(t, e) {
    for (var i = [{
        value: 1e18,
        symbol: "E"
    }, {
        value: 1e15,
        symbol: "P"
    }, {
        value: 1e12,
        symbol: "T"
    }, {
        value: 1e9,
        symbol: "G"
    }, {
        value: 1e6,
        symbol: "M"
    }, {
        value: 1e3,
        symbol: "K"
    }], o = /\.0+$|(\.[0-9]*[1-9])0+$/, n = 0; n < i.length; n++)
        if (t >= i[n].value)
            return (t / i[n].value).toFixed(e).replace(o, "$1") + i[n].symbol;
    return t.toFixed(e).replace(o, "$1")
}

function abbreviateNumber(value) {
    if (value < 1000) return value;
    // Định nghĩa các hậu tố
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    // Xác định bậc của số (dựa trên log10 để chia cho 1000^n)
    const suffixNum = Math.floor(Math.log10(value) / 3);
    // Chia giá trị cho 1000^suffixNum để rút gọn
    const shortValue = value / Math.pow(1000, suffixNum);
    // Làm tròn đến 3 chữ số thập phân cho các giá trị có hậu tố M và B
    let formattedValue;
    if (suffixes[suffixNum] === 'K') {
        // Nếu là K, chỉ rút gọn đến hàng nghìn (1 chữ số sau dấu phẩy)
        formattedValue = shortValue.toFixed(0);
    } else if (suffixes[suffixNum] === 'M' || suffixes[suffixNum] === 'B') {
        // Nếu là M hoặc B, rút gọn đến hàng triệu (3 chữ số sau dấu phẩy)
        formattedValue = shortValue.toFixed(3);
        const parse = formattedValue.split(".");
        if (parse[1]) {
            if (Number(parse[1]) == 0) formattedValue = shortValue.toFixed(0)
        }
    } else {
        // Các trường hợp khác, không làm tròn
        formattedValue = shortValue;
    }
    // Ghép với hậu tố tương ứng
    return `${formattedValue}${suffixes[suffixNum]}`;
}

function abbreviateNumber_2(value) {
    if (value < 1000) return value;
    // Định nghĩa các hậu tố
    const suffixes = ["", "K", "M", "B", "T"];
    // Xác định bậc của số
    const suffixNum = Math.floor(Math.log10(value) / 3);
    // Chia giá trị cho 1000^suffixNum để rút gọn
    const shortValue = value / Math.pow(1000, suffixNum);
    // Giữ 2 chữ số thập phân, không làm tròn lên
    const formattedValue = Math.floor(shortValue * 100) / 100;
    // Ghép với hậu tố tương ứng
    return `${formattedValue}${suffixes[suffixNum]}`;
}

function numberWithCommas(number) {
    if (number) {
        var result = (number = parseInt(number)).toString().split(".");
        return result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."),
            result.join(".")
    }
    return "0"
}

function numberWithCommasReal(number) {
    if (number) {
        // Làm tròn đến 2 chữ số thập phân
        let roundedNumber = parseFloat(number).toFixed(2);
        // Tách phần nguyên và phần thập phân
        let result = roundedNumber.split(".");
        // Thêm dấu phân cách cho phần nguyên
        result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // Kết hợp phần nguyên và phần thập phân
        return result.join(".");
    }
    return "0"; // Giá trị mặc định nếu đầu vào là null hoặc undefined
}


function getOnlyNumberInString(t) {
    var e = t.match(/\d+/g);
    return e ? e.join("") : ""
}

function isNumber(value) {
    return typeof value === 'number';
}

function numberToTime(t) {
    t < 0 && (t = 0),
        t = parseInt(t);
    let e = parseInt(t / 60),
        i = t % 60;
    return e < 10 && (e = "0" + e),
        i < 10 && (i = "0" + i),
        e + ":" + i
}

function numberPad(number, length) {
    let str = '' + number;
    while (str.length < length)
        str = '0' + str;
    return str;
}

function divideEqually(items, users) {
    const itemsPerUser = Math.floor(items.length / users.length);
    const result = [];
    let start = 0;
    for (let i = 0; i < users.length; i++) {
        const end = start + itemsPerUser;
        result.push(items.slice(start, end));
        start = end;
    }
    // Xử lý phần dư (nếu có)
    const remainingItems = items.slice(start);
    if (remainingItems.length > 0) {
        // Phân bổ phần dư cho các user đầu tiên
        for (let i = 0; i < remainingItems.length; i++) {
            result[i].push(remainingItems[i]);
        }
    }
    return result;
}

function inputNumber(obj) {
    var onShift = false
    obj.addEventListener('keydown', function (e) {
        if (e.keyCode === 16) {
            e.preventDefault();
            onShift = true;
        }
    });
    obj.addEventListener('keyup', function (e) {
        if (e.keyCode === 16) {
            e.preventDefault();
            onShift = false;
        }
    });
    obj.addEventListener('keydown', function (e) {
        if (!onShift && ((e.keyCode >= 48 && e.keyCode <= 57) ||
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            (e.keyCode >= 37 && e.keyCode <= 40) ||
            e.keyCode === 107 ||
            e.keyCode === 109 ||
            e.keyCode === 189 ||
            e.keyCode === 8 ||
            e.keyCode === 13)) { } else {
            e.preventDefault();
        }
    });
}

function numberTo(obj, start, end, duration, currency = false) {
    clearInterval(obj.timer);
    var range = end - start;
    var minTimer = 50;
    var stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    var startTime = new Date().getTime();
    var endTime = startTime + duration;

    obj.timer = setInterval(function () {
        if (!!obj.node) {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = (end - (remaining * range)) >> 0;
            obj.string = currency ? numberWithCommas(value) : value;
            if (value == end) {
                clearInterval(obj.timer);
            }
        } else clearInterval(obj.timer);
    }, stepTime);
}

function numberToReal(obj, start, end, duration, currency = false) {
    clearInterval(obj.timer);
    var range = end - start;
    var minTimer = 50;
    var stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    var startTime = new Date().getTime();
    var endTime = startTime + duration;

    obj.timer = setInterval(function () {
        if (!!obj.node) {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = (end - (remaining * range)).toFixed(2);
            obj.string = currency ? numberWithCommasReal(value) : value;
            if (value == end) {
                clearInterval(obj.timer);
            }
        } else clearInterval(obj.timer);
    }, stepTime);
}

function nonAccentVietnamese(str) {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}


function getStringDateByTime(t) {
    var e = new Date(t),
        i = e.getHours(),
        o = e.getMinutes(),
        ss = e.getSeconds(),
        n = e.getDate(),
        s = e.getMonth() + 1;
    return i < 10 && (i = "0" + i),
        o < 10 && (o = "0" + o),
        n < 10 && (n = "0" + n),
        s < 10 && (s = "0" + s),
        i + ":" + o + ":" + numberPad(ss, 2) + " " + n + "/" + s + "/" + e.getFullYear()
}

function getStringDateByTimeNoYear(t) {
    var e = new Date(t),
        i = e.getHours(),
        o = e.getMinutes(),
        n = e.getDate(),
        s = e.getMonth() + 1;
    return (
        i < 10 && (i = "0" + i),
        o < 10 && (o = "0" + o),
        n < 10 && (n = "0" + n),
        s < 10 && (s = "0" + s),
        i + ":" + o + " " + n + "/" + s + ""
    );
}

function getDayOfWeek(dateString, format = "DD-MM-YYYY") {
    // Mảng các tên ngày trong tuần
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    // Chuyển đổi định dạng ngày tùy theo tham số 'format'
    let date;
    if (format === "DD-MM-YYYY") {
        const [day, month, year] = dateString.split("-");
        date = new Date(`${year}-${month}-${day}`);  // Chuyển sang định dạng YYYY-MM-DD để tạo Date
    } else if (format === "MM-DD-YYYY") {
        const [month, day, year] = dateString.split("-");
        date = new Date(`${year}-${month}-${day}`);  // Chuyển sang định dạng YYYY-MM-DD để tạo Date
    } else {
        // Nếu không nhận được định dạng đúng, trả về lỗi
        throw new Error("Invalid format. Supported formats: 'DD-MM-YYYY', 'MM-DD-YYYY'");
    }
    // Trả về ngày trong tuần theo tên
    return days[date.getDay()];
}

function getDateByTime(t) {
    var e = new Date(t);
    return e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear()
}

function getStringHourByTime(t) {
    var e = new Date(t),
        i = e.getHours(),
        o = e.getMinutes(),
        n = e.getSeconds();
    return i < 10 && (i = "0" + i),
        o < 10 && (o = "0" + o),
        n < 10 && (n = "0" + n),
        i + ":" + o + ":" + n
}

// get khoangr thoi gian đầu ra DD-MM-YYYY
function getDateRange(type) {
    const date = new Date();

    // Định dạng ngày theo DD-MM-YYYY
    const formatDate = (d) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    let fromDate, toDate;

    switch (type) {
        case 'today': {
            // Ngày hôm nay
            fromDate = toDate = date;
            break;
        }
        case 'this_week': {
            // Tuần này (từ thứ 2 đến chủ nhật)
            const currentDay = date.getDay();
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - currentDay + 1); // Lùi lại đến thứ 2

            const endOfWeek = new Date(date);
            endOfWeek.setDate(date.getDate() - currentDay + 7); // Tiến tới chủ nhật

            fromDate = startOfWeek;
            toDate = endOfWeek;
            break;
        }
        case 'this_month': {
            // Tháng này (từ ngày 1 đến cuối tháng)
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);  // Ngày 1 tháng hiện tại
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Ngày cuối tháng hiện tại

            fromDate = startOfMonth;
            toDate = endOfMonth;
            break;
        }
        case 'this_year': {
            // Năm nay (từ ngày 1 tháng 1 đến ngày 31 tháng 12)
            const startOfYear = new Date(date.getFullYear(), 0, 1);  // Ngày 1 tháng 1 của năm nay
            const endOfYear = new Date(date.getFullYear(), 11, 31); // Ngày 31 tháng 12 của năm nay

            fromDate = startOfYear;
            toDate = endOfYear;
            break;
        }
        default:
            throw new Error('Invalid type');
    }

    return {
        from: formatDate(fromDate),
        to: formatDate(toDate),
    };
}

function anPhanTram(bet, so_nhan, ti_le, type = false) {
    // so_nhan: số nhân
    // ti_le: tỉ lệ thuế
    // type: Thuế tổng, thuế gốc
    var vV = bet * so_nhan;
    var vT = !!type ? v1 : bet;
    return vV - Math.ceil(vT * ti_le / 100);
}

function addZero10(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function copyToClipboard(content) {
    if (cc.sys.isNative) {
        if (jsb) {
            jsb.copyTextToClipboard(content);
            return true;
        } else {
            return false;
        }
    } else {
        var input = document.createElement('input');
        input.value = content;
        input.id = 'inputID';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        return true;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function serializeObject(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

// Hàm tải ảnh từ URL và gắn vào sprite
function LoadImgFromUrl(target, url, pos = null, callback = null, ext = 'png') {
    if (!url) return;
    var Self = target;
    // Tải ảnh từ URL
    cc.assetManager.loadRemote(url, { ext: `.${ext}` }, function (err, texture) {
        if (err) {
            console.error('Error loading image from URL:', err);
            // Nếu có callback, gọi nó và truyền thông báo lỗi
            if (callback) callback(err, null);
            return;
        }
        // Tạo spriteFrame từ texture
        const spriteFrame = new cc.SpriteFrame(texture);
        // Cập nhật spriteFrame cho sprite đã khai báo trong properties
        Self.spriteFrame = spriteFrame;
        // Tùy chọn: Cập nhật vị trí hoặc các thuộc tính khác của sprite nếu cần
        if (pos) Self.node.setPosition(pos); // Đặt vị trí sprite (tuỳ ý)
        // Nếu có callback, gọi nó và truyền spriteFrame vào callback
        if (callback) callback(null, spriteFrame);
    });
}


// function LoadImgFromBase64(target, base64Data, pos = null) {
//     if (!base64Data) return;
//     var Self = target;
//     // Tạo đối tượng Image từ base64
//     var img = new Image();
//     img.src = base64Data;

//     img.onload = function () {
//         // Tạo texture từ base64
//         var texture2d = new cc.Texture2D();
//         texture2d.initWithElement(img);
//         texture2d.handleLoadedTexture();
//         // Cập nhật texture cho sprite đã khai báo trong properties
//         Self.spriteFrame = new cc.SpriteFrame(texture2d);
//         // Tùy chọn: Cập nhật vị trí hoặc các thuộc tính khác của sprite nếu cần
//         if (pos) Self.node.setPosition(pos); // Đặt vị trí sprite (tuỳ ý)
//     };
//     img.onerror = function (err) {
//         console.error("Error loading base64 image:", err);
//     };
// }

function LoadImgFromBase64(target, base64Data, pos = null) {
    if (!base64Data) return;

    // Lấy raw base64 (nếu có "data:image/..." thì cắt bỏ)
    const rawBase64 = base64Data.split(",")[1] || base64Data;

    // Detect định dạng ảnh
    const detectExt = (b64) => {
        if (b64.startsWith("iVBOR")) return "png";   // PNG
        if (b64.startsWith("/9j/")) return "jpg";    // JPG
        if (b64.startsWith("R0lGOD")) return "png";  // GIF
        return "png"; // fallback
    };
    const ext = detectExt(rawBase64);

    // WEB (browser)
    if (!cc.sys.isNative) {
        let img = new Image();
        img.src = `data:image/${ext};base64,${rawBase64}`;
        img.onload = () => {
            const tex = new cc.Texture2D();
            tex.initWithElement(img);
            tex.handleLoadedTexture();
            target.spriteFrame = new cc.SpriteFrame(tex);
            if (pos) target.node.setPosition(pos);
        };
        img.onerror = (err) => console.error("Error load base64 (web):", err);
        return;
    }

    // NATIVE (Simulator, Android, iOS)
    try {
        // Convert Base64 -> Uint8Array
        const binary = atob(rawBase64);
        const len = binary.length;
        const array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            array[i] = binary.charCodeAt(i);
        }

        // Viết ra file tạm
        const filePath = jsb.fileUtils.getWritablePath() + `temp_img.${ext}`;
        if (jsb.fileUtils.isFileExist(filePath)) {
            jsb.fileUtils.removeFile(filePath); // xóa file cũ nếu có
        }
        jsb.fileUtils.writeDataToFile(array, filePath);

        console.log("FilePath saved:", filePath, "Size:", array.length);
        console.log("File exist:", jsb.fileUtils.isFileExist(filePath));

        // Load texture từ file
        cc.assetManager.loadRemote(filePath, (err, tex) => {
            if (err) {
                console.error("Error load base64 (native):", err);
                return;
            }
            console.log("Texture loaded:", tex);
            target.spriteFrame = new cc.SpriteFrame(tex);
            if (pos) target.node.setPosition(pos);
        });
    } catch (e) {
        console.error("Exception Base64->Native:", e);
    }
}


function createTypingString(text = "", delay = 100, node = null) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                node.string += text[i];
                if (i == text.length - 1) resolve(true);
            }, delay * i);
        }
    });
}

function removeTypingString(text = "", delay = 100, node = null) {
    // return new Promise((resolve, reject) => {
    //     for (let i = 0; i < text.length + 1; i++) {
    //         setTimeout(() => {
    //             node.string = text.slice(0, -Math.abs(i));
    //             if (node.string.length == 0) resolve(true);
    //         }, delay * i);
    //     }
    // });
}

function cutText(text, maxLength = 20) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'; // Cắt chuỗi và thêm "..."
    }
    return text; // Trả về chuỗi ban đầu nếu không cần cắt
}

function stringToBoolean(stringValue) {
    switch (stringValue?.toLowerCase()?.trim()) {
        case "true":
        case "yes":
        case "1":
            return true;

        case "false":
        case "no":
        case "0":
        case null:
        case undefined:
            return false;
        default:
            return null;
    }
}

function sliceLastArrayByLimit(array, limit) {
    if (array.length <= limit) {
        return array;
    }
    const startIndex = array.length - limit;
    return array.slice(startIndex);
}

/**
 * Lấy IP thiết bị/router với nhiều phương pháp
 * @param {Function} callback - Callback function nhận IP address
 * @param {Object} options - Tùy chọn
 * @param {number} options.timeout - Timeout cho mỗi phương pháp (ms)
 * @param {boolean} options.useWebRTC - Có sử dụng WebRTC hay không
 * @param {boolean} options.useAPI - Có sử dụng API fallback hay không
 */
function getClientIp(callback = null, options = {}) {
    const defaultOptions = {
        timeout: 5000,
        useWebRTC: true,
        useAPI: true
    };
    const opts = Object.assign(defaultOptions, options);
    
    // Nếu đã có IP trong cache và callback không được cung cấp
    if (cc.CORE && cc.CORE.IP_ADDRESS && !callback) {
        return cc.CORE.IP_ADDRESS;
    }
    
    const methods = [];
    
    // 1. Phương pháp JSB (Native) - Lấy IP local
    if (cc.sys && cc.sys.isNative) {
        methods.push(() => getIPFromJSB());
    }
    
    // 2. Phương pháp WebRTC (Browser) - Lấy IP local
    if (opts.useWebRTC && cc.sys && cc.sys.isBrowser) {
        methods.push(() => getIPFromWebRTC());
    }
    
    // 3. Phương pháp API - Lấy IP public
    if (opts.useAPI) {
        methods.push(() => getIPFromAPI());
    }
    
    // Thực hiện các phương pháp tuần tự
    executeMethodsSequentially(methods, opts.timeout, callback);
}

/**
 * Lấy IP từ JSB (Native platform)
 */
function getIPFromJSB() {
    return new Promise((resolve, reject) => {
        try {
            // Thử các phương pháp JSB khác nhau
            if (typeof jsb !== 'undefined') {
                // Phương pháp 1: Sử dụng jsb.reflection
                if (jsb.reflection) {
                    try {
                        // Android
                        if (cc.sys.os === cc.sys.OS_ANDROID) {
                            const NetworkInterface = jsb.reflection.callStaticMethod(
                                "java/net/NetworkInterface", 
                                "getNetworkInterfaces", 
                                "()Ljava/util/Enumeration;"
                            );
                            // Xử lý kết quả NetworkInterface...
                        }
                        // iOS
                        else if (cc.sys.os === cc.sys.OS_IOS) {
                            // Sử dụng Objective-C để lấy IP
                            const result = jsb.reflection.callStaticMethod(
                                "NetworkHelper", 
                                "getLocalIPAddress", 
                                "()Ljava/lang/String;"
                            );
                            if (result && result !== "0.0.0.0") {
                                resolve(result);
                                return;
                            }
                        }
                    } catch (e) {
                        console.log("JSB reflection method failed:", e);
                    }
                }
                
                // Phương pháp 2: Sử dụng jsb.fileUtils
                if (jsb.fileUtils) {
                    try {
                        // Đọc file network config (nếu có)
                        const networkInfo = jsb.fileUtils.getStringFromFile("network_info.txt");
                        if (networkInfo) {
                            const ipMatch = networkInfo.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
                            if (ipMatch) {
                                resolve(ipMatch[1]);
                                return;
                            }
                        }
                    } catch (e) {
                        console.log("JSB fileUtils method failed:", e);
                    }
                }
            }
            
            // Phương pháp 3: Sử dụng cc.sys (fallback)
            if (cc.sys && cc.sys.getNetworkType) {
                try {
                    const networkType = cc.sys.getNetworkType();
                    // Một số platform có thể trả về IP trong network info
                    if (networkType && typeof networkType === 'object' && networkType.ip) {
                        resolve(networkType.ip);
                        return;
                    }
                } catch (e) {
                    console.log("cc.sys.getNetworkType failed:", e);
                }
            }
            
            reject(new Error("JSB methods failed"));
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Lấy IP từ WebRTC (Browser)
 */
function getIPFromWebRTC() {
    return new Promise((resolve, reject) => {
        try {
            if (typeof RTCPeerConnection === 'undefined') {
                reject(new Error("WebRTC not supported"));
                return;
            }
            
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            
            pc.createDataChannel('');
            
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = event.candidate.candidate;
                    const ipMatch = candidate.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
                    if (ipMatch && !isPrivateIP(ipMatch[1])) {
                        pc.close();
                        resolve(ipMatch[1]);
                        return;
                    }
                }
            };
            
            pc.createOffer().then(offer => {
                return pc.setLocalDescription(offer);
            }).catch(reject);
            
            // Timeout fallback
            setTimeout(() => {
                pc.close();
                reject(new Error("WebRTC timeout"));
            }, 3000);
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Lấy IP từ API (Public IP)
 */
function getIPFromAPI() {
    return new Promise((resolve, reject) => {
        // Danh sách các API backup
        const apis = [
            'https://api.ipify.org?format=json',
            'https://ipapi.co/json/',
            'https://api.ip.sb/geoip',
            'https://ipinfo.io/json',
            'https://api.myip.com'
        ];
        
        let currentApiIndex = 0;
        
        const tryNextAPI = () => {
            if (currentApiIndex >= apis.length) {
                reject(new Error("All APIs failed"));
                return;
            }
            
            const apiUrl = apis[currentApiIndex];
            currentApiIndex++;
            
            HttpRequest.Get(apiUrl, {}, { timeout: 3000 })
                .then(result => {
                    let ip = null;
                    
                    // Parse response based on API format
                    if (result.ip) {
                        ip = result.ip;
                    } else if (result.query) {
                        ip = result.query;
                    } else if (result.ipAddress) {
                        ip = result.ipAddress;
                    } else if (typeof result === 'string') {
                        const ipMatch = result.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
                        if (ipMatch) {
                            ip = ipMatch[1];
                        }
                    }
                    
                    if (ip && isValidIP(ip)) {
                        resolve(ip);
                    } else {
                        tryNextAPI();
                    }
                })
                .catch(() => {
                    tryNextAPI();
                });
        };
        
        tryNextAPI();
    });
}

/**
 * Kiểm tra IP có phải private IP không
 */
function isPrivateIP(ip) {
    const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^127\./,
        /^169\.254\./
    ];
    
    return privateRanges.some(range => range.test(ip));
}

/**
 * Kiểm tra IP có hợp lệ không
 */
function isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

/**
 * Thực hiện các phương pháp tuần tự
 */
function executeMethodsSequentially(methods, timeout, callback) {
    let currentMethodIndex = 0;
    
    const tryNextMethod = () => {
        if (currentMethodIndex >= methods.length) {
            // Tất cả phương pháp đều thất bại
            if (callback) {
                callback(null, new Error("All methods failed"));
            }
            return;
        }
        
        const method = methods[currentMethodIndex];
        currentMethodIndex++;
        
        const timeoutId = setTimeout(() => {
            tryNextMethod();
        }, timeout);
        
        method()
            .then(ip => {
                clearTimeout(timeoutId);
                
                // Lưu vào cache
                if (cc.CORE) {
                    cc.CORE.IP_ADDRESS = ip;
                }
                
                if (callback) {
                    callback(ip, null);
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.log(`Method ${currentMethodIndex} failed:`, error.message);
                tryNextMethod();
            });
    };
    
    tryNextMethod();
}

/**
 * Ví dụ sử dụng hàm getClientIp
 * 
 * // Sử dụng cơ bản với callback
 * getClientIp((ip, error) => {
 *     if (error) {
 *         console.log("Không thể lấy IP:", error.message);
 *     } else {
 *         console.log("IP address:", ip);
 *     }
 * });
 * 
 * // Sử dụng với tùy chọn
 * getClientIp((ip, error) => {
 *     if (ip) {
 *         console.log("IP:", ip);
 *     }
 * }, {
 *     timeout: 3000,
 *     useWebRTC: true,
 *     useAPI: true
 * });
 * 
 * // Chỉ sử dụng API (không WebRTC)
 * getClientIp((ip, error) => {
 *     console.log("Public IP:", ip);
 * }, {
 *     useWebRTC: false,
 *     useAPI: true
 * });
 */

function togglePopup(node, isShow, options = {}) {
    if (!node || !cc.isValid(node)) return;

    const {
        time = 0.3,
        scaleFrom = 0.6,
        scaleTo = 1,
        opacityFrom = 0,
        opacityTo = 255,
        easingIn = 'backOut',
        easingOut = 'quartInOut',
        callback = null
    } = options;

    let soundEffect = null;
    // if (cc.CORE.GAME_SCENCE?.Audio?.popup_effect) soundEffect = cc.CORE.GAME_SCENCE.Audio.popup_effect;

    if (isShow) {
        node.active = true;
        node.opacity = opacityFrom;
        node.scale = scaleFrom;

        if (soundEffect) cc.CORE.AUDIO.playSound(soundEffect);

        cc.tween(node)
            .to(time, {
                scale: scaleTo,
                opacity: opacityTo
            }, { easing: easingIn })
            .call(() => {
                if (typeof callback === 'function') callback();
            })
            .start();
    } else {
        if (!node.active) return;

        cc.tween(node)
            .to(time, {
                scale: scaleFrom,
                opacity: opacityFrom
            }, { easing: easingOut })
            .call(() => {
                node.active = false;
                if (soundEffect) cc.CORE.AUDIO.playSound(soundEffect);
                if (typeof callback === 'function') callback();
            })
            .start();
    }
}



const setNodeZOrder = {
    // đặt node lên trên cùng
    setToFront(node) {
        if (!node || !node.parent) return;
        let parent = node.parent;
        node.setSiblingIndex(parent.children.length - 1);
    },
    // đặt node xuống dưới cùng
    setToBack(node) {
        if (!node || !node.parent) return;
        node.setSiblingIndex(0);
    }
};

/**
 * Kiểm tra an toàn cc.CORE.PAYMENT trước khi sử dụng
 * @param {Function} callback - Callback function khi PAYMENT sẵn sàng
 * @param {number} timeout - Timeout (ms), mặc định 5000
 * @returns {boolean} true nếu PAYMENT sẵn sàng, false nếu không
 */
function ensurePaymentReady(callback = null, timeout = 5000) {
    // Kiểm tra ngay lập tức
    if (cc.CORE && cc.CORE.PAYMENT) {
        if (callback) callback();
        return true;
    }
    
    // Nếu chưa sẵn sàng, đợi một chút
    let attempts = 0;
    const maxAttempts = timeout / 100; // Thử mỗi 100ms
    
    const checkInterval = setInterval(() => {
        attempts++;
        
        if (cc.CORE && cc.CORE.PAYMENT) {
            clearInterval(checkInterval);
            if (callback) callback();
            return;
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error("cc.CORE.PAYMENT is not ready after timeout");
            if (callback) callback(null, new Error("PAYMENT not ready"));
        }
    }, 100);
    
    return false;
}

/**
 * An toàn set USER_BANK_ACCOUNT với kiểm tra
 * @param {Object} data - Dữ liệu bank account
 * @returns {boolean} true nếu thành công, false nếu thất bại
 */
function safeSetUserBankAccount(data) {
    if (!cc.CORE || !cc.CORE.PAYMENT) {
        console.error("cc.CORE.PAYMENT is not initialized");
        return false;
    }
    
    try {
        cc.CORE.PAYMENT.USER_BANK_ACCOUNT = data;
        return true;
    } catch (error) {
        console.error("Error setting USER_BANK_ACCOUNT:", error);
        return false;
    }
}

/**
 * An toàn get USER_BANK_ACCOUNT với kiểm tra
 * @returns {Object|null} USER_BANK_ACCOUNT data hoặc null
 */
function safeGetUserBankAccount() {
    if (!cc.CORE || !cc.CORE.PAYMENT || !cc.CORE.PAYMENT.USER_BANK_ACCOUNT) {
        return null;
    }
    
    return cc.CORE.PAYMENT.USER_BANK_ACCOUNT;
}



module.exports = {
    BrowserUtil,
    setFrameRate,
    isDynamicDevice,
    forceEnableAudio,
    isMobile,
    initSpriteBase64,
    signHash,
    getQueryValue,
    checkPhoneValid,
    nFormatter,
    abbreviateNumber,
    abbreviateNumber_2,
    numberWithCommas,
    numberWithCommasReal,
    isEmpty,
    isNumber,
    getOnlyNumberInString,
    nonAccentVietnamese,
    getStringDateByTimeNoYear,
    getDayOfWeek,
    getDateByTime,
    divideEqually,
    numberPad,
    inputNumber,
    getDateRange,
    anPhanTram,
    numberTo,
    numberToReal,
    getStringDateByTime,
    getStringHourByTime,
    numberToTime,
    validateEmail,
    addZero10,
    copyToClipboard,
    getRandomInt,
    jsUcfirst,
    serializeObject,
    LoadImgFromUrl,
    LoadImgFromBase64,
    cutText,
    createTypingString,
    removeTypingString,
    stringToBoolean,
    sliceLastArrayByLimit,
    getClientIp,
    maskPhoneNumber,
    togglePopup,
    setNodeZOrder,
    ensurePaymentReady,
    safeSetUserBankAccount,
    safeGetUserBankAccount
}