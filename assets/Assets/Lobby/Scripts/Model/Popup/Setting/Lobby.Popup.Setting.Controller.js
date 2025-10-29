const LocalStorage = require('LocalStorage');

cc.Class({
    extends: cc.Component,

    properties: {
        switch_SpriteFame: {
            default: [],
            type: cc.SpriteFrame
        },
        sound_spriteFrame: cc.Sprite,
        music_spriteFrame: cc.Sprite,
    },
    init(obj) {
        this.CORE = this;
    },
    onLoad() {
    },
    onEnable() {
        (LocalStorage.getItem('MUSIC')) ? cc.CORE.SETTING.MUSIC = cc.CORE.UTIL.stringToBoolean(LocalStorage.getItem('MUSIC')) : LocalStorage.setItem('MUSIC', 'true');
        (LocalStorage.getItem('SOUND')) ? cc.CORE.SETTING.SOUND = cc.CORE.UTIL.stringToBoolean(LocalStorage.getItem('SOUND')) : LocalStorage.setItem('SOUND', 'true');

        this.music_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.MUSIC ? 1 : 0];
        this.sound_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.SOUND ? 1 : 0];
    },
    toggle() {
        cc.CORE.UTIL.togglePopup(this.node, !this.node.active, {
            time: 0.3
        });
    },
    onChangerSound() {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.SETTING.SOUND = !cc.CORE.SETTING.SOUND;
        LocalStorage.setItem('SOUND', cc.CORE.SETTING.SOUND);
        this.sound_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.SOUND ? 1 : 0];
    },
    onChangerMusic() {
        cc.CORE.GAME_SCENCE.PlayClick();
        cc.CORE.SETTING.MUSIC = !cc.CORE.SETTING.MUSIC;
        LocalStorage.setItem('MUSIC', cc.CORE.SETTING.MUSIC);
        this.music_spriteFrame.spriteFrame = this.switch_SpriteFame[cc.CORE.SETTING.MUSIC ? 1 : 0];
        if (void 0 !== cc.CORE.GAME_SCENCE) {
            (cc.CORE.SETTING.MUSIC) ? cc.CORE.AUDIO.playMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic) : cc.CORE.AUDIO.stopMusic(cc.CORE.GAME_SCENCE.Audio.bgMusic);
        }
    },




    
    onClickVeryPhone() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.toggle();
        if (cc.CORE.IS_LOGIN) {
            if (void 0 != cc.CORE.GAME_SCENCE.PopupLobby) {
                cc.CORE.GAME_SCENCE.PopupLobby.show("verify_phone");
            }else {
                cc.CORE.GAME_SCENCE.Popup.show("verify_phone");
            }
        } else {
            cc.CORE.GAME_SCENCE.Popup.show("signin");
        }
    },
    onClickChangePassword() {
        cc.CORE.GAME_SCENCE.PlayClick();
        this.toggle();
        if (cc.CORE.IS_LOGIN) {
            if (void 0 != cc.CORE.GAME_SCENCE.PopupLobby) {
                cc.CORE.GAME_SCENCE.PopupLobby.show("change_password");
            }else {
                cc.CORE.GAME_SCENCE.Popup.show("change_password");
            }
        } else {
            cc.CORE.GAME_SCENCE.Popup.show("signin");
        }
    },
    update(dt) {
    }
});
