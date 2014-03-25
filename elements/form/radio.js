ig.module(
        'plugins.gui.elements.form.radio'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.elements.form.form'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};
        ig.gui.elements = ig.gui.elements || {};
        ig.gui.elements.form = ig.gui.elements.form || {};


        ig.gui.elements.form.Radio = ig.gui.elements.form.Form.extend({
            type: 'field_radio',
            checked: false,
            value: null,
            styleDefault: {
                'border': '1px solid #F47920',
                'border-color': '#F47920', // todo temp
                background: [
                    {
                        style: {
                            color: 'black',
                            width: 20,
                            height: 20
                        }
                    },
                    {
                        style: {
                            color: 'transparent',
                            'padding-left': 2,
                            'padding-right': 2,
                            'padding-bottom': 2,
                            'padding-top': 2,
                            width: 20,
                            height: 20
                        }
                    }
                ],
                width: 10,
                height: 10
            },
            setEvents: function () {
                this.bind('pressed:MOUSE1', {}, function (properties) {
                    this.style.background = this.style.background || this.styles.background;
                    console.log(this.style.background);

                    if (!this.checked) {
                        this.checked = true;
                        this.style.background[1].style.color = 'white';
                    } else {
                        this.checked = false;
                        this.style.background[1].style.color = 'transparent';
                    }

                });

            },
            init: function (options) {

                this.setEvents();
                this.parent(options);
            },
            draw: function () {



                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(this.styleParsed.left + this.styleParsed.width, this.styleParsed.top + this.styleParsed.height, this.styleParsed.width, this.styleParsed.height, 0, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = this.styleParsed['border-color'];
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.restore();

                this.ctx.save();
                this.ctx.beginPath();
                ig.system.context.arc(
                    this.styleParsed.left +
                        this.styleParsed['border-left'] +
                        this.styleParsed['padding-left'],
                    this.styleParsed.top +
                        this.styleParsed['border-top'] +
                        this.styleParsed['padding-top'],
                    this.styleParsed.width -
                        this.styleParsed['border-left'] -
                        this.styleParsed['border-right'] -
                        this.styleParsed['padding-left'] -
                        this.styleParsed['padding-right'],
                    this.styleParsed.height -
                        this.styleParsed['border-bottom'] -
                        this.styleParsed['border-top'] -
                        this.styleParsed['padding-bottom'] -
                        this.styleParsed['padding-top'],
                    0,
                    false
                );
                this.ctx.closePath();
                this.ctx.clip();
                ig.gui.drawBackgrounds.call(this);
                this.ctx.restore();

                this.parent();
            }
        });

    });