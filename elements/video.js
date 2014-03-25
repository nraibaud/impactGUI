// todo work in progress

ig.module(
        'plugins.gui.elements.video'
    )
    .requires(
        'plugins.gui.element'
    )
    .defines(function () {
        'use strict';

        ig.gui.elements.Video = ig.gui.Element.extend({
            type: 'video',
            init: function (options) {
                var that;

                that = this;

                this.parent(options);


                var draw = function () {
                    //ctx.drawImage(video,0,0);
                    var s = 4;
                    var x = 0;
                    var y = 0;
                    var sizeX = 100 * s;
                    var sizeY = 100 * s;
                }


                that.video = document.createElement('video');
                that.video.src = "media/video.ogv";
                that.video.addEventListener('canplaythrough', function () {
                    that.video.scalingMode = 'aspect-fill';
                    that.video.play();
                    that.video.currentTime = 0;
                    draw();
                }, false);
            },
            draw: function () {
                var that;

                that = this;

                this.parent();

                that.ctx.save();
                that.ctx.drawImage(that.video, that.styleParsed.left, that.styleParsed.top, 300, 200);
                that.ctx.restore();
            }
        });

    });