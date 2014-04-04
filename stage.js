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
            game: ig.gui.Game,
            stageOptions: {},
            styleDefault: {
                position: 'absolute',
                display: 'block'
            },
            render: function () {
                this.stageOptions.stage = this;
                ig.system.setGame(this.game.extend(this.stageOptions));
            }
        });
    });