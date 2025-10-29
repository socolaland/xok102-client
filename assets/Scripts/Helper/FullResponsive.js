
cc.Class({
    extends: cc.Component,
    onLoad: function(){
        try {
            this.node.width  = cc.CORE.GAME_SCENCE.node.width;
            this.node.height = cc.CORE.GAME_SCENCE.node.height;
        }catch(e) {
            cc.log(e)
        }
    },
    onEnable: function(){
        try {
            this.node.width  = cc.CORE.GAME_SCENCE.node.width;
            this.node.height = cc.CORE.GAME_SCENCE.node.height;
            cc.log(this.node.width, this.node.height, cc.CORE.GAME_SCENCE.node.width, cc.CORE.GAME_SCENCE.node.height)
        }catch(e) {
            cc.log(e)
        }
    },
});
