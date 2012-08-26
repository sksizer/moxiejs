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
		_initialize: function (category) {
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