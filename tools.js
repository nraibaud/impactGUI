ig.module(
        'plugins.gui.tools'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.tools = {
            openUrl: function (url) {
                if (ig.global.open) {
                    ig.global.open(url);
                } else if (CocoonJS && CocoonJS.App) {
                    CocoonJS.App.openURL(url);
                }
            }
        };


    });