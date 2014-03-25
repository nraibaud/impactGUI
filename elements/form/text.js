ig.module(
        'plugins.gui.elements.form.text'
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



        ig.gui.elements.form.Text = ig.gui.elements.form.Form.extend({
            type: 'field_text',
            hasFocus:false,
            placeholder: '',
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
                        that.focus();

                    });


                this.parent(options);
            },
            draw: function () {
                this.ctx.beginPath();
                this.ctx.rect(this.styleParsed.left, this.styleParsed.top, this.styleParsed.width, this.styleParsed.height);

                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#F47920';
                this.ctx.stroke();

                ig.gui.drawBackgrounds.call(this);
                this.parent();
            },
            focus: function () {
                var that;

                that = this;

                that.hasFocus = true;

                var result = ig.gui.elements.form.keyboard.open('label', that.text.content);

                if (result) {
                    that.text.content = result;
                }

            }
        });

    });