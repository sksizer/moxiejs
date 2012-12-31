/*
 * Copyright (c) 2012 Shane Sizer, Michael Paulson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF 
 * OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Provides abstracted logging facilities.
 *
 * @module js/moxie/logger
 */
define(function() {
    var _DEBUG 	= console && console.debug 	? function(message) {console.debug(message) } 	: function(message) {console.log('Debug: ' + message)};
    var _INFO 	= console && console.info 	? function(message) {console.info(message)} 	: function(message) {console.log('Info: ' + message)};
    var _WARN	= console && console.warn 	? function(message) {console.warn(message)} 	: function(message) {console.warn('WARNING: ' + message)}
    var _ERROR	= console && console.error 	? function(message) {console.error(message)}	: function(message) {console.log('ERROR: ' + message)};

    /**
     * Logger provides an abstract log message receiver.
     *
     * @param category
     * @constructor
     */
    var Logger = function(category, options) {
        this.filter = Logger.LEVEL_ALL;

        if (options) {
            if (options.filter !== undefined) {
                this.filter = options.filter;
            }
            
            if (options.enable !== undefined
                && options.enable) {
                this.enable();
            }
        }

        this._initialize(category);
    }

    Logger.LEVEL_DEBUG = 1;
    Logger.LEVEL_INFO = 2;
    Logger.LEVEL_WARNING = 4;
    Logger.LEVEL_ERROR = 8;
    Logger.LEVEL_ALL = Logger.LEVEL_DEBUG | Logger.LEVEL_INFO | Logger.LEVEL_WARNING | Logger.LEVEL_ERROR;
    Logger.LEVEL_WARNING_AND_ERROR = Logger.LEVEL_WARNING | Logger.LEVEL_ERROR;

    Logger.prototype = {
        _category: null,
        _enabled: false,
        _initialize: function (category) {
            this._category = category;
        },
        _createMessage: function(message) {
            var args = Array.prototype.slice.call(arguments);
            return this._category + ' : ' + args.join(' :');
        },

        //--------------------------------------------------------------------------
        //
        // API
        //
        //--------------------------------------------------------------------------

        debug: function(message) {
            if (!this._enabled || ~this.filter & Logger.LEVEL_DEBUG) return;
            _DEBUG(this._createMessage.apply(this, arguments));
        },
        info: function(message) {
            if (!this._enabled || ~this.filter & Logger.LEVEL_INFO) return;
            _INFO(this._createMessage.apply(this, arguments));
        },
        warn: function(message) {
            if (!this._warn || ~this.filter & Logger.LEVEL_WARNING) return;
            _WARN(this._createMessage.apply(this, arguments));
        },
        error: function(message) {
            if (!this._enabled || ~this.filter & Logger.LEVEL_ERROR) return;
            _ERROR(this._createMessage.apply(this, arguments));
        },
        disable: function() {
            this._enabled = false;
            return this;
        },
        enable: function() {
            this._enabled = true;
            return this;
        },
        dispose: function() {
            this._category = null;
        }
    }
    return Logger;
});