ig.module(
        'plugins.gui.elements.image'
    )
    .requires(
        'impact.image',
        'plugins.gui.element'
    )
    .defines(function () {
        'use strict';


        ig.Image.inject({
            alpha: 1,
            drawTile: function (targetX, targetY, tile, tileWidth, tileHeight, flipX, flipY) {
                if (this.alpha != 1) {
                    ig.system.context.globalAlpha = this.alpha;
                }

                this.parent(targetX, targetY, tile, tileWidth, tileHeight, flipX, flipY);
                if (this.alpha != 1) {
                    ig.system.context.globalAlpha = 1;
                }
            },
            drawImg: function (x, y, width, height) {
                if (this.alpha != 1) {
                    ig.system.context.globalAlpha = this.alpha;
                }

                //ig.system.context.save();


                ig.system.context.drawImage(this.data, x, y, width, height);

                //  ig.system.context.restore();

                if (this.alpha != 1) {
                    ig.system.context.globalAlpha = 1;
                }
            },
            draw: function (targetX, targetY, sourceX, sourceY, width, height) {
                if (this.alpha != 1) {
                    ig.system.context.globalAlpha = this.alpha;
                }

                this.parent(targetX, targetY, sourceX, sourceY, width, height);

                if (this.alpha != 1) {
                    ig.system.context.globalAlpha = 1;
                }

            }
        });


        /* Public Background Class
         * Can add multiple Backgrounds to objects OK
         * Position : 'Fixed'|'Static',
         * left: Number|Pourcent OK
         * Top: Number|Pourcent OK
         * x: Integer|Pourcent|'left','right','center'
         * y: Integer|Pourcent|'left','right','center'
         * repeat:true|false, OK
         * repeat-x:true|false, OK
         * repeat-y:true|false, OK
         * opacity: Number 0 to 1 OK
         * animation: ig.gui.animate
         * spriteAnimation : ig.AnimationSheet
         * spriteAnimationSheet: ig.Animation
         * img: ig.Image OK
         * gradient: canvas gradient Object (Liner or radial) OK
         * tile : { tile: Tile number,size: tile size Number } OK
         * */

        ig.gui.elements.Image = ig.gui.Element.extend({
            type: 'image',
            styleDefault: {
                repeat: false,
                x: 0,
                y: 0,
                animSheet: null,
                anim: null,
                url: null,
                gradient: null,
                tile: [],
                tileSize: 0,
                height: 'auto',
                width: 'auto',
                inherit: true
            },
            beforeDraw: function () {
            },
            afterDraw: function () {
            },
            init: function (options) {
                var src, that;

                that = this;


                if (that instanceof ig.gui.Background) {


                    ig.merge(this, options);

                    if (options.style.url) { // Background Image
                        this.img = new ig.Image(options.style.url);
                        this.parent(options);
                        ig.gui.styleSheets.init.call(that);
                        this.img.loadCallback = function () {
                            that.img.width = that.img.width;
                            that.img.height = that.img.height;
                            ig.gui.redraw(that);
                        };

                    } else { // Background Color
                        this.styleDefault.width = 'inherit';
                        this.styleDefault.height = 'inherit';
                        this.parent(options);
                        ig.gui.styleSheets.init.call(that);
                    }

                } else {
                    this.img = new ig.Image(options.src);
                    this.parent(options);
                    ig.gui.styleSheets.init.call(that);
                    this.img.loadCallback = function () {
                        that.img.width = that.img.width;
                        that.img.height = that.img.height;
                        ig.gui.redraw(that);
                    };
                    this.styleDefault.from = (options.style && options.style.from) ? options.style.from : this;
                }
            },
            draw: function () {
                var parent, that;

                that = this;

                this.beforeDraw();

                parent = this.parentElement;

                /* Return if background is hidden */
                if (!this.visible || !this.parentElement.visible) {
                    return;
                }

                //ig.gui.styleSheets.draw.call(this);


                this.ctx.save();
                ig.system.context.globalAlpha = this.styleParsed.opacity;
                //this.ctx.translate(parent.styleParsed.left, parent.styleParsed.top);

                // background Gradient
                if (this.gradient) {
                    this.gradient();
                }


                // Background color
                if (this.styleParsed.color && this.styleParsed.color != 'transparent') {

                    ig.system.context.globalAlpha = this.styleParsed.opacity;
                    ig.system.context.beginPath();
                    ig.system.context.fillStyle = this.styleParsed.color;
                    ig.system.context.rect(
                        this.styleParsed.left,
                        this.styleParsed.top,
                        this.styleParsed.width,
                        this.styleParsed.height
                    );
                    ig.system.context.fill();
                    ig.system.context.closePath();
                }


                // Background Image or Image
                if (this.img && !this.styleParsed.tile.length) {

                    var nbImagesY;
                    nbImagesY = this.parentElement.styleParsed.height / this.img.height;

                    var nbImagesX;
                    nbImagesX = this.parentElement.styleParsed.width / this.img.width;

                    if (this.repeat || ( this.repeatX && this.repeatY)) {
                        for (var i = 0; i < nbImagesY; i++) {
                            var topPos = top + (this.img.height * i);
                            for (var j = 0; j < nbImagesX; j++) {
                                var leftPos = left + (this.img.width * j);
                                this.img.draw(leftPos, topPos);
                            }
                            this.img.draw(leftPos, topPos);
                        }
                    }
                    else if (this.repeatY) {
                        for (var i = 0; i < nbImagesY; i++) {
                            this.img.draw(left, top + (this.img.height * i));
                        }
                    }
                    else if (this.repeatX) {
                        for (var i = 0; i < nbImagesX; i++) {
                            this.img.draw(left + (this.img.width * i), top);
                        }
                    }
                    else {
                        this.ctx.save();
                        this.ctx.scale(this.styleParsed.ratio, this.styleParsed.ratio);
                        this.img.draw(this.styleParsed.left / this.styleParsed.ratio, this.styleParsed.top / this.styleParsed.ratio);
                        this.ctx.restore();
                    }


                }



                // Tile Image
                else if (this.img && this.styleParsed.tile) {
                    var nbImagesY;
                    nbImagesY = height / this.styleParsed.tile.size;

                    var nbImagesX;
                    nbImagesX = width / this.styleParsed.tile.size;

                    if (this.repeat || ( this.repeatX && this.repeatY)) {
                        for (var i = 0; i < nbImagesY; i++) {
                            var topPos = top + (this.styleParsed.tile.size * i);
                            for (var j = 0; j < nbImagesX; j++) {
                                var leftPos = left + (this.styleParsed.tile.size * j);
                                this.img.drawTile(leftPos, topPos, this.styleParsed.tile, this.styleParsed.tileSize);
                            }
                            this.img.drawTile(leftPos, topPos, this.styleParsed.tile, this.styleParsed.tileSize);
                        }
                    }
                    else if (this.repeatY) {
                        for (var i = 0; i < nbImagesY; i++) {
                            this.img.drawTile(left, top + (this.styleParsed.tileSize * i), this.styleParsed.tile, this.styleParsed.tileSize);
                        }
                    }
                    else if (this.repeatX) {
                        for (var i = 0; i < nbImagesX; i++) {
                            this.img.drawTile(left + (this.styleParsed.tileSize * i), top, this.styleParsed.tile, this.styleParsed.tileSize);
                        }
                    }
                    else {
                        this.ctx.save();
                        this.ctx.scale(this.styleParsed.ratio, this.styleParsed.ratio);
                        _.each(this.styleParsed.tile, function (tile, i) {


                            that.img.drawTile((that.styleParsed.left / that.styleParsed.ratio + (i * that.styleParsed.tileSize)), that.styleParsed.top / that.styleParsed.ratio, tile, that.styleParsed.tileSize);
                        });

                        this.ctx.restore();
                    }

                }


                this.ctx.restore();

                this.parent();

                this.afterDraw();


            }
            /*update:function(){
             this.style.width = this.img.width;
             this.style.height = this.img.height;

             ig.gui.styleSheets.init.call(this);
             this.parent();

             }*/
        });


    });

// todo cropping
// todo animate image using Impact but can be scaled.
//todo z-index
// todo |inherit
// todo bg video
// todo image flip