ig.module(
        'plugins.gui.elements.form.textarea'
    )
    .requires(
        'plugins.gui.elements.form.form',
        'plugins.gui.elements.text',
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};
        ig.gui.elements = ig.gui.elements || {};
        ig.gui.elements.form = ig.gui.elements.form || {};

        // todo add Layer


        ig.gui.elements.form.Textarea = ig.gui.elements.form.Form.extend({
            type: 'field_textarea',
            placeholder:'',
            init: function (options) {

                var that;

                that = this;
                

                var Text;

                Text = ig.gui.elements.Text.extend({
                    draw: function (draw) {

                        this.ctx.save();

                        this.ctx.translate(that.styleParsed.left, that.styleParsed.top);


                        this.ctx.beginPath();
                        this.ctx.rect(this.styleParsed.left, this.styleParsed.top, this.styleParsed.width, this.styleParsed.height);
                        this.ctx.closePath();

                        this.ctx.clip();
                        this.parent(draw);
                        this.ctx.restore();

                    }
                });


                this.text = new Text({
                    style: {
                        color: options.style.color,
                        width: 'inherit',
                        height: 'inherit'
                    },
                    content: options.content || ''
                });

                this.add(this.text);


                this.bind('pressed:MOUSE1', {
                        stopPropagation: true
                    },
                    function () {
                        that.focus = true;
                        var result = ig.gui.elements.form.keyboard.open('label', that.text.content);

                        if (result) {
                            that.text.content = result;
                        }
                    });


                this.parent(options);
            },
            draw: function () {
                ig.gui.drawBackgrounds.call(this);
                this.parent();
            }
        });

    });