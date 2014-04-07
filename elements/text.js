ig.module(
        'plugins.gui.elements.text'
    )
    .requires(
        'plugins.gui.element'
    )
    .defines(function () {
        'use strict';

        // todo text with image
        //todo re-code the auto break line words and reactive overflow (@prev revisions)

        ig.gui.elements.Text = ig.gui.Element.extend({
            type: 'text',
            styleDefault: {
                color: 'black',
                width: 'auto',
                height: 'auto',
                display: 'inline'
            },
            content: '',
            getSize: function (content) {
                return {
                    width: this.ctx.measureText(content).width,
                    height: parseInt(this.styleParsed['font-size'])
                }
            },
            update: function () {
                var size;

                ig.gui.styleSheets.init.call(this);

                this.ctx.font = this.styleParsed['font-size'] + ' Huggable';// Huggable'; //Fontdinerdotcom // todo dynamise
                this.ctx.fillStyle = this.styleParsed.color;

                size = this.getSize(this.content);

                this.style.width = this.styles.width != 'auto' ? this.styles.width : size.width;
                this.style.height = this.styles.height != 'auto' ? this.styles.height : size.height;

                this.parent();

            },
            draw: function () {

                this.parent();

                this.ctx.font = this.styleParsed['font-size'] + ' Huggable';// Huggable'; //Fontdinerdotcom // todo dynamise
                this.ctx.fillStyle = this.styleParsed.color;
                this.ctx.strokeStyle = 'black'; // todo dynamise
                this.ctx.textBaseline = "top";

                this.ctx.fillText(this.content, this.styleParsed.left, this.styleParsed.top);
                this.ctx.strokeText(this.content, this.styleParsed.left, this.styleParsed.top);


            }

        });

    });