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
    var DEFAULT_DELAY = 250; // in ms

    /**
     * DelayedCall is useful for 'coallescing' a series of multiple triggers 
     * into only a single resultant function call.
     * 
     * @param config When constructing a delayedCall a user should supply a
     * configuration object with the following key values:
     * 
     * - targetFunction (required) - this is the function that will be called 
     * after the delayedCall is triggered.
     * - delay (optional, defaults to 250ms) - this is the amount of time the
     * DelayedCall will wait after the last trigger before calling the 
     * targetFunction.
     * - args (optional, defaults to null) - this is a bound array of arguments
     * to be applied to the targetFunction when/if it gets called.
     * 
     * @constructor
     * 
     * @exports js/moxie/delayed_call
     */
    var DelayedCall = function(config) {
        if (config.hasOwnProperty('targetFunction')) {
            this._targetFunction = config['targetFunction'];
        } else {
            throw new Error(
                'DelayedCall MUST have a targetFunction supplied in it\'s ' +
                'constructor config!');
        }
        this._delay = config.hasOwnProperty('delay') ? config['delay'] : DEFAULT_DELAY;
        this._thisObject = config.hasOwnProperty('thisObject') ? config['thisObject'] : null;
        this._args = config.hasOwnProperty('args') ? config['args'] : null;
        this._timer = null;
    }

    DelayedCall.prototype = {
        /**
         * Trigger the call
         */
        trigger: function() {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            // TODO - function.bind is not available in all browsers
            this._timer = setTimeout(this.fire.bind(this), this._delay);
        },
        /**
         * Causes the bound target function to be called.  Typically this is 
         * called indirectly by calling trigger.
         * @param event
         */
        fire: function(event) {
            this._targetFunction.apply(this._thisObject, this._args);
        },
        /**
         * Clears any currently running delayedCall and unbinds all variables 
         * and references the DelayedCall has to the targetFunction and supplied
         * arguments.  
         * 
         * It is recommended to run this when finished with the delayedCall to 
         * help avoid memory leaks and simplify GC of user agent. 
         */
        dispose: function() {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            this._targetFunction = null;
            this._delay = null;
            this._thisObject = null;
            this._args = null;
        }
    }
    return DelayedCall;
});