ig.module(
        'plugins.gui.canvas'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.Canvas = ig.gui.Core.extend({
            type: 'canvas',
            name:'canvas',
            elm: '#canvas',
            tagName: 'CANVAS',
            level: 0,
            canvas: null,
            scale: 1,
            context: null,
            children: [],
            parentElement: null,
            events: [],
            objects: [],
            styleDefault: {
                width: '100%',
                height: '100%',
                display: 'block',
                left: 0,
                top: 0
            },
            init: function (options) {

                this.style.width = ig.system.width;
                this.style.height = ig.system.height;

                //todo transparent canvas
                //ig.game.clearColor = null;

                options = options || {};

                ig.merge(this, options);

                this.canvas = ig.system.canvas;
                this.context = ig.system.context;

                // todo removeActions
                // todo removeAction

                //todo temp MAKE A BUG WHEN USING FIREBUG or other shorcuts
                /*
                 this.addActions([
                 {
                 key: ig.KEY.MOUSE1,
                 action: 'MOUSE1'
                 },
                 {
                 key: ig.KEY.MOUSE2,
                 action: 'MOUSE2'
                 }
                 ]);
                 */
                this._addActions();

                this.parent(options);

            },
            _addActions: function () {
                var that;

                that = this;

                _.each(_.keys(ig.KEY), function (element, index, list) {
                    that.addAction({
                        key: ig.KEY[element],
                        action: element
                    })
                });
            }
        });


    });
