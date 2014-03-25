ig.module(
        'plugins.gui.widgets.scrollbar'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.widgets = ig.gui.widgets || {};

        ig.gui.widgets.scrollBar = ig.gui.Core.extend({
            type: 'widget_scrollBar',
            pos: {
                x: 0,
                y: 0
            },
            dropped: false,
            isDragging: false,
            init: function (options) {

                //todo scroll sur canvas et autre si element sort en dehors de la zone avec tt les childs
                // todo faire scroller avec la gde barre en clickant

                var that;

                that = this;


                this.element = options.element;


                this.element.style.scrollLeft = this.element.styleParsed.left;
                this.element.style.scrollTop = this.element.styleParsed.top;


                this.bind('pressed:MOUSE1', {
                    stopPropagation: false
                }, function () {
                    that.isDragging = true;
                    that.dropped = false;
                });

                ig.gui.canvas.bind('state:MOUSE1', {
                    stopPropagation: true
                }, function () {

                    var up = (that.dirY <= that.style.top);

                    that.dirY = that.style.top;

                    if (that.isDragging) {

                        that.style.top = that.element.styleParsed.top - (that.element.styleParsed.top - ig.input.mouse.y);
                        var pourcent = Math.abs(Math.floor((that.pos.y - that.style.top ) / (that.element.styleParsed.height - that.style.height) * 100));

                        that.element.style.scrollTop = -(that.element.styleParsed.scrollHeight - that.element.styleParsed.height ) * (pourcent / 100) + that.pos.y;



                        if (that.style.top <= that.pos.y && up) {
                            that.element.style.scrollTop = that.pos.y;
                            that.style.top = that.pos.y;
                        }

                        if (pourcent > 100) {

                            that.element.style.scrollTop = -(that.element.styleParsed.scrollHeight - that.element.styleParsed.height - that.pos.y);
                            that.style.top = that.element.styleParsed.height + that.pos.y - that.styleParsed.height;
                        }

                    }
                });

                ig.gui.canvas.bind('released:MOUSE1', {
                    stopPropagation: true
                }, function () {
                    console.warn('release');
                    that.isDragging = false;
                    that.dropped = true;
                });


                this.style.top = this.pos.y = this.element.styleParsed.top;
                this.style.left = this.pos.x = this.element.styleParsed.left + this.element.styleParsed.width;

                this.parent(options);

            },
            update: function () {
                this.style.width = 10;
                this.style.height = this.element.styleParsed.height / this.element.styleParsed.scrollHeight * 100;
                this.parent();
            },
            draw: function () {


                this.element.ctx.save();
                this.element.ctx.globalAlpha = 0.5;
                this.element.ctx.beginPath();
                this.element.ctx.fillStyle = "red";
                this.element.ctx.rect(this.element.styleParsed.left + this.element.styleParsed.width, this.element.styleParsed.top, 10, this.element.styleParsed.height);
                this.element.ctx.fill();
                this.element.ctx.closePath();
                this.element.ctx.restore();

                this.element.ctx.save();
                this.element.ctx.globalAlpha = 1;
                this.element.ctx.beginPath();
                this.element.ctx.fillStyle = "white";
                this.element.ctx.rect(this.element.styleParsed.left + this.element.styleParsed.width, this.styleParsed.top, 10, this.styleParsed.height);
                this.element.ctx.fill();
                this.element.ctx.closePath();
                this.element.ctx.restore();

                this.parent();
            }
        });

        ig.Input.inject({
            scroll: function (action, shape, callback, properties) {


            }
        });




        /*
         * $(function () {
         var canvas = document.getElementById('canvas');
         var ctx = canvas.getContext('2d');
         var video = document.getElementById('video');

         video.addEventListener('play', function () {
         var $this = this; //cache
         (function loop() {
         if (!$this.paused && !$this.ended) {
         ctx.drawImage($this, 0, 0);
         setTimeout(loop, 1000 / 30); // drawing at 30fps
         }
         })();
         }, 0);
         });
         *
         * */

    });