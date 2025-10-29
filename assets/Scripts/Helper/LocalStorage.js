const getItem = function (key) {
    // return localStorage[key];
    return cc.sys.localStorage.getItem(key);
}
const setItem = function (key, value) {
    // return localStorage.setItem(key, value);
    return cc.sys.localStorage.setItem(key, value);
}
const removeItem = function (key) {
    // return localStorage.removeItem(key);
    return cc.sys.localStorage.removeItem(key);
}

module.exports = {
    initState: () => {
        (getItem('MUSIC')) ? cc.CORE.SETTING.MUSIC = cc.CORE.UTIL.stringToBoolean(getItem('MUSIC')): setItem('MUSIC', 'true');
        (getItem('SOUND')) ? cc.CORE.SETTING.SOUND = cc.CORE.UTIL.stringToBoolean(getItem('SOUND')): setItem('SOUND', 'true');
    },
    getItem,
    setItem,
    removeItem,
}