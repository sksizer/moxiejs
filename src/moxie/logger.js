/*
 * Copyright (c) 2012 Shane Sizer
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

define(function() {
    var _DEBUG 	= console && console.debug 	? function(message) {console.debug(message) } 	: function(message) {console.log('Debug: ' + message)};
    var _INFO 	= console && console.info 	? function(message) {console.info(message)} 	: function(message) {console.log('Info: ' + message)};
    var _WARN	= console && console.warn 	? function(message) {console.warn(message)} 	: function(message) {console.warn('WARNING: ' + message)}
    var _ERROR	= console && console.error 	? function(message) {console.error(message)}	: function(message) {console.log('ERROR: ' + message)};

    var Logger = function(category) {
        this._initialize(category);
    }

    Logger.prototype = {
        _category: null,
        _enabled: false,
        _initialize: function(category) {
            this._category = category;
        },
        _createMessage: function(message) {
            return this._category + ' : ' + message;
        },

        //--------------------------------------------------------------------------
        //
        // API
        //
        //--------------------------------------------------------------------------

        debug: function(message) {
            if (!this._enabled) return;
            _DEBUG(this._createMessage(message));
        },
        info: function(message) {
            if (!this._enabled) return;
            _INFO(this._createMessage(message));
        },
        warn: function(message) {
            if (!this._warn) return;
            _WARN(this._createMessage(message));
        },
        error: function(message) {
            if (!this._enabled) return;
            _ERROR(this._createMessage(message));
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