(function($, window, document, undefined) {
    "use strict";
    
    var _pluginName = 'pluginChangeMe';

    var _Plugin = function($el, options) {
        // store the element on which the plugin is initialized
        this.$el = $el;

        // prepare the options
        // Options are created with the following prorities:
        //  1. Options read from the element's data attribute - pluginNameOptions with JSON value.
        //  2. Options passed to the constructor.
        //  3. Default plugin options defined in $.fn.pluginName.defaults object.
        this.options = $.extend(true, {}, $.fn[_pluginName].defaults, options, $el.data(_pluginName));

        // delegate the further creation to the prototype _init() method
        this._init();
    };

    _Plugin.prototype = {
        /**
         * Element on which the plugin was initialized
         * 
         * @type {jQuery}
         */
        $el : null,

        /**
         * Options of this plugin.
         * 
         * @type {Object}
         */
        options : {},

        /**
         * Allows for external access to options - by setting or getting.
         * If only one argument is passed then it behaves like a getter.
         * If 2nd argument is passed then it behaves like a setter.
         * 
         * @param  {String} k Name of the option to get or set.
         * @param  {mixed} v[optional] Value to set.
         * @return {mixed}
         */
        option : function(k, v) {
            // no value specified, so it's a getter
            if (v === undefined) {
                return this.options[k];
            }

            this.options[k] = v;
        },

        /*****************************************************
         * PLUGIN LIFECYCLE
         *****************************************************/
        /**
         * Called by the plugin constructor on plugin initialization, only once.
         */
        _init : function() {
            var self = this;

            this.$el.html('plugin initialized');
            console.log('plugin init with options:', this.options);

            /*
             * REGISTER LISTENERS
             */
            /**
             * Log the options of this plugin when clicked on the element.
             * 
             * @param  {Event} ev jQuery Event.
             */
            this.$el.on('click', function(ev) {
                console.log('clicked on plugin', self.options);
                return false;
            });
        },

        /**
         * Implement this method for easy destruction of the plugin.
         */
        _destroy : function() {},


        /*****************************************************
         * PLUGIN BODY
         *****************************************************/
        // all the methods below are just examples and should be removed
        /**
         * Example method.
         */
        method : function() {
            console.log('called example method');
        },

        /**
         * Example method with some arguments.
         */
        methodWithArguments : function(arg1, arg2, arg3) {
            console.log('called method with arguments', arg1, arg2, arg3);
        },

        /**
         * Example method that returns something.
         */
        methodWithReturnValue : function() {
            return 44;
        },

        /**
         * Example private method.
         */
        _privateMethod : function() {
            console.log('called private method');
        }
    };

    /**
     * Gets the plugin object from the given element.
     * If the plugin is not initialized yet then it will create it and store in element's data.
     * 
     * @param  {jQuery} $el jQuery object with the DOM element.
     * @param  {Object} opt Object literal with options used to initialize the plugin.
     * @return {Object} Instance of the Plugin.
     */
    function get($el, opt) {
        var o = $.data($el[0], _pluginName + '_plugin');
        if (!o) {
            o = new _Plugin($el, opt);
            $.data($el[0], _pluginName + '_plugin', o);
        }
        return o;
    }

    /**
     * Register the plugin under the desired namespace.
     * If an object literal is passed as the argument then it's treated as an options object.
     * If a string is passed then a method with the given name is called with the rest of the arguments passed along.
     * 
     * @param  {Object} options Options object.
     * @return {mixed} Either jQuery instance or whatever a function that was called returns.
     */
    $.fn[_pluginName] = function(options) {
        // disallow private methods, ie. those that start with _
        if (typeof options === 'string' && options.charAt(0) !== '_') {
            // translate arguments object to normal array
            var args = Array.prototype.slice.call(arguments, 1);

            /*
             * SPECIAL CASES
             */
            // if called 'destroy' method then call the internal destroy and then remove the plugin's object
            if (options == 'destroy') {
                return this.each(function() {
                    var $el = $(this),
                        o = get($el);

                    // call the plugin's destroy method
                    o._destroy();

                    $.data($el, _pluginName + '_plugin', null); // remove from element's data
                });
            }
            
            /*
             * NORMAL CASES
             */
            // prepare variable that will store any possible return value
            var r = null;

            this.each(function() {
                // get the plugin instance
                var o = get($(this));

                // call the requested method and store possible return value
                try {
                    r = o[options].apply(o, args);
                } catch(e) {};

                // if this method returned anything then break the foreach
                if (r !== null && r !== undefined) {
                    return false; // break
                }
            });

            // if there was a value returned then return it
            if (r !== null && r !== undefined) {
                return r;
            }

            // break already because we were calling a method
            return this;
        }

        return this.each(function() {
            get($(this), options);
        });
    };

    /**
     * Object literal with default options for this plugin.
     * They can be altered globally.
     * 
     * @type {Object}
     */
    $.fn[_pluginName].defaults = {};

})(jQuery, window, document);