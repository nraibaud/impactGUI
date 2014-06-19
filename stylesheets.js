ig.module(
        'plugins.gui.stylesheets'
    )
    .defines(function () {
        'use strict';

        /*
         * stylesDefault : Style by default from stylesheets
         * styleDefault : Style by default of element
         * class : Style from class
         * style : Style sets to element
         * styles : Style merged ( stylesDefault,styleDefault of class,class,style)
         * styleParsed : style after applying parsing (finally used)
         * */

        ig.gui = ig.gui || {};

        ig.gui.styleSheets = {
            rules: {},
            addRules: function (rules) {
                var that;

                that = this;

                _.each(rules, function (v, k) {
                    that.add(k, v);
                });
            },
            stylesDraw: ['opacity', 'background', 'overflow'],
            stylesDefault: {
                display: 'inline',
                opacity: 1,
                sizeX: null,
                sizeY: null,
                size: 'auto auto this false',
                tile: [],
                tileSize: 0,
                scale: 1,
                width: 'inherit',
                height: 'inherit',
                ratio: 1,
                scaleWidth: 0,
                scaleHeight: 0,
                position: 'static',
                left: 0,
                top: 0,
                right: 'auto', // todo
                bottom: 'auto', // todo
                color: 'transparent',
                overflow: 'auto',
                'z-index': 0,
                'font-size': '10px',
                background: [],
                inherit: true
            },
            setStylesByDefault: function () {
                var that;

                that = this;

                _.each(ig.gui.styleSheets.stylesDefault, function (value, property) {
                    ig.gui.styleSheets.applyStyle.call(that, value, property);
                });
            },
            setStylesFromClass: function () {
                var rules, that;
                // todo remove class

                that = this;

                if (!this.class) {
                    return;
                }

                var className = this.class.split(' ');
                _.each(className, function (value, property) {
                    rules = ig.gui.styleSheets.rules[value];

                    _.each(rules, function (value, property) {
                        ig.gui.styleSheets.applyStyle.call(that, value, property);
                    });
                });
            },
            setStylesFromDefault: function () {
                var that = this;
                _.each(that.styleDefault, function (value, property) {
                    ig.gui.styleSheets.applyStyle.call(that, value, property);
                });

            },
            setStylesFromStyle: function () {
                var that = this;

                _.each(that.style, function (value, property) {
                    ig.gui.styleSheets.applyStyle.call(that, value, property);
                });
            },
            drawBackgrounds: function () {
                var i, backgroundsLength, that;

                that = this;
                i = 0;

                backgroundsLength = that.styleParsed.background.length;

                for (i; i < backgroundsLength; i++) {
                    that.styleParsed.background[i].draw(that);
                }
            },
            setStylesParsed: function (styles) {
                var that;
                that = this;
                styles = styles || that.styles;
                _.each(styles, function (value, property) {
                    that.styleParsed[property] = ig.gui.parse.apply(that, [value, property]);
                });
            },
            add: function (rule, properties) {
                var obj = {};
                obj[rule] = properties;
                ig.merge(this.rules, obj);
            },
            remove: function (rule) {
                delete this.rules[rule];
            },
            init: function () {

                if (!this.visible) {
                    return;
                }

                ig.gui.styleSheets.setStylesByDefault.apply(this);
                ig.gui.styleSheets.setStylesFromDefault.apply(this);
                ig.gui.styleSheets.setStylesFromClass.apply(this);
                ig.gui.styleSheets.setStylesFromStyle.apply(this);
                ig.gui.styleSheets.setStylesParsed.apply(this);
            },
            update: function (object) {
                var that;

                that = object || this;

                if (!that.visible) {
                    return;
                }

                that.redraw();

                // todo Add width and height to parent automatly (Useful for resized bg)

                that.loopOnChildren(function () {
                    ig.gui.redraw.call(this);
                });

                if(ig.gui.debug) {
                    console.info('UPDATE_STYLESHEET');
                }

            },
            getRelativeParent: function () {
                if (this.parentElement && this.parentElement.styleParsed.position === 'relative') {
                    return this.parentElement;
                } else if (this.parentElement && this.parentElement.styleParsed.position !== 'relative') {
                    return ig.gui.getRelativeParent.call(this.parentElement);
                } else {
                    return ig.gui.canvas;
                }
            },
            getPreviousVisibleObject: function () {
                var prev;

                prev = this.prev();

                if (!prev) {
                    return;
                }

                if (prev.visible && prev.styleParsed.position !== 'absolute') {
                    return prev;
                } else if (!prev.visible || prev.styleParsed.position === 'absolute') {
                    return ig.gui.styleSheets.getPreviousVisibleObject.call(prev);
                } else {
                    return;
                }
            },
            applyStyle: function (value, property) {

                var isImportant, isAlreadyImportant, that;

                that = this;

                // si important et precedent important on applique important
                // si important et precedent pas important on applique important
                // si pas important et precedent important on fait rien
                isImportant = value && value.match && value.match(/!important/);
                isAlreadyImportant = (this.styles[property]) ? this.styles[property].match && this.styles[property].match(/!important/) : false;
                if ((isImportant && isAlreadyImportant) || (isImportant && !isAlreadyImportant) || (!isImportant && !isAlreadyImportant)) {
                    if (typeof value === 'function') {
                        this.styles[property] = value.call(this);
                    } else {
                        if (property === 'background') {
                            if (!that.styles[property] || (value.match && value.match('none'))) {
                                that.styles[property] = [];
                            } else {
                                _.each(value, function (v, k) {
                                    if (!that.styles[property][k]) {
                                        that.styles[property][k] = ig.copy(v);
                                    } else {
                                        that.styles[property][k].style.tile = [];
                                        ig.merge(that.styles[property][k].style, ig.copy(v.style));
                                    }
                                });
                            }
                        } else {

                            this.styles[property] = ig.copy(value);


                        }
                    }
                }
            },
            isImportant: function (value) {
                if (typeof value === 'object') {
                    return value.important;

                } else if (value === 'string') {
                    return value.match(/!important/);
                } else {
                    return false;
                }
            },
            getImportantProperty: function (property1, property2) {
                var value1, value2;

                value1 = this.styles[property1];
                value2 = this.styles[property2];

                if (ig.gui.styleSheets.isImportant(value1) && ig.gui.styleSheets.isImportant(value2)) {
                    return property2;
                }
                else if (ig.gui.styleSheets.isImportant(value1) && !ig.gui.styleSheets.isImportant(value2)) {
                    return property1;
                }
                else if (!ig.gui.styleSheets.isImportant(value1) && ig.gui.styleSheets.isImportant(value2)) {
                    return property2;
                }
                else {
                    return property1;
                }
            },
            parse: function (value, property) {


                var val, parent, that;

                // If value is a function, execute it
                if (typeof value === 'function') {
                    value = value.call(this);
                }

                that = this;

                val = that.styleParsed[property] = _.clone(value);

                parent = that.parentElement ? that.parentElement : ig.gui.canvas;

                if (val === 'inherit') {
                    val = that.styleParsed[property] = parent.styleParsed[property];
                }

                switch (property) {
                    case 'background':
                        var i, backgroundsLength;
                        i = 0;
                        backgroundsLength = val.length;


                        for (i; i < backgroundsLength; i++) {


                            if (that.styleParsed[property][i] instanceof ig.gui.Background) {
                                return;
                            }

                            //delete that.styleParsed[property][i];
                            //that.styleParsed[property][i] = null;

                            var options = {
                                parentElement: that,
                                style: ig.copy(that.styles.background[i].style)
                            };
                            ig.merge(options, that.styles.background[i]);

                            that.styleParsed[property][i] = new ig.gui.Background(options);

                        }


                        break;
                    case 'position':
                        break;
                    case 'tile':
                    case 'tileSize':
                        break;
                    case 'sizeX':
                        // todo parse and get important
                        break;
                    case 'sizeY':
                        // todo parse and get important
                        break;
                    case 'size':
                        // todo parse and get important
                        if (!that.img) {
                            return val;
                        }

                        if (that.type === 'image' || that.type === 'background') {
                            val = val.split(' ');
                            that.styleParsed.sizeX = that.styleParsed.sizeX || val[0];
                            that.styleParsed.sizeY = that.styleParsed.sizeY || val[1];
                            that.styleParsed.from = that.styles.sizeFrom || val[2];
                            that.styleParsed.resize = that.styles.sizeResize || val[3];
                        }
                        break;
                    case 'ratio':
                        var size, sizeX, sizeY, resize, from, value, side, parsedSize, width, height;

                        // todo si tile pas le meme calcul

                        size = that.styleParsed.size,
                            sizeX = that.styleParsed.sizeX,
                            sizeY = that.styleParsed.sizeY,
                            from = that.styleParsed.from,
                            resize = that.styleParsed.resize;

                        if (!that.img) {
                            return val;
                        }

                        if (that.type === 'image' || that.type === 'background') {

                            if (sizeX === 'auto') {
                                value = sizeY;
                                side = 'height';
                            } else {
                                value = sizeX;
                                side = 'width';
                            }

                            if (typeof value === 'string' && value.match(/%/)) { // is a pourcent value
                                if (from === 'this') { // size from himself
                                    parsedSize = (that.styleParsed[side] * value.replace('%', '')) / 100;
                                } else if (from === 'parent') { // size from parentElement
                                    parsedSize = (parent.styleParsed[side] * value.replace('%', '')) / 100;
                                }
                                // todo from instance name e.g ig.gui.canvas
                                //
                            } else if (value === 'auto') { // is auto size, real size of element, no scale
                                parsedSize = that.styleParsed[side];
                            } else if (typeof value === 'string') {
                                parsedSize = parseInt(value, 10)
                            }
                            else {
                                parsedSize = value;
                            }


                            val = parsedSize / that.styleParsed[side];

                            if (side === 'width') {
                                width = parsedSize;
                                height = that.styleParsed.height * val;
                            } else {
                                width = that.styleParsed.width * val;
                                height = parsedSize;
                            }

                            if (from === 'parent') {// or should use px test or not tile ?
                                // val = val * ig.gui.canvas.scale;
                            }


                            if (width > parent.styleParsed.width && resize === 'true') {
                                parsedSize = parent.styleParsed.width;
                                val = parsedSize / that.styleParsed.width;
                                width = parsedSize;
                                height = that.styleParsed.height * val;

                            } else if (height > parent.styleParsed.height && resize === 'true') {
                                parsedSize = parent.styleParsed.height;
                                val = parsedSize / that.styleParsed.height;
                                width = that.styleParsed.width * val;
                                height = parsedSize;
                            }

                            that.styleParsed.width = width;
                            that.styleParsed.height = height;
                            // TODO GROS BUG La width et height est une valeur non scale :/

                        }
                        break;
                    case 'scaleWidth':
                        return val = that.styleParsed.width * ig.gui.canvas.scale;
                        break;
                    case 'scaleHeight':
                        return val = that.styleParsed.height * ig.gui.canvas.scale;
                        break;
                    case 'left':

                        /* Pourcent unit */
                        if (val && val.match && val.match(/%$/)) {
                            val = parseInt(val.replace('%', ''), 10); // todo relative
                            val = (parent.styleParsed.width * val) / 100;
                        }
                        /* center */
                        else if (val === 'center') {
                            val = (parent.styleParsed.width - this.styleParsed.width) / 2;
                        }

                        var prev = ig.gui.styleSheets.getPreviousVisibleObject.call(that);

                        if (prev && that.styleParsed.position != 'absolute' && that.styleParsed.display === 'inline') {
                            val += prev.styleParsed.left + prev.styleParsed.width;
                        } else {
                            val += parent.styleParsed.left;
                        }

                        break;
                    case 'right':
                        break;
                    case 'top':

                        /* Pourcent unit */
                        if (val && val.match && val.match(/%$/)) { // todo must be parent

                            val = parseInt(val.replace('%', ''), 10); // todo relative
                            val = (parent.styleParsed.height * val) / 100;
                        }
                        /* center */
                        else if (val === 'center') {
                            val = (parent.styleParsed.height - this.styleParsed.height) / 2;
                        }


                        var prev = ig.gui.styleSheets.getPreviousVisibleObject.call(that);

                        if (prev && that.styleParsed.position != 'absolute' && that.styleParsed.display === 'block') {
                            val += prev.styleParsed.top + prev.styleParsed.height;
                        } else {
                            val += parent.styleParsed.top;
                        }


                        break;
                    case 'bottom':
                        break;
                    case 'color':
                        break;
                    case 'height':
                        /* Pourcent unit */
                        if (val && val.match && val.match(/%$/)) {
                            val = parseInt(val.replace('%', ''), 10);
                            val = (parent.styleParsed.height * val) / 100;
                        }
                        /* Auto */
                        else if (val && val === 'auto') {
                            switch (that.type) {
                                case 'image':
                                case 'background':
                                    if (that.img) { // Test if img is loaded
                                        val = that.img.height;
                                    }
                                    else if (that.styleParsed.tile.length && that.img) {
                                        val = that.styleParsed.tileSize;
                                    }

                                    break;
                                default:
                                    val = parent.styleParsed.height;
                                    break;
                            }
                        }
                        break;
                    case 'width':
                        /* Pourcent unit */
                        if (val && val.match && val.match(/%$/)) {
                            val = parseInt(val.replace('%', ''), 10); // todo relative
                            val = (parent.styleParsed.width * val) / 100;
                        }
                        /* Auto */
                        else if (val && val === 'auto') {
                            switch (that.type) {
                                case 'image':
                                case 'background':
                                    if (that.img) { // Test if img is loaded
                                        val = that.img.width;
                                    }
                                    else if (that.styleParsed.tile.length && that.img) {
                                        val = that.styleParsed.tile.length * that.styleParsed.tileSize;
                                    }

                                    break;
                                default:
                                    val = parent.styleParsed.width;
                                    break;
                            }
                        }


                        break;
                    case 'font-size':
                        break;
                    case 'overflow':
                        if (that.styleParsed[property] === 'scroll' && !that.widgets.scrollBar && that.parentElement) { // todo should no be there
                            that.widgets.scrollBar = new ig.gui.widgets.scrollBar({element: that});
                            stage.add(that.widgets.scrollBar); // todo stage is a bug here

                        }
                        break;
                }


                return val;
            },
            draw: function () {
                var that;

                that = this;

                if (!this.visible) {
                    return;
                }


                _.each(ig.gui.styleSheets.stylesDraw, function (property) {
                    if (that.styleParsed[property]) {
                        switch (property) {
                            case 'overflow':
                                if (that.widgets.scrollBar) { // todo should not be there but extend on the widget himself
                                    that.widgets.scrollBar.draw(); // must be extended
                                }
                                break;
                            case 'opacity':
                                break;
                            case 'background':
                                ig.gui.drawBackgrounds.call(that);
                                break;
                        }
                    }
                });

            }
        };

        // Alias
        ig.gui.parse = ig.gui.styleSheets.parse; // todo should be on core and attach to element !
        ig.gui.drawBackgrounds = ig.gui.styleSheets.drawBackgrounds; // todo should be on core and attach to element !
        ig.gui.getRelativeParent = ig.gui.styleSheets.getRelativeParent; // todo should be on core and attach to element !
        ig.gui.redraw = ig.gui.styleSheets.update; // todo should be on core and attach to element !
    }
);

// todo height and width auto for all ,right,bottom