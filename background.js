ig.module(
        'plugins.gui.background'
    )
    .requires(
        'plugins.gui.elements.image'
    )
    .defines(function () {
        'use strict';

        ig.gui.Background = ig.gui.elements.Image.extend({
            type: 'background',
            init: function (options) {
                ig.merge(this.styleDefault, {
                    display: 'block'
                });
                this.parent(options);
            }
        });
    });