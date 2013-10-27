/*global jQuery*/
(function($, window, document, undefined) {
    "use strict";
    
    var _pluginName = 'pluginChangeMe';

    var _Plugin = function($el, options) {
        this.$el = $el;
        this.options = $.extend(true, {}, $.fn[_pluginName].defaults, options, $el.data(_pluginName));
        this._init();
    };

    _Plugin.prototype = {
        $el : null,
        options : {},

        option : function(k, v) {
            if (v === undefined) {
                return this.options[k];
            }
            this.options[k] = v;
        },

        _init : function() {
            /*****************************************************
             * IMPLEMENT ME!
             *****************************************************/
            console.error('Implement me!');
        },

        _destroy : function() {}

        /*****************************************************
         * PLUGIN BODY
         *****************************************************/
        // IMPLEMENT ME!
    };

    /*****************************************************
     * PLUGIN META
     *****************************************************/
    function get($el, opt) {
        var o = $.data($el[0], _pluginName + '_plugin');
        if (!o) {
            o = new _Plugin($el, opt);
            $.data($el[0], _pluginName + '_plugin', o);
        }
        return o;
    }

    $.fn[_pluginName] = function(options) {
        if (typeof options === 'string' && options.charAt(0) !== '_') {
            var args = Array.prototype.slice.call(arguments, 1);

            if (options == 'destroy') {
                return this.each(function() {
                    var $el = $(this),
                        o = get($el);

                    o._destroy();
                    $.data($el, _pluginName + '_plugin', null);
                });
            }
            
            var r = null;
            this.each(function() {
                var o = get($(this));

                try {
                    r = o[options].apply(o, args);
                } catch(e) {};

                if (r !== null && r !== undefined) {
                    return false; // break
                }
            });

            if (r !== null && r !== undefined) {
                return r;
            }

            return this;
        }

        return this.each(function() {
            get($(this), options);
        });
    };

    $.fn[_pluginName].defaults = {};

})(jQuery, window, document);