const LocalStorage = require('LocalStorage');

const ResData = (
    type = true, // scence = true, prefab = false
    name = 'Lobby', // tên scence hoặc prefab
    bundle = null, // bundle name
    path = null, // path của prefab, scence thì null
    script = null // path của script controller, scence thì null
) => {
    return {
        resource_type: type,
        resource_name: name,
        resource_bundle: bundle,
        resource_path: path,
        resource_script: script
    };
};

module.exports = {
    // check storage để lấy các case mở game
    initState: () => {
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function(event) {
            setTimeout(() => cc.CORE.UTIL.setFrameRate(120), 100);
        });
        cc.view.enableAutoFullScreen(false);
        
        cc.CORE.RESOURCE = {
            LOBBY: ResData(true, 'Lobby', 'Lobby_Bundle'),
            SICBO: ResData(true, 'Sicbo', ['Sicbo_Bundle', 'Xocdia_Bundle']), // tạm thời dùng bundle Xocdia để load prefab
            XOCDIA: ResData(true, 'Xocdia', ['Xocdia_Bundle']),
        };
    },
    GetGameOpen: (gameName = null) => {
        let GameOpen = (gameName !== null) ? gameName : LocalStorage.getItem('GAME_OPEN');
        if (!GameOpen) return ResData(true, 'Lobby', 'Lobby_Bundle');
        GameOpen = GameOpen.toUpperCase(); // sửa lại thành in hoa để phù hợp với object key bên trên
        if (!cc.CORE.RESOURCE.hasOwnProperty(GameOpen)) return ResData(true, 'Lobby', 'Lobby_Bundle');
        return cc.CORE.RESOURCE[GameOpen];
    }
}