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
            }
        });
    });