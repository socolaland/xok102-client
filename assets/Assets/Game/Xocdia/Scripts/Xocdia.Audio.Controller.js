cc.Class({
    extends: cc.Component,

    properties: {
        bgMusic: {
            default: null,
            type: cc.AudioSource,
        },
        click: {
            default: null,
            type: cc.AudioSource,
        },
        chip_bet: {
            default: null,
            type: cc.AudioSource,
        },
        win_bet: {
            default: null,
            type: cc.AudioSource,
        },
        refurn_bet: {
            default: null,
            type: cc.AudioSource,
        },
        customer_tip: {
            default: null,
            type: cc.AudioSource,
        },
        owner_leave: {
            default: null,
            type: cc.AudioSource,
        },

        // sound dealer
        welcome: {
            default: null,
            type: cc.AudioSource,
        },
        start_normal_bet: {
            default: null,
            type: cc.AudioSource,
        },
        start_big_bet: {
            default: null,
            type: cc.AudioSource,
        },
        stop_bet: {
            default: null,
            type: cc.AudioSource,
        },
        res_white3: {
            default: null,
            type: cc.AudioSource,
        },
        res_red3: {
            default: null,
            type: cc.AudioSource,
        },
        res_red4: {
            default: null,
            type: cc.AudioSource,
        },
        res_white4: {
            default: null,
            type: cc.AudioSource,
        },
        res_double: {
            default: null,
            type: cc.AudioSource,
        }
    },
    start() {
    },
    // update (dt) {},
});