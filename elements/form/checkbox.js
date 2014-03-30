ig.module(
        'plugins.gui.elements.form.checkbox'
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


        ig.gui.elements.form.Checkbox = ig.gui.elements.form.Form.extend({
            type: 'field_checkbox',
            checked: false,
            value: null,
            styleDefault: {
                'border': '1px solid #F47920',
                'border-color': '#F47920', // todo temp
                background: [
                    {
                        style: {
                            color: 'black'
                        }
                    },
                    {
                        style: {
                            color: 'transparent',
                            padding: 1
                        }
                    }
                ],
                width: 20,
                height: 20
            },
            init: function (options) {
                this.setEvents();
                this.parent(options);
            },
            draw: function () {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.rect(this.styleParsed.left, this.styleParsed.top, this.styleParsed.width, this.styleParsed.height);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = this.styleParsed['border-color'];
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.clip();
                ig.gui.drawBackgrounds.call(this);

                this.ctx.restore();
                this.parent();
            },
            setEvents: function () {
                this.bind('pressed:MOUSE1', {}, function (properties) {
                    this.style.background = this.style.background || this.styles.background;

                    if (!this.checked) {
                        this.checked = true;
                        this.style.background[1] = {
                            style: {
                                color: 'white',
                                'padding-left': 2,
                                'padding-right': 2,
                                'padding-bottom': 2,
                                'padding-top': 2
                            }
                        };
                    } else {
                        this.checked = false;
                        this.style.background[1] = {
                            style: {
                                color: 'transparent',
                                padding: 1
                            }
                        };
                    }

                });

            }
        });

    });