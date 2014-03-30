ig.module(
        'plugins.gui.loader'
    )
    .requires(
        'impact.loader',
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui.Loader = ig.Loader.extend({
            type: 'loader',
            name: 'loader'
        });

        ig.gui.styleSheets.addRules({
            'txt-1': {
                color: '#F47920',
                'font-size': '32px'
            }
        });

        ig.gui.Loader.inject({
            bgStyle: {
                url: 'lib/plugins/gui/loader.png',
                left: 'center',
                top: 'center',
                size: '50% 50% parent true'
            },
            init: function (gameClass, resources, canvasProperties) {

                function initResources(resource) {
                    var typeClass;
                    typeClass = ig.gui.getType(resource);
                    ig.resources.push(new (typeClass)(resource));
                }


                /*
                 Load resources manually
                 e.g [RESOURCE_URL]
                 Auto load ressources can be done with instantiate image or sound directly on the class definition
                 e.g myBg:new ig.Image(URL);
                 */
                for (var i = 0; i < this.resources.length; i++) {
                    initResources(this.resources[i]);
                }

                new ig.gui.Canvas(canvasProperties);


                this.gameLoader = new ig.gui.View({
                    name: 'gameLoaderView',
                    style: {
                        background: [
                            {
                                name: 'loaderBgColor', // todo other settings should be apply, name is not apply !
                                style: {
                                    color: 'black' //#24272a
                                }
                            },
                            {
                                name: 'loaderBgImage', // todo other settings should be apply, name is not apply !
                                style: this.bgStyle
                            }
                        ]
                    }
                });


                this.title = new ig.gui.elements.Text({
                    name: "title",
                    style: {
                        display: 'block',
                        color: 'white',
                        'font-size': '32px'
                    },
                    content: '. '
                });

                this.contentType = new ig.gui.elements.Text({
                    style: {
                        display: 'block',
                        color: 'white',
                        'font-size': '32px'
                    }
                });


                ig.gui.canvas
                    .add(this.gameLoader);

                this.gameLoader
                    .add(this.contentType)
                    .add(this.title);

                this.pointWidth = ig.system.context.measureText('. ').width;


                this.parent(gameClass, resources);


                return this;

            },
            draw: function () {
                ig.gui.canvas.update();
                ig.gui.canvas.draw();
            },
            _loadCallback: function (path, status) {
                var type, format;


                format = path.match(/\.([a-zA-Z0-9\*])+$/);

                switch (format[0]) {
                    case '.jpg':
                    case '.png':
                        type = 'Image';
                        break;
                    case '.mp3':
                    case '.ogg':
                        type = 'Sound';
                        break;
                    default:
                        type = 'Resource';
                }

                this.contentType.content = '<text class="txt-1">' + type + '</text> [' + path + ']'; // todo should be a json object !!!

                // todo bug here
                var nbPoints = parseInt(this.gameLoader.styleParsed.width / 18, 10) / this.resources.length;

                for (var i = 0; i < nbPoints; i++) {
                    this.title.content += '. '
                }
                this.parent(path, status);
            },
            end: function () { // todo end callBack has options argument or use inject.

                if (this.done) {
                    return;
                }
                this.done = true;
                ig.gui.canvas.remove(this.gameLoader);
                clearInterval(this._intervalId);

            }
        });

    });

// todo all values can be a function !
// todo sizeFrom,positionFrom