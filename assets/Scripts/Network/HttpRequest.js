
/***
 * Description: gửi request tới rest api server
 * GET, POST
 * Author: Vũ Duy Lực
 * Telegram: https://t.me/bruhh_lmao
 * Email: mm13571234@gmail.com
 */


module.exports = {
    Get: (url = "", params = {}, headers = {}) => {
        let queryString = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
        let fullUrl = url + (queryString ? '?' + queryString : '');

        // Nếu là trình duyệt (Web Build)
        if (cc.sys.isBrowser) {
            return new Promise(function (resolve, reject) {
                fetch(fullUrl, {
                    method: "GET",
                    headers,
                    redirect: 'follow'
                }).then(result => {
                    resolve(result.json());
                }).catch(error => {
                    cc.log(error);
                    reject(error);
                });
            });
        }

        // Nếu là Native (App)
        if (!cc.sys.isBrowser) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", fullUrl, true);

                for (let key in headers) xhr.setRequestHeader(key, headers[key]);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        try {
                            // Parse chuỗi JSON thành đối tượng JSON
                            var responseJson = JSON.parse(xhr.responseText);
                            resolve(responseJson); // Trả về đối tượng JSON đã parse
                        } catch (e) {
                            // Nếu có lỗi trong việc parse JSON
                            reject({
                                status: xhr.status,
                                statusText: "Failed to parse JSON"
                            });
                        }
                    } else {
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText
                        });
                    }
                }
                xhr.onerror = function () {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                };
                xhr.send();
            });
        }
    },
    Post: (url = "", params = {}, data = {}, headers = {}) => {
        let queryString = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
        let fullUrl = url + (queryString ? '?' + queryString : '');

        // Nếu là trình duyệt (Web Build)
        if (cc.sys.isBrowser) {
            return new Promise(function (resolve, reject) {
                fetch(fullUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers // Merge custom headers
                    },
                    body: JSON.stringify(data)
                })
                    .then(result => {
                        resolve(result.json());
                    })
                    .catch(error => {
                        cc.log(error);
                        reject(error);
                    });
            });
        }

        // Nếu là Native (App)
        if (!cc.sys.isBrowser) {
            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", fullUrl, true);

                for (let key in headers) xhr.setRequestHeader(key, headers[key]);
                xhr.setRequestHeader("Content-Type", "application/json");


                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        try {
                            // Parse chuỗi JSON thành đối tượng JSON
                            var responseJson = JSON.parse(xhr.responseText);
                            resolve(responseJson); // Trả về đối tượng JSON đã parse
                        } catch (e) {
                            // Nếu có lỗi trong việc parse JSON
                            reject({
                                status: xhr.status,
                                statusText: "Failed to parse JSON"
                            });
                        }
                    } else {
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText
                        });
                    }
                }
                xhr.onerror = function () {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                };
                xhr.send(JSON.stringify(data));
            });
        }
    },
    // orther method
}