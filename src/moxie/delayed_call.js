define(function () {
	var DEFAULT_DELAY = 250;

	var DelayedCall = function (config) {
		if (config.hasOwnProperty('targetFunction'))
			this._targetFunction = config['targetFunction'];
		else
			throw new Error('Delayed call must provide target function!');
		this._delay = config.hasOwnProperty('delay') ? config['delay'] : DEFAULT_DELAY;
		this._thisObject = config.hasOwnProperty('thisObject') ? config['thisObject'] : null;
		this._args = config.hasOwnProperty('args') ? config['args'] : null;
		this._timer = null;
	}

	DelayedCall.prototype._init = function () {
	}

	DelayedCall.prototype.trigger = function () {
		if (this._timer)
		{
			clearTimeout(this._timer);
			this._timer = null;
		}
		this._timer = setTimeout(this.fire.bind(this), this._delay);
	}

	DelayedCall.prototype.fire = function (event) {
		this._targetFunction.apply(this._thisObject, this._args);
	}

	DelayedCall.prototype.dispose = function () {
		if (this._timer)
		{
			clearTimeout(this._timer);
			this._timer = null;
		}
		this._targetFunction = null;
		this._delay = null;
		this._thisObject = null;
		this._args = null;
	}
	return DelayedCall;
});