ig.module(
        'plugins.gui.widgets.share'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.tools'
    )
    .defines(function () {
        'use strict';

        var API = {
            'FACEBOOK': {
                url: 'https://www.facebook.com/sharer/sharer.php?u='
            },
            'GOOGLE': {
                url: 'https://plus.google.com/share?url='
            },
            'TWITTER': {
                url: 'http://twitter.com/share?url='
            }
        };

        ig.gui = ig.gui || {};

        ig.gui.widgets = ig.gui.widgets || {};

        ig.gui.widgets.Share = ig.Class.extend({
            type: 'widget_share',
            init: function (options) {
                ig.merge(this, options)
            },
            share: function (type) {
                ig.gui.tools.openUrl(API[type].url + this.url);
            }
        });

    });