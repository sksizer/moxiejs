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

define(['jquery', 
		'js/moxie/request_animation_frame'], 	function($, request_animation_frame) {

	var PerfMon = function() {
		
	}

	PerfMon.prototype._initialize = function() {
		this.startTime = Date.now();
		this.currentTime, this.duration, this.fps;
		this.framesCounter = 0;
		this.animationCounter = 0;
		this.lastTime;

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
		this.fpsValueMeter = $("#fpsValueMeter", container);
		
		container.append('<canvas class="perfMon overlay" id="fpsScreen" width="300" height="200"></canvas>');
		var fpsScreen = $('#fpsScreen', container);
		
		// LABELS AND AXIS
		container.append('<canvas class="perfMon overlay" id="fpsScreenOverlay" width="300" height="200"></canvas>');
		var fpsScreenOverlay = $('#fpsScreenOverlay', container);
		var fpsScreenOverlayContext = fpsScreenOverlay[0].getContext('2d');
		
		this.totalContentHeight = 200;
		this.totalContentWidth = 300;
		this.topMargin = 10;
		this.leftMargin = 30;
		this.rightMargin = 10;
		this.bottomMargin = 10;
		
		// DRAW LABELS
		var textVerticalCenterOffset = 3;
		fpsScreenOverlayContext.fillStyle = "black"; 
		fpsScreenOverlayContext.lineWidth = 1.0;
		fpsScreenOverlayContext.fillText('60fps', 0, this.topMargin+textVerticalCenterOffset);
		fpsScreenOverlayContext.fillText('30fps', 0, this.totalContentHeight/2+textVerticalCenterOffset);
		fpsScreenOverlayContext.fillText('0fps', 0, this.totalContentHeight-this.bottomMargin+textVerticalCenterOffset);
	
		// DRAW LINES
		fpsScreenOverlayContext.translate(this.leftMargin,0);
		this.graphWidth = this.totalContentWidth - this.leftMargin - this.rightMargin;
		fpsScreenOverlayContext.moveTo(0,this.topMargin);
		fpsScreenOverlayContext.lineTo(this.graphWidth,this.topMargin);
	
		fpsScreenOverlayContext.moveTo(this.graphWidth,this.totalContentHeight/2);
		fpsScreenOverlayContext.lineTo(0,this.totalContentHeight/2);
	
		fpsScreenOverlayContext.moveTo(this.graphWidth,this.totalContentHeight-this.bottomMargin);
		fpsScreenOverlayContext.lineTo(0,this.totalContentHeight-this.bottomMargin);
	
		fpsScreenOverlayContext.stroke();
	
		var fps = document.getElementById('fpsScreen');
		this.fpsContext = fps.getContext('2d');
		this.fpsContext.translate(this.leftMargin,0);

		request_animation_frame(this.update.bind(this));
	}
	
	PerfMon.prototype.update = function(time) {
		this.tick();
		request_animation_frame(this.update.bind(this));
	}
	
	// PROBABLY DEPRECATED
	PerfMon.prototype.tickBound = function() {
		return this.tick.bind(this);
	}
	
	PerfMon.prototype.tick = function() {
		this.framesCounter++;
		this.currentTime = Date.now();
		this.duration = this.currentTime - this.startTime;
		if (this.duration > 1000)
		{
			this.fps = Math.round(this.duration/1000 * this.framesCounter * 100)/100;
			console.log("FPS: " + this.fps);
			this.fpsValueMeter.text(this.fps);

			// Opaque the existinglines
			this.fpsContext.fillStyle = "rgba(255, 255, 255," + String(1/(this.graphWidth)*1.4) + ")";
			this.fpsContext.fillRect(0,0,this.graphWidth,this.totalContentHeight - this.bottomMargin) ;
			
			var xValue = this.animationCounter % this.graphWidth + .5;
			this.fpsContext.lineWidth = 1.0;
			this.fpsContext.strokeStyle = "red";
			this.fpsContext.beginPath();
			this.fpsContext.moveTo(xValue,this.totalContentHeight - this.bottomMargin);
			this.fpsContext.lineTo(xValue,this.totalContentHeight - this.bottomMargin-this.fps/60*180);
			this.fpsContext.stroke();
			this.fpsContext.strokeStyle = "white";
			this.fpsContext.beginPath();
			this.fpsContext.moveTo(xValue+1,this.totalContentHeight - this.bottomMargin);
			this.fpsContext.lineTo(xValue+1,10);
			this.fpsContext.stroke();

			this.startTime = Date.now();
			this.framesCounter = 0;
			
			this.animationCounter++;
			if (this.animationCounter>this.graphWidth-1)
			{
				this.animationCounter = 0;
			}
		}
	}
	
	PerfMon.prototype.setContainer = function(container) {
		this._container = container;
		this._initialize();
		return this;
	}
	
	return PerfMon;
});