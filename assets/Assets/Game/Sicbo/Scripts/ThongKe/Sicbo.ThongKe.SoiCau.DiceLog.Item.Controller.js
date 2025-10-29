
cc.Class({
    extends: cc.Component,

    properties: {
        dice_1: {
            default: null,
            type: cc.Label
        },
        dice_2: {
            default: null,
            type: cc.Label
        },
        dice_3: {
            default: null,
            type: cc.Label
        },
        result_dices: {
            default: null,
            type: cc.Node
        }
    },
    // onLoad () {},

    start() {

    },
    init: function (obj) {
        this.CORE = obj;
    },
    setSessionDiceLogs: function (result) {
        result.sort((a, b) => a - b);
        const seft = this;
        const diceSprite = cc.CORE.GAME_SCENCE.diceSprite;
        seft.result_dices.children.map(function (obj, i) {
            obj.getComponent(cc.Sprite).spriteFrame = diceSprite[result[i]];
        });
        seft.dice_1.string = result[0];
        seft.dice_2.string = result[1];
        seft.dice_3.string = result[2];

        seft.dice_1.node.color = result[0] === 1 || result[0] === 4 ? cc.Color.RED : cc.Color.WHITE;
        seft.dice_2.node.color = result[1] === 1 || result[1] === 4 ? cc.Color.RED : cc.Color.WHITE;
        seft.dice_3.node.color = result[2] === 1 || result[2] === 4 ? cc.Color.RED : cc.Color.WHITE;

    },
    // update (dt) {},
});
