ig.module(
        'plugins.gui.shape'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.Shape = ig.gui.Core.extend({
            type: 'shape'
        });

    });