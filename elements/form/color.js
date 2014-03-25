ig.module(
        'plugins.gui.elements.form.color'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.elements.image',
        'plugins.gui.elements.form.form'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};
        ig.gui.elements = ig.gui.elements || {};
        ig.gui.elements.form = ig.gui.elements.form || {};


        ig.gui.elements.form.Color = ig.gui.elements.form.Form.extend({
            type: 'field_color',
            init: function (options) {
                this.parent(options);

                this.colorPicker = new ig.gui.elements.Image({
                    src: 'media/color-picker.png',
                    style: {
                        'z-index': 1000000,
                        'left': 'center',
                        'top': 'center'
                    }
                });


                ig.gui.canvas.add(this.colorPicker);


            }
        });

    });