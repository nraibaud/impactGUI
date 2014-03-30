// todo ig.core should extend ig.Game in order to add the game instance in a stage
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
            styleDefault: {
                display: 'block'
            },
            render: function () {
                this.show().redraw();
                ig.system.setGame(this.stage.extend(this.stageOptions));
            }
        });
    });