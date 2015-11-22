// defineObject-js v2.0 
// (c) 2013 Sergey Melnikov 

// defineObject-js may be freely distributed under the MIT license

;(function () {
    "use strict";

    var root = this;

    var objectCreate = ( Object.create ||  function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    });

    function extend(to, from) {
        for (var prop in from) { 
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }

        return to;
    }
 
    function defineObject(methods,staticMethods) {
        var F = function() {
            var i, l,
                mixin = this.constructor.__mixin__,
                properties = this.constructor.__properties__;

            if (properties) {
                Object.defineProperties(this, properties);
            }

            if (mixin) {
                for (i = 0, l = mixin.length; i < l; i++) {
                    mixin[i].call(this);
                }
            }

            this.__init__.apply(this, arguments);
        };

        extend(F, {
            __mixin__ : null,
            __properties__ : null,
            properties : function(props) {
                this.__properties__ || (this.__properties__ = {});
                extend(this.__properties__,props);
                return this;
            },

            mixin : function(mixin) {
                var constructor = this.prototype.constructor,
                    __init__ = this.prototype.__init__,
                    __super__ = this.prototype.__super__;

                if (typeof mixin === 'function') {
                    this.__mixin__ || (this.__mixin__ = []);
                    extend(this.prototype, mixin.prototype);
                    if (typeof mixin.prototype.__init__ === 'function') this.__mixin__.push(mixin.prototype.__init__);
                    else this.__mixin__.push(mixin);
                } else {
                    extend(this.prototype, mixin);
                    if (typeof mixin.__init__ === 'function') {
                        this.__mixin__ || (this.__mixin__ = []);
                        this.__mixin__.push(mixin.__init__);
                    }

                }

                this.prototype.constructor = constructor;
                this.prototype.__init__ = __init__;
                this.prototype.__super__ = __super__;

                return this;
            },
            methods : function(methods) {
                extend(this.prototype, methods);
            },
            statics : function(statics) {
                extend(this, statics);
            },
            extend : function(methods, staticMethods) {
                return defineObject.extend(this, methods, staticMethods);
            }    
        });

        F.prototype.__init__ = function() {};
        if (methods) F.methods(methods);
        if (staticMethods) F.statics(staticMethods);

        return F;

    }

    defineObject.extend = function(constructor, methods, staticMethods) {
            var E = defineObject(null,staticMethods);
            E.prototype = objectCreate(constructor.prototype);
            E.prototype.constructor = E;
            if (!E.prototype.__init__) {
                E.prototype.__init__ = constructor;
            }
            E.__super__ = constructor.prototype;
            if (constructor.__mixin__) E.__mixin__ = constructor.__mixin__.slice(0);
            if (constructor.__properties__) E.__properties__ = extend({},constructor.__properties__);
            if (methods) extend(E.prototype, methods);
            return E;
    };

    if (typeof exports !== 'undefined') {
        module.exports = exports = defineObject;
    } else {
        root.defineObject = defineObject;
    }

}).call(this);