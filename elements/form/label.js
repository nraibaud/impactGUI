ig.module(
        'plugins.gui.elements.form.label'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.elements.form.form',
        'plugins.gui.elements.text'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};
        ig.gui.elements = ig.gui.elements || {};
        ig.gui.elements.form = ig.gui.elements.form || {};


        ig.gui.elements.form.Label = ig.gui.elements.form.Form.extend({
            type: 'field_label',
            for: null, // todo guid
            init: function (options) {

                var that;

                that = this;

                this.parent(options);

                this.for = options.for || this.for;


                // todo should be styleParsed or styles not style
                // todo make a method to get the styles value ou mettre inherit pour prendre celui du label cia styleDefault
                this.text = new ig.gui.elements.Text({
                    style: {
                        color: 'white'
                    },
                    content: options.label || ''
                });

                this.add(this.text);


                this.bind('pressed:MOUSE1', {
                        stopPropagation: true
                    },
                    function () {
                        console.log(  that.for.focus);
                        that.for.focus();
                    });

            },
            update: function () {
                this.style.width = this.text.styleParsed.width || this.style.width;
                this.style.height = this.text.styleParsed.height || this.style.height;
                this.parent();
            }
        });

    });