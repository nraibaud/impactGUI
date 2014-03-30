// todo comment code!
// todo make exemple of code!

ig.module(
        'plugins.gui.core'
    )
    .requires(
        'impact.impact',
        'impact.game',
        'plugins.gui.stylesheets',
        'plugins.gui.events',
        'plugins.gui.underscore'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        /* PRIVATE NAMESPACES */
        var gui = {};

        /**
         * PUBLIC
         * Objects, Class and Methods
         **/

        /* Public Main object */
        ig.gui.VERSION = '0.1.0';


        /* Public METHODS */

        ig.gui.clear = function () {
            ig.system.context.clearRect(0, 0, ig.system.context.canvas.width, ig.system.context.canvas.height);
        };

        ig.gui.get = function () {
            // 1 ID
            // 'xxx' type
            // CSS selector .xx + .xxx > .xxx
        };


        ig.gui.getType = function (resource) {

            var format, type;

            format = resource.match(/\.([a-zA-Z0-9])+$/);

            switch (format[0]) {
                case '.jpg':
                case '.png':
                    type = ig.Image;
                    break;
                case '.mp3':
                case '.ogg':
                    type = ig.Sound;
                    break;
            }
            return type;
        };

        ig.gui.extend = function (protoProps, staticProps) {
            var parent = this;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate();

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        };


        /* CORE */
        ig.gui.Core = ig.Class.extend({
            ctx: null, // todo should be removed
            widgets: {},
            visible: true,
            level: 0,
            children: [],
            parentElement: null,
            canvas: null,
            events: [],
            overflow: 'none',
            animation: null,
            options: {},
            styles: {},
            style: {},
            styleDefault: {},
            styleParsed: {},
            'class': '',
            init: function (options) {
                options = options || {};

                this.ctx = ig.system.context;

                ig.merge(this, options);
                ig.merge(this, ig.gui.Events);
                ig.merge(this.options, options);


                if (this.type === 'canvas') {
                    ig.gui.canvas = this;
                    ig.gui.styleSheets.init.apply(this);
                }

                return this;
            },
            update: function () {

                var self;

                self = this;

                /* Do nothing if element is hidden */
                if (!this.visible) {
                    return;
                }

                /* Update stylesheets */
                // 2014 , removed because take too much resource
                //ig.gui.styleSheets.init.apply(this);


                /* Update animation */
                if (this.animation) {
                    this.animation.update(this);
                }

                if (this.styleParsed.position === 'absolute' || this.styleParsed.position === 'relative') {
                    // .call does not work so use self
                    this.children.sort(function (a, b) {
                        return self.sortByZindex(a, b);
                    });
                }

                /* Check events and update children */
                if (this.type === 'canvas') {
                    this._checkEvents();
                    this.loopOnChildren(function () {
                        this._checkEvents();
                        this.update();
                    });
                }

            },
            draw: function () {

                /* Do nothing if element is hidden */
                if (!this.visible) {
                    return;
                }


                // todo should not be there
                /* Draw animation */
                if (this.animation) {
                    this.animation.draw(this);
                }

                /* Draw  stylesheets */
                ig.gui.styleSheets.draw.call(this);

                /* Draw children */
                this.loopOnChildren(function () {
                    this.draw();
                });

            },
            _setGuid: function () {
                this.guid = this._generateGuid();
            },
            _generateGuid: function () { // todo temp
                return 0;
            },
            add: function (element) {
                var self;

                self = this;

                if (_.isArray(element)) {
                    _.each(element, function (value, key) {
                        self.add(value);
                    });
                    return self;
                }

                element.parentElement = this;

                if (element.type === 'image') {
                    element.img.parentElement = this;
                }

                element.level = this.level + 1;

                this.children.push(element);

                if (element.visible) {
                    ig.gui.styleSheets.init.apply(element);
                }

                return this;
            },
            injectBefore: function () {

            },
            injectAfter: function () {

            },
            append: function () {

            },
            prepend: function () {

            },
            remove: function (element) {
                this.children = _.without(this.children, element);
                return this;
            },
            removeAllChildren: function () {
                this.children = [];
                return this;
            },
            reset: function () {
                this.removeAllChildren().init();
                return this;
            },
            addActions: function (actions) {
                var actionsLength, i, action;

                i = 0;
                actionsLength = actions.length;

                for (i; i < actionsLength; i++) {
                    action = actions[i];
                    this.addAction(action);
                }
            },
            addAction: function (action) {
                ig.input.bind(action.key, action.action);
            },
            /**
             * Rendering animations
             * @Class ig.gui.Animation
             * @property easing String Easing type
             * @property duration Number Animation duration
             * @property animation Object|Function|Sring Animation based on pre-animation or custom animation
             * @Return Object Instance
             **/
            animate: function (style, duration, callbackStart, callbackComplete, onUpdate, onDraw) {
                ig.gui.styleSheets.init.call(this);
                this.animation = new ig.gui.Animation(style, duration, callbackStart, callbackComplete, onUpdate, onDraw, this);
                return this.animation;
            },
            show: function () {
                this.visible = true;
                return this;
            },
            hide: function () {
                this.visible = false;
                return this;
            },
            clear: function () {
                ig.system.context.clearRect(this.styleParsed.left, this.styleParsed.top, this.styleParsed.width, this.styleParsed.height);
                return this;
            },
            redraw: function () {
                ig.gui.styleSheets.init.call(this);
                return this;
            },
            redrawAll: function () {
                ig.gui.redraw.call(this);
                return this;
            },
            bind: function (event, properties, callback) {
                this.events.push([event, properties, callback]);
                return this;
            },
            unbind: function (event) { // todo unbind
                return this;
            },
            unbindAll: function () {
                this.events = [];
                return this;
            },
            hasChildren: function () {
                return this.children.length;
            },
            _checkEvents: function () {
                var type, action, i, event, properties, callback, eventsLength, events;
                i = 0;
                events = this.events;
                eventsLength = events.length;

                //todo check if same level

                for (i; i < eventsLength; i++) {
                    event = events[i][0].split(':');
                    properties = events[i][1];
                    callback = events[i][2];
                    type = event[0];
                    action = event[1];

                    // todo verifier si levent est dans le bon niveau
                    // User call action
                    if (ig.input[type](action, this, callback, properties) && this._isOnShapeArea() && !this._isOnStopPropagationChild(this)) {
                        // todo zIndex, event mousenter,mouseover,mouseout,mouseleave

                        // todo remove , unbind events
                        // todo OFF
                        callback.call(this, properties);
                    }
                }
            },
            _isOnStopPropagationChild: function (parent) {
                var event, i, eventsLength, isOnStopPropagationChild;

                isOnStopPropagationChild = false;

                this.loopOnChildren(function () {
                    i = 0;
                    eventsLength = this.events.length;

                    for (i; i < eventsLength; i++) {
                        event = this.events[i];
                        if (event[1].stopPropagation) {
                            if (this._isOnShapeArea.call(parent)) {
                                if (this._isOnShapeArea.call(this)) {
                                    isOnStopPropagationChild = true;
                                }
                            }
                        }
                    }

                });
                return isOnStopPropagationChild;
            },
            prev: function () {

                var that, previousElement;
                that = this;

                if (that.parentElement) {
                    var index = that.parentElement.children.indexOf(that);
                    previousElement = that.parentElement.children[index - 1];
                } else if (!that.parentElement && ig.gui.canvas) {
                    var index = ig.gui.canvas.children.indexOf(that);
                    previousElement = ig.gui.canvas.children[index - 1];
                } else {
                    previousElement = null;
                }
                return previousElement;


            },
            loopOnChildren: function (callback) {
                var i, element, childrenLength;


                i = 0;
                childrenLength = this.children.length;

                for (i; i < childrenLength; i++) {
                    element = this.children[i];

                    // todo  bug here array call proto methods ?
                    if (typeof element === 'undefined') {
                        return;
                    }

                    if (element.visible) {
                        callback.call(element);
                        this.loopOnChildren.call(element, callback);
                    }

                }
            },
            _isOnShapeArea: function (element) {
                // todo test zIndex
                // Se chie dessus sur du relatif ?

                // todo se baser sur aussi sur la largeur lelement drager

                if (element) {
                    if (
                        (this.styleParsed.left + this.styleParsed.width >= element.styleParsed.left) && (this.styleParsed.left <= (element.styleParsed.left + element.styleParsed.width)) &&
                            (this.styleParsed.top + this.styleParsed.height >= element.styleParsed.top) && ( this.styleParsed.top <= (element.styleParsed.top + element.styleParsed.height))
                        ) {


                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (
                        (ig.input.mouse.x >= (this.styleParsed.left)) && ( ig.input.mouse.x <= ((this.styleParsed.left) + this.styleParsed.width )) &&
                            (ig.input.mouse.y >= (this.styleParsed.top)) && ( ig.input.mouse.y <= ((this.styleParsed.top) + this.styleParsed.height))
                        ) {


                        return true;
                    } else {
                        return false;
                    }
                }

            },
            getZindex: function () { // todo on stylesheet

            },
            setZindex: function () {

            },
            sortByZindex: function (a, b) {
                return a.styleParsed['z-index'] - b.styleParsed['z-index'];
            },
            getById: function () { // todo

            },
            getByName: function () {

            },
            getByType: function () {

            },
            transformTag: function (tagName) { // todo using tag
                switch (tagName) {
                    case 'LAYER' :
                        break;
                    case 'TEXT' :
                        break;
                    case 'AUDIO' :
                        break;
                    case 'VIDEO' :
                        break;
                    case 'FORM' :
                        break;
                    case 'INPUT_TEXT' :
                        break;
                    case 'TEXTAREA' :
                        break;
                    case 'RADIO' :
                        break;
                    case 'CHECKBOX' :
                        break;
                    case 'SELECT' :
                        break;
                }
            },
            addClass: function (className) {
                this.class += ' ' + className;
                ig.gui.redraw(this);
                return this;
            },
            removeClass: function (className) {
                var classes;

                classes = this.class.split(' ');
                classes = _.without(classes, className);

                this.class = classes.join(' ');

                ig.gui.redraw(this);

                return this;
            },
            /*
             * Select objects by their properties
             * */
            find: function (properties) { // todo children in children
                var elements;
                elements = _.where(this.children, properties);
                return elements;
            }
        });


        ig.gui.Game = ig.Game.extend({
            clearColor: "#fff",
            init: function (options) {
                if (this.parent) {
                    this.parent(options);
                }
            },
            update: function () {
                ig.gui.canvas.update();
                this.parent();
            },
            draw: function () {
                ig.gui.clear();
                this.parent();
                ig.gui.canvas.draw();
            }
        });

        // Add events to ig.gui
        ig.merge(ig.gui, ig.gui.Events);


        /* EXTEND IMPACTJS */

        // Add Listeners to ig.Game
        ig.merge(ig.Game, ig.gui.Events);

        // Extending Input Class
        ig.Input.inject({
            prev: {
                mouse: {
                    x: 0,
                    y: 0
                }
            },
            bind: function (key, action) {
                if (key < 0) {
                    this.initMouse();
                }
                else if (key > 0) {
                    this.initKeyboard();
                }
                this.bindings[key] = action;
            },
            // todo click event like pressed
            click: function (action, shape, callback, properties) {

            },
            mouseover: function (action, shape, callback, properties) {
                if (shape._isOnShapeArea.call(shape)) {
                    shape.mouseOver = true;
                    callback.call(shape, properties);
                }
            },
            mouseout: function (action, shape, callback, properties) {
                if (shape.mouseOver && !shape._isOnShapeArea.call(shape)) {
                    callback.call(shape, properties);
                    shape.mouseOver = false;
                }
            },
            mouseenter: function (action, shape, callback, properties) {
                if (shape._isOnShapeArea.call(shape)) {

                    if (!shape.mouseEnter) {
                        callback.call(shape, properties);
                        shape.mouseEnter = true;
                    }
                }
            },
            mouseleave: function (action, shape, callback, properties) {
                if (shape.mouseEnter && !shape._isOnShapeArea.call(shape)) {
                    callback.call(shape, properties);
                    shape.mouseEnter = false;
                }
            }

        });


    });


/// todo children byZindex
// todo slide,fade,toggle...
//todo  aniamtion, move, rotate,scale, tween ESAING, play, pause, nbToRun
// drag only vertical or only horizontal, or all, from, to (callback), if HIT event
// si un block a un overflow alors on specify un widget scrollbar
// widget tab,accordeon...
//ajouter event ondraw onupdate, onadd,onremove ...
// customBeforeDraw, closingPath
//customAfterDraw, closingPAth
// can animate with custom animation
// todo onDraw method
//todo onUpdate method