// todo should be a custom router?

ig.module(
        'plugins.gui.router'
    )
    .requires(
        'plugins.gui.core'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};



// Routers map faux-URLs to actions, and fire events when routes are
// matched. Creating a new one sets its `routes` hash, if not set statically.
        ig.gui.Router = function (options) {
            options || (options = {});
            if (options.routes) this.routes = options.routes;
            this._bindRoutes();
            this.initialize.apply(this, arguments);
        };

        ig.gui.Router.extend = ig.gui.extend;

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
        var optionalParam = /\((.*?)\)/g;
        var namedParam = /(\(\?)?:\w+/g;
        var splatParam = /\*\w+/g;
        var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Set up all inheritable **ig.gui.Router** properties and methods.
        ig.merge(ig.gui.Router.prototype, ig.gui.Events);
        ig.merge(ig.gui.Router.prototype, {

            handlers: [],

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize: function () {

            },

            // Manually bind a single named route to a callback. For example:
            //
            //     this.route('search/:query/p:num', 'search', function(query, num) {
            //       ...
            //     });
            //
            route: function (route, name, callback) {
                if (!_.isRegExp(route)) route = this._routeToRegExp(route);
                if (_.isFunction(name)) {
                    callback = name;
                    name = '';
                }
                if (!callback) callback = this[name];
                var router = this;

                this.handlers.unshift({route: route, callback: function (fragment) {
                    var args = router._extractParameters(route, fragment);
                    callback && callback.apply(router, args);
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                }});

                return this;
            },

            // Simple proxy to `ig.gui.history` to save a fragment into the history.
            navigate: function (fragment, options) {
                if (!options || options === true) options = {trigger: options};
                // todo fix on gitub
                //if (this.fragment === fragment) return;
                this.fragment = fragment;
                var url = this.root + fragment;

                var matched = _.any(this.handlers, function (handler) {
                    if (handler.route.test(fragment)) {
                        handler.callback(fragment);
                        return true;
                    }
                });
                return matched;

            },

            // Bind all defined routes to `ig.gui.history`. We have to reverse the
            // order of the routes here to support behavior where the most general
            // routes can be defined at the bottom of the route map.
            _bindRoutes: function () {
                if (!this.routes) return;
                this.routes = _.result(this, 'routes');
                var route, routes = _.keys(this.routes);
                while ((route = routes.pop()) != null) {
                    this.route(route, this.routes[route]);
                }
            },

            // Convert a route string into a regular expression, suitable for matching
            // against the current location hash.
            _routeToRegExp: function (route) {
                route = route.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function (match, optional) {
                        return optional ? match : '([^\/]+)';
                    })
                    .replace(splatParam, '(.*?)');
                return new RegExp('^' + route + '$');
            },

            // Given a route, and a URL fragment that it matches, return the array of
            // extracted decoded parameters. Empty or unmatched parameters will be
            // treated as `null` to normalize cross-browser behavior.
            _extractParameters: function (route, fragment) {
                var params = route.exec(fragment).slice(1);
                return _.map(params, function (param) {
                    return param ? decodeURIComponent(param) : null;
                });
            }

        });

        _.extend(ig.gui.Router, ig.gui.Events);

    });