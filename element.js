ig.module(
        'plugins.gui.element'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui.elements = ig.gui.elements || {};

        ig.gui.Element = ig.gui.Core.extend({
            type: 'element'
        });


    });