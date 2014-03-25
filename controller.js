ig.module(
        'plugins.gui.controller'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.Controller = ig.Class.extend({
            init: function (options) {
                ig.merge(this, options);
                ig.merge(this, ig.gui.Events);
            }
        });

    });