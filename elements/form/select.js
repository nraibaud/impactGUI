ig.module(
        'plugins.gui.elements.form.select'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.layer',
        'plugins.gui.elements.text',
        'plugins.gui.widgets.scrollbar'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};
        ig.gui.elements = ig.gui.elements || {};
        ig.gui.elements.form = ig.gui.elements.form || {};


        ig.gui.elements.form.Select = ig.gui.elements.form.Form.extend({
            type: 'field_select',
            multiple: false,
            select: {

            },
            group: {

            },
            option: {

            },
            data: [],
            init: function (options) {
                this.parent(options);

                this.layer = new ig.gui.Layer();

                this.shape = new ig.gui.Shape({
                    style: {
                        width: 300,
                        height: 300,
                        left: 0,
                        top: 0,
                        color: 'red'
                    },
                    draw: function () {


                        //ig.system.context.globalAlpha = this.styleParsed.opacity;
                        ig.system.context.beginPath();
                        ig.system.context.fillStyle = this.styleParsed.color;
                        ig.system.context.rect(this.styleParsed.left, this.styleParsed.top, this.styleParsed.width, this.styleParsed.height);
                        ig.system.context.fill();
                        ig.system.context.closePath();


                    }
                });

                this.layer.add(this.shape);

                // todo pour ke ladd prenne le layer
                this.element = this.layer;

            },
            drawSelect: function () {
            },
            drawGroup: function () {

            },
            drawOption: function () {

            },
            draw: function () {
                this.parent();

                this.drawSelect();
            }
        });

    });