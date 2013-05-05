/*
 * Copyright (c) 2012 Shane Sizer, Dominic Frost
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

//this is the file used in the reference viewer
define([
    'jquery',
    'js/moxie/requestAnimationFrame'
], function(
    $,
    requestAnimationFrame
) {

    'use strict';
    var YELLOW = '#fff68f';
    var LIGHT_BLUE = '#6abedb';
    var RED = '#a92f41';
    var BLACK = '#252120';
    var WHITE = '#e5dfc5';


    //Constructor
    var PerfMon = function(fpsSpan) {
        this.$fpsSpan = fpsSpan;
    };

    PerfMon.prototype = {
        _initialize: function() {

            this.animOpen = false;               //boolean for turning animation frame on/off
            this.frameOn = true;                //boolean for running the frame rate program
            this.startTime = Date.now();
            this.currentTime = null;
            this.duration = null;
            this.fps = null;
            this.fpsLast = 0;
            this.framesCounter = 0;

            this._createVisualizer();
            this.hideVisualizer();

            requestAnimationFrame(this.update.bind(this));
        },

        _createVisualizer: function() {

            this.fpsLast = 0;
            this.arr5s = [];
            this.fps5s = 0;
            this.fps5sLast = 0;
            this.arr10s = [];
            this.fps10s = 0;
            this.fps10sLast = 0;

            // CREATE UI ELEMENTS
            this.fpsValueMeter = $(this.$fpsSpan, this._container);


            // LABELS AND AXIS
            this._container.append('<canvas class="perfMon overlay" id="fpsScreenOverlay" width="300" height="240"></canvas>');
            var fpsScreenOverlay = $('#fpsScreenOverlay', this._container);
            var fpsScreenOverlayContext = fpsScreenOverlay[0].getContext('2d');

            this._container.append('<canvas class="perfMon overlay" id="fpsScreen" width="300" height="240"></canvas>');

            this.totalContentHeight = 240;
            this.totalContentWidth = 300;
            this.totalGraphHeight = 200;
            this.topMargin = 10;
            this.leftMargin = 30;
            this.rightMargin = 10;
            this.bottomMargin = 10;

            // DRAW LABELS
            var textVerticalCenterOffset = 3;
            fpsScreenOverlayContext.fillStyle = BLACK;
            fpsScreenOverlayContext.lineWidth = .7;
            fpsScreenOverlayContext.fillRect(0, 0, this.totalContentWidth, this.totalContentHeight);
            fpsScreenOverlayContext.fillStyle = WHITE;
            fpsScreenOverlayContext.fillText('60fps', 2, this.topMargin + 25 + textVerticalCenterOffset);
            fpsScreenOverlayContext.fillText('30fps', 2, (this.totalGraphHeight + 25) / 2 + textVerticalCenterOffset);
            fpsScreenOverlayContext.fillText('0fps', 2, this.totalGraphHeight - this.bottomMargin + textVerticalCenterOffset);

            // DRAW LINES
            fpsScreenOverlayContext.strokeStyle = WHITE;
            fpsScreenOverlayContext.translate(this.leftMargin, 0);
            this.graphWidth = this.totalContentWidth - this.leftMargin - this.rightMargin;

            fpsScreenOverlayContext.moveTo(0, this.topMargin + 25);
            fpsScreenOverlayContext.lineTo(this.graphWidth, this.topMargin + 25);

            fpsScreenOverlayContext.moveTo(this.graphWidth, (this.totalGraphHeight + 25) / 2 + .5);
            fpsScreenOverlayContext.lineTo(0, (this.totalGraphHeight + 25) / 2 + .5);


            fpsScreenOverlayContext.moveTo(this.graphWidth, this.totalGraphHeight - this.bottomMargin);
            fpsScreenOverlayContext.lineTo(0, this.totalGraphHeight - this.bottomMargin);

            fpsScreenOverlayContext.stroke();

            //DRAW LEGEND
            fpsScreenOverlayContext.fillStyle = WHITE;
            fpsScreenOverlayContext.fillRect(-15, 205, 20, 20);
            fpsScreenOverlayContext.fillText('Current', 10, 215 + textVerticalCenterOffset);
            fpsScreenOverlayContext.fillRect(70, 205, 20, 20);
            fpsScreenOverlayContext.fillText('5s Average', 95, 215 + textVerticalCenterOffset);
            fpsScreenOverlayContext.fillRect(170, 205, 20, 20);
            fpsScreenOverlayContext.fillText('10s Average', 195, 215 + textVerticalCenterOffset);

            fpsScreenOverlayContext.fillStyle = BLACK;
            fpsScreenOverlayContext.fillRect(-14, 206, 18, 18);
            fpsScreenOverlayContext.fillRect(71, 206, 18, 18);
            fpsScreenOverlayContext.fillRect(171, 206, 18, 18);

            fpsScreenOverlayContext.fillStyle = YELLOW;
            fpsScreenOverlayContext.fillRect(-13, 207, 16, 16);
            fpsScreenOverlayContext.fillStyle = LIGHT_BLUE;
            fpsScreenOverlayContext.fillRect(72, 207, 16, 16);
            fpsScreenOverlayContext.fillStyle = RED;
            fpsScreenOverlayContext.fillRect(172, 207, 16, 16);


            //fpsScreenOverlayContext.fillRect();

            var fps = document.getElementById('fpsScreen');
            this.fpsContext = fps.getContext('2d');
            this.fpsContext.translate(this.leftMargin, 0);
        },

        showVisualizer: function() {
            // SHOW UI ELEMENTS
            this.animOpen = true;
            this._container.show();
        },

        hideVisualizer: function(){
            // HIDE UI ELEMENTS
            this.animOpen = false;
            this._container.hide();
        },

        update: function(/*time*/) {
            this._tick();
            if(!this.frameOn)
                return;
            requestAnimationFrame(this.update.bind(this));
        },

        _tick: function() {
            this.framesCounter++;
            this.currentTime = Date.now();
            this.duration = this.currentTime - this.startTime;

            //UPDATE THE VISUALIZATION FRAME ONCE EVERY SECOND
            if (this.duration > 1000) {
                this.fps = Math.round(100 * this.framesCounter / (this.duration / 1000)) / 100;
                this.fpsValueMeter = this.$fpsSpan.html(this.fps);

                //CHECK IF VISUALIZER IS OPEN
                if(this.animOpen) {
                    this.isFrozen = Math.round(this.duration/1000);

                    //RUN THIS LOOP ONCE FOR EACH SECOND SINCE THE LAST VISUALIZER UPDATE
                    for(var i = 0; i < this.isFrozen; i++){
                        if(this.isFrozen > 1)
                            this.fps = 0;

                        //SHIFT FRAME LEFT 5px
                        var frame = this.fpsContext.getImageData(35, 0, this.graphWidth+1, this.totalGraphHeight);
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

                        //DRAW LINE BETWEEN POINTS (10s AVG)
                        this.fpsContext.lineWidth = 2.0;
                        this.fpsContext.strokeStyle = RED;
                        this.fpsContext.beginPath();
                        this.fpsContext.moveTo(255, this.totalGraphHeight - this.bottomMargin - this.fps10sLast / 70 * 180);
                        this.fpsContext.lineTo(260, this.totalGraphHeight - this.bottomMargin - this.fps10s / 70 * 180);
                        this.fpsContext.stroke();

                        //DRAW LINE BETWEEN POINTS (5s AVG)
                        this.fpsContext.lineWidth = 2.0;
                        this.fpsContext.strokeStyle = LIGHT_BLUE;
                        this.fpsContext.beginPath();
                        this.fpsContext.moveTo(255, this.totalGraphHeight - this.bottomMargin - this.fps5sLast / 70 * 180);
                        this.fpsContext.lineTo(260, this.totalGraphHeight - this.bottomMargin - this.fps5s / 70 * 180);
                        this.fpsContext.stroke();

                        //DRAW LINE BETWEEN POINTS (1s AVG)
                        this.fpsContext.lineWidth = 2.0;
                        this.fpsContext.strokeStyle = YELLOW;
                        this.fpsContext.beginPath();
                        this.fpsContext.moveTo(255, this.totalGraphHeight - this.bottomMargin - this.fpsLast / 70 * 180);
                        this.fpsContext.lineTo(260, this.totalGraphHeight - this.bottomMargin - this.fps / 70 * 180);
                        this.fpsContext.stroke();

                        this.fpsLast = this.fps;
                        this.fps5sLast = this.fps5s;
                        this.fps10sLast = this.fps10s;
                        this.fps5s = 0;
                        this.fps10s = 0;
                        }
                    }
                this.startTime = Date.now();
                this.framesCounter = 0;
            }
        },

        setContainer: function(container) {
            this._container = container;
            this._initialize();
            return this;
        }
    }
    return PerfMon;
});
