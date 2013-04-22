/**
 * Created with PyCharm.
 * User: dominicfrost
 * Date: 4/17/13
 * Time: 7:54 PM
 * To change this template use File | Settings | File Templates.
 */

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

define(['jquery', 'js/moxie/requestAnimationFrame'], function($, requestAnimationFrame) {

    'use strict';

    var PerfMon = function() {
    };

    PerfMon.prototype._initialize = function() {
        this.startTime = Date.now();
        this.currentTime = null;
        this.duration = null;
        this.fps = null;
        this.fpsLast = 60;
        this.framesCounter = 0;
        this.lastTime = null;
        this.arr5s = [];
        this.fps5s = 0;
        this.fps5sLast = 60;
        this.arr10s = [];
        this.fps10s = 0;
        this.fps10sLast = 60;


        // DEFINE STYLES
        // - .perfMon
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.perfMon { font-family: "Helvetica" sans-serif; position: absolute; }';
        document.getElementsByTagName('head')[0].appendChild(style);

        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.overlay {top: 30px;}';
        document.getElementsByTagName('head')[0].appendChild(style);


        // CREATE UI ELEMENTS
        var container = $(this._container);
        container.append('<div id="fpsValueMeter" class="perfMon">FPS: <span id="fpsValue">0</span></div>');
        this.fpsValueMeter = $('#fpsValueMeter', container);

        // LABELS AND AXIS
        container.append('<canvas class="perfMon overlay" id="fpsScreenOverlay" width="300" height="200"></canvas>');
        var fpsScreenOverlay = $('#fpsScreenOverlay', container);
        var fpsScreenOverlayContext = fpsScreenOverlay[0].getContext('2d');

        container.append('<canvas class="perfMon overlay" id="fpsScreen" width="300" height="200"></canvas>');


        this.totalContentHeight = 200;
        this.totalContentWidth = 300;
        this.topMargin = 10;
        this.leftMargin = 30;
        this.rightMargin = 10;
        this.bottomMargin = 10;

        // DRAW LABELS
        var textVerticalCenterOffset = 3;
        fpsScreenOverlayContext.fillStyle = '#252120';
        fpsScreenOverlayContext.lineWidth = .7;
        fpsScreenOverlayContext.fillRect(0, 0, this.totalContentWidth, this. totalContentHeight);
        fpsScreenOverlayContext.fillStyle = '#e5dfc5'
        fpsScreenOverlayContext.fillText('60fps', 2, this.topMargin + 25 + textVerticalCenterOffset);
        fpsScreenOverlayContext.fillText('30fps', 2, (this.totalContentHeight + 25) / 2 + textVerticalCenterOffset);
        fpsScreenOverlayContext.fillText('0fps', 2, this.totalContentHeight - this.bottomMargin + textVerticalCenterOffset);

        // DRAW LINES
        fpsScreenOverlayContext.strokeStyle = '#e5dfc5';
        fpsScreenOverlayContext.translate(this.leftMargin, 0);
        this.graphWidth = this.totalContentWidth - this.leftMargin - this.rightMargin;

        fpsScreenOverlayContext.moveTo(0, this.topMargin + 25);
        fpsScreenOverlayContext.lineTo(this.graphWidth, this.topMargin + 25);

        fpsScreenOverlayContext.moveTo(this.graphWidth, (this.totalContentHeight + 25) / 2 + .5);
        fpsScreenOverlayContext.lineTo(0, (this.totalContentHeight + 25) / 2 + .5);


        fpsScreenOverlayContext.moveTo(this.graphWidth, this.totalContentHeight - this.bottomMargin);
        fpsScreenOverlayContext.lineTo(0, this.totalContentHeight - this.bottomMargin);

        fpsScreenOverlayContext.stroke();


        var fps = document.getElementById('fpsScreen');
        this.fpsContext = fps.getContext('2d');
        this.fpsContext.translate(this.leftMargin, 0);

        requestAnimationFrame(this.update.bind(this));
    };

    PerfMon.prototype.update = function(/*time*/) {
        this.tick();
        requestAnimationFrame(this.update.bind(this));
    };

    PerfMon.prototype.tick = function() {
        this.framesCounter++;
        this.currentTime = Date.now();
        this.duration = this.currentTime - this.startTime;
        if (this.duration > 1000) {

            this.isFrozen = Math.round(this.duration/1000);
            this.fps = Math.round(this.duration / 1000 * this.framesCounter * 100) / 100;
            this.fpsValueMeter.text(this.fps);

            for(var i = 0; i < this.isFrozen; i++){
                if(this.isFrozen > 1){
                    this.fps = 0;
                }
                console.log("FPS: " + this.fps);

                //SHIFT FRAME LEFT
                var frame = this.fpsContext.getImageData(35, 0, this.graphWidth+1, this.totalContentHeight);
                this.fpsContext.putImageData(frame, 30, 0);

                //ADD NEW FPS VALUE TO THE END OF THE ARRAYS
                this.arr10s.push(this.fps);
                this.arr5s.push(this.fps);

                //REMOVE OLDEST FPS VALUE FROM BEGINNING OF ARRAYS
                if(this.arr10s.length > 10)
                    this.arr10s.shift();
                if(this.arr5s.length > 5)
                    this.arr5s.shift();

                //AVERAGE THE FPS OVER 5s
                for(var j = 0; j < this.arr5s.length; j++){
                    this.fps5s += this.arr5s[j];
                }
                this.fps5s = this.fps5s/this.arr5s.length;

                //AVERAGE THE FPS OVER 10s
                for(j = 0; j < this.arr10s.length; j++){
                    this.fps10s += this.arr10s[j];
                }
                this.fps10s = this.fps10s/this.arr10s.length;

                //DRAW LINE BETWEEN POINTS (1s AVG)
                this.fpsContext.lineWidth = 2.0;
                this.fpsContext.strokeStyle = '#fff68f';
                this.fpsContext.beginPath();
                this.fpsContext.moveTo(255, this.totalContentHeight - this.bottomMargin - this.fpsLast / 70 * 180);
                this.fpsContext.lineTo(260, this.totalContentHeight - this.bottomMargin - this.fps / 70 * 180);
                this.fpsContext.stroke();

                //DRAW LINE BETWEEN POINTS (5s AVG)
                this.fpsContext.lineWidth = 2.0;
                this.fpsContext.strokeStyle = '#6abedb';
                this.fpsContext.beginPath();
                this.fpsContext.moveTo(255, this.totalContentHeight - this.bottomMargin - this.fps5sLast / 70 * 180);
                this.fpsContext.lineTo(260, this.totalContentHeight - this.bottomMargin - this.fps5s / 70 * 180);
                this.fpsContext.stroke();

                //DRAW LINE BETWEEN POINTS (10s AVG)
                this.fpsContext.lineWidth = 2.0;
                this.fpsContext.strokeStyle = '#a92f41';
                this.fpsContext.beginPath();
                this.fpsContext.moveTo(255, this.totalContentHeight - this.bottomMargin - this.fps10sLast / 70 * 180);
                this.fpsContext.lineTo(260, this.totalContentHeight - this.bottomMargin - this.fps10s / 70 * 180);
                this.fpsContext.stroke();



                this.fpsLast = this.fps;
                this.fps5sLast = this.fps5s;
                this.fps10sLast = this.fps10s;
                this.fps5s = 0;
                this.fps10s = 0;
                }
            this.startTime = Date.now();
            this.framesCounter = 0;
        }
    };

    PerfMon.prototype.setContainer = function(container) {
        this._container = container;
        this._initialize();
        return this;
    };

    return PerfMon;
});
