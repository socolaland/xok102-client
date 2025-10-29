// thư viện howler để phát âm thanh từ url hay path - development
const { Howl, Howler } = require('howler');

module.exports = {
    /*** Check licensed audio context */
    licensedAudio: false,
    checkLicensedAudio() {
        if (cc.sys.isBrowser) {
            cc.game.canvas.addEventListener('touchend', () => {
                module.exports.licensedAudio = true;
            });

            cc.game.canvas.addEventListener('mousedown', () => {
                module.exports.licensedAudio = true;
            });
        } else {
            module.exports.licensedAudio = true;
        }
    },

    /*** Coccos Audio Engine */
    playSound(source, forcePlay = false) {
        module.exports.checkLicensedAudio();
        // cc.log("licensedAudio: " + module.exports.licensedAudio);

        if (!module.exports.licensedAudio) return module.exports.stopSound(source);

        if (forcePlay && module.exports.licensedAudio) {
            source.play();
        } else {
            if (cc.CORE.SETTING.SOUND && module.exports.licensedAudio) source.play();
        }
    },
    stopSound(source) {
        source.stop();
    },
    playMusic(source, forcePlay = false) {
        module.exports.checkLicensedAudio();
        // cc.log("licensedAudio: " + module.exports.licensedAudio);
        // if (!module.exports.licensedAudio) return module.exports.stopMusic(source);

        if (forcePlay) {
            source.play();
        } else {
            if (cc.CORE.SETTING.MUSIC) source.play();
        }
    },
    stopMusic(source) {
        source.stop();
    },
    playSoundEffect(source, forcePlay = false) {
        module.exports.checkLicensedAudio();
        // cc.log("licensedAudio: " + module.exports.licensedAudio);

        if (!module.exports.licensedAudio) return module.exports.stopSoundEffect(source);

        if (forcePlay) {
            source.play();
        } else {
            if (cc.CORE.SETTING.SOUND) source.play();
        }
    },
    stopSoundEffect(source) {
        source.stop();
    },

    // global storage audio howler
    HOWLER: {
        // save all sound to storage to reused
        STORAGE: {},
        createSound(id, url, loop = false, volume = 1.0) {
            if (module.exports.HOWLER.STORAGE[id]) {
                module.exports.HOWLER.storage[id].unload(); // Giải phóng nếu đã tồn tại
            }
            const sound = module.exports.HOWLER.STORAGE[id] = new Howl({
                src: [url],
                volume: volume,
                loop: loop,
                html5: true // Đảm bảo hoạt động ổn trong trình duyệt (đặc biệt với file lớn)
            });
            return sound;
        },
        playSound(id, forcePlay = false) {
            module.exports.checkLicensedAudio();
            if (!module.exports.licensedAudio || !module.exports.HOWLER.STORAGE[id]) return;

            if (forcePlay) {
                module.exports.HOWLER.STORAGE[id].stop();
                module.exports.HOWLER.STORAGE[id].play();
            } else {
                if (cc.CORE.SETTING.SOUND) {
                    module.exports.HOWLER.STORAGE[id].play();
                }
            }
        },
        stopSound(id) {
            if (module.exports.HOWLER.STORAGE[id]) {
                module.exports.HOWLER.STORAGE[id].stop();
            }
        },
        unloadSound(id) {
            if (module.exports.HOWLER.STORAGE[id]) {
                module.exports.HOWLER.STORAGE[id].unload();
                delete module.exports.HOWLER.STORAGE[id];
            }
        },
        getSound(id) {
            return module.exports.HOWLER.STORAGE[id];
        }
    },
}
