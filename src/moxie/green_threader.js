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
		while (this._tasks.length>0 && currentTime - startTime < 16) {
			nextTask = this._tasks.pop();
			nextTask.apply(null);
			currentTime = Date.now();
			count++;
		}

		console.log('Called in execution: ' + count);
		
		if (this._tasks.length>0)
			requestAnimationFrame(this._tick.bind(this));
		else
			this._running = false;
	}

	GreenThreader.prototype.addTask = function(aCallback) {
		this._tasks.push(aCallback);
		if (!this._running)
		{
			this._running = true;
			requestAnimationFrame(this._tick.bind(this));
		}

	}
	return new GreenThreader();
});