ig.module(
        'plugins.gui.widgets.draganddrop'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.widgets = ig.gui.widgets || {};

        ig.gui.widgets.dragAndDrop = ig.Class.extend({
            type: 'widget_dragAndrop',
            pos: {
                x: 0,
                y: 0
            },
            init: function (options) {

                var that, move;

                that = this, move = function () {
                    if (that.element.isDragging) {
                        that.element.style.left = that.left + (ig.input.mouse.x - that.pos.x) + ig.system.tick;
                        that.element.style.top = that.top + (ig.input.mouse.y - that.pos.y) + ig.system.tick;
                    }
                };

                this.element = options.element;


                //todo stopZindex
                //todo changer la height si pas doverflow car pose pb pr le drag   --- ???
                //todo mouseneter mouseleave pour annuler le drag
                //todo faire le off


                that.element.dropped = false;
                that.element.isDragging = false;


                this.element.bind('pressed:MOUSE1', {
                    stopPropagation: true
                }, function () {
                    that.element.isDragging = true;
                    that.element.dropped = false;
                    that.left = that.element.styleParsed.left;
                    that.top = that.element.styleParsed.top;
                    that.pos.x = ig.input.mouse.x;
                    that.pos.y = ig.input.mouse.y;
                });


                this.element.bind('state:MOUSE1', {
                    stopPropagation: true
                }, function () {
                    move();
                });

                ig.gui.canvas.bind('state:MOUSE1', {
                    stopPropagation: true
                }, function () {
                    move();
                });


                this.element.bind('released:MOUSE1', {
                    stopPropagation: true
                }, function () {
                    that.element.isDragging = false;
                    that.element.dropped = true;
                });


            }
        });

        ig.Input.inject({
            drag: function (action, shape, callback, properties) {

                if (!shape.widgets.dragAndDrop) {
                    shape.widgets.dragAndDrop = new ig.gui.widgets.dragAndDrop({element: shape});
                }

                if (properties.element && shape._isOnShapeArea(properties.element) && shape.isDragging) { // isOnElementArea
                    callback.call(shape, properties);
                } else if (!properties.element && shape.isDragging) {
                    callback.call(shape, properties);
                }
            },
            drop: function (action, shape, callback, properties) {

                if (!shape.widgets.dragAndDrop) {
                    shape.widgets.dragAndDrop = new ig.gui.widgets.dragAndDrop({element: shape});
                }

                if (properties.element && shape._isOnShapeArea(properties.element) && shape.dropped) { // isOnElementArea
                    callback.call(shape, properties);
                } else if (!properties.element && shape.dropped) {
                    callback.call(shape, properties);
                }
            }
        });

    });