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

define([
], function(
) {
    'use strict';
    /**
     * Only one ObjectUtil module is instantiated.
     *
     * @exports js/moxie/object_util
     * @type {Object}
     * @alias module:js/moxie/object_util
     */
    var ObjectUtil = {
        /**
         * @function getConfig
         * @param {Object} target
         * @param {String} propName
         * @param {*} defaultValue
         * @param {Boolean} throwError
         * @return {*}
         */
        getConfig: function(target, propName, defaultValue, throwError) {
            if (target === null) {
                return defaultValue;
            }
            else if (target.hasOwnProperty(propName)) {
                return target[propName];
            }
            else if (throwError) {
                throw new Error('Required configuration parameter ' + propName +
                    ' was not provided.');
            }
            else {
                return defaultValue;
            }
        },

        // Usage: dump(object)
        // TODO - found and modified this from somewhere - find original attribution
        // TODO:  What about JSON.stringify?
        /**
         * Produces a console friendly string output.
         *
         * @static
         * @function dump
         * @param {Object} object
         * @param {String} pad
         * @return {String}
         */
        dump: function(object, pad) {
            var i = null;
            var indent = '\t';
            if (!pad) { pad = ''; }
            var out = '';
            if (object.constructor === Array) {
                out += '[\n';
                for (i = 0; i < object.length; i++) {
                    out += pad + indent + ObjectUtil.dump(object[i], pad + indent) + '\n';
                }
                out += pad + ']';
            }
            else if (object.constructor === Object) {
                out += '{\n';
                for (i in object) {
                    if (object.hasOwnProperty(i)) {
                        out += pad + indent + i + ': ' + ObjectUtil.dump(object[i], pad + indent) + '\n';
                    }
                }
                out += pad + '}';
            }
            else {
                out += object;
            }
            return out;
        }
    };



    return ObjectUtil;
});
