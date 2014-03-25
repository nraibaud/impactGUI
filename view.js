ig.module(
        'plugins.gui.view'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.View = ig.gui.Core.extend({
            type: 'view',
            styleDefault: {
                position: 'absolute',
                display: 'block'
            }
        });

    });