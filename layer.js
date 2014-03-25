ig.module(
        'plugins.gui.layer'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.Layer = ig.gui.Core.extend({
            type: 'layer',
            styleDefault: {
                display: 'block',
                height: 'auto'
            },
            draw: function () {
                this.ctx.save();
                this.ctx.clip();
                // todo should be refactoring in order to clip background on layer shape
                //ig.gui.drawBackgrounds.call(this);
                this.ctx.restore();
                this.parent();
            }
        });
    });