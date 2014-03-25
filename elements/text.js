// TODO WARNING, this class should be re-written
ig.module(
        'plugins.gui.elements.text'
    )
    .requires(
        'plugins.gui.element'
    )
    .defines(function () {
        'use strict';


        // todo text with image
        // todo content should be an object that contain other text instance or class ? or text string


        ig.gui.elements.Text = ig.gui.Element.extend({
            type: 'text',
            styleDefault: {
                color: 'black',
                width: 'auto',
                height: 'auto',
                display: 'inline'
            },
            content: '',
            contentParsed: '',
            init: function (options) {
                this.parent(options);
                this.parseContent();
            },
            update: function () {

                // todo update should refactoring, text should be canged only if different from previous text value or if user force it.
                this.parseContent();


                for (var i = 0; i < this.contentParsed.length; i++) {
                    var cnt = this.contentParsed[i];
                    if (typeof cnt != 'object') {
                        this.add(cnt);
                    }
                }

                this.parent();


            },
            parseContent: function () {
                var that, tag;

                that = this;
                tag = 0;

                // Copy content to contentParsed
                that.contentParsed = that.content;

                // Reset scrollHeight
                that.style.scrollHeight = 0;

                // Remove all children
                this.removeAllChildren();

                // Register tags
                var tags = that.contentParsed.match(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/text>/gi);

                // Transform tags and transform breakline
                that.contentParsed = that.contentParsed.replace(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/text>/gi, '<TEXT>').split('\n');


                var reg = /<text class="(.*)">(.*?)<\/text>/gi;
                for (var i = 0; i < that.contentParsed.length; i++) {


                    // split words
                    that.contentParsed[i] = that.contentParsed[i].split(' ');


                    for (var j = 0; j < that.contentParsed[i].length; j++) {


                        var word = that.contentParsed[i][j];


                        if (word === '<TEXT>') {

                            word = tags[tag];

                            tag++;


                            var cnt = word.match(reg);

                            var cnt = new ig.gui.elements.Text({

                                content: RegExp.$2,//content[i].match(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/text>/),
                                'class': RegExp.$1
                            });

                            that.contentParsed[i][j] = cnt;

                        }
                    }

                }


                // todo set parsedHeight content if not define here


            },
            getSize: function (word) {
                // Set font size and family for measuring text
                return {
                    width: this.ctx.measureText(word).width,
                    height: parseInt(this.styleParsed['font-size'])
                }
            },
            draw: function () {

                this.parent();

                var fontSize = parseInt(this.styleParsed['font-size']);
                // todo text align
                //var ta = (this.parentElement.styleParsed['width'] - this.styleParsed['width']) / 2;
                //console.log(this.parentElement.styleParsed['width'], this.styleParsed['width']);
                // todo others
                //var va = (this.styleParsed['height'] - fontSize) / 2;

                //      this.ctx.save();
                var va = 0;
                var ta = 0;

                if (this.styleParsed.overflow === 'hidden' || this.styleParsed.overflow === 'scroll') {
                    // Shape for clipping overlfow
                    // todo overflow should be define enywhere
                    this.ctx.beginPath();
                    this.ctx.fillStyle = 'transparent';
                    this.ctx.rect(this.styleParsed.left, this.styleParsed.top, this.styleParsed.width, this.styleParsed.height);
                    this.ctx.closePath();
                    this.ctx.clip();
                }


                // foreach lines
                var prevY = 0;
                for (var i = 0; i < this.contentParsed.length; i++) {
                    var prevX = 0;
                    var width = 0;

                    // Foreach words into lines
                    for (var j = 0; j < this.contentParsed[i].length; j++) {

                        var word = this.contentParsed[i][j];

                        // todo ++ de lancienne pos

                        // todo set width,height,left,top here

                        if (typeof word === 'object') {


                            this.ctx.font = this.styleParsed['font-size'] + ' Huggable';// Huggable'; //Fontdinerdotcom
                            this.ctx.fillStyle = word.styleParsed.color;
                            this.ctx.textBaseline = "top";

                            var words = word.contentParsed[0];

                            for (var k = 0; k < words.length; k++) {
                                width += this.getSize(words[k] + ' ').width;

                                if (width > this.styleParsed.width && this.getSize(words[k] + ' ').width < this.styleParsed.width) {
                                    prevY += fontSize;
                                    prevX = 0;

                                    this.ctx.fillText(words[k], (this.styleParsed.scrollLeft || this.styleParsed.left) + prevX + ta, (this.styleParsed.scrollTop || this.styleParsed.top) + prevY);

                                } else {

                                    this.ctx.fillText(words[k], (this.styleParsed.scrollLeft || this.styleParsed.left) + prevX + ta, (this.styleParsed.scrollTop || this.styleParsed.top) + prevY);

                                    prevX += this.getSize(words[k] + ' ').width;
                                }

                            }

                        } else {

                            this.ctx.font = this.styleParsed['font-size'] + ' Huggable';// Huggable'; //Fontdinerdotcom
                            this.ctx.fillStyle = this.styleParsed.color;
                            this.ctx.strokeStyle = 'black';
                            this.ctx.textBaseline = "top";


                            // todo si le mot alui celle est trop grand on le push en dessous.


                            width += this.getSize(word + ' ').width;
                            if (width > this.styleParsed.width && this.getSize(word + ' ').width < this.styleParsed.width && (this.styleParsed.overflow === 'hidden' || this.styleParsed.overflow === 'scroll')) {
                                if (this.contentParsed[i + 1]) {
                                    this.contentParsed[i + 1].pop(word);
                                }
                                else {
                                    this.contentParsed.push([word]);
                                }
                            } else {

                                // todo margin + padding
                                this.ctx.fillText(word, (this.styleParsed.scrollLeft || this.styleParsed.left) + prevX + ta, (this.styleParsed.scrollTop || this.styleParsed.top) + prevY);
                                this.ctx.strokeText(word, (this.styleParsed.scrollLeft || this.styleParsed.left) + prevX + ta, (this.styleParsed.scrollTop || this.styleParsed.top) + prevY);

                                prevX += this.getSize(word + ' ').width;

                            }

                        }
                    }

                    prevY += fontSize;
                }

                //  this.ctx.restore();

                this.style.width = prevX;// this.styles.width != 'auto' ? this.styles.width : prevX;
                this.style.height = prevY;//this.styles.height != 'auto' ? this.styles.height : prevY;

                // todo temp should be remove
                ig.gui.styleSheets.init.call(this);


            }


        });

    });