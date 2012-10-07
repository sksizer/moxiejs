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

define(['js/moxie/request_animation_frame'], function(requestAnimationFrame) {
    var GreenThreader = function() {
        this._running = false;
        this._tasks = [];
    }

    GreenThreader.prototype._tick = function(time) {
        var nextTask;
        var startTime = Date.now();
        var currentTime = Date.now();
        var count = 0;
        while (this._tasks.length > 0 && currentTime - startTime < 16) {
            nextTask = this._tasks.pop();
            nextTask.apply(null);
            currentTime = Date.now();
            count++;
        }

        console.log('Called in execution: ' + count);

        if (this._tasks.length > 0)
            requestAnimationFrame(this._tick.bind(this));
        else
            this._running = false;
    }

    GreenThreader.prototype.addTask = function(aCallback) {
        this._tasks.push(aCallback);
        if (!this._running) {
            this._running = true;
            requestAnimationFrame(this._tick.bind(this));
        }

    }
    return new GreenThreader();
});