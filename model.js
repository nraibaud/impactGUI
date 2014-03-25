ig.module(
        'plugins.gui.model'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.ajax',
        'plugins.gui.storage'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.Model = ig.Class.extend({
            init: function (options) {
                ig.merge(this, options);
                ig.merge(ig.gui, ig.gui.Events);
            }
        });

    });