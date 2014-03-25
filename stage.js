ig.module(
        'plugins.gui.stage'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.Stage = ig.gui.Core.extend({
            type: 'stage',
            stage: ig.gui.Game,
            render: function () {
                this.show().redraw();
                ig.system.setGame(this.stage.extend((this.stageOptions)));
            }
        });


    });