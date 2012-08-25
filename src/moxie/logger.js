define(function() {
	var Logger = function(category) {
		
		this._category = category;
		
		this._createMessage = function(message) {
			return this._category + ' : ' + message;
		}
		
		var hasDebug = console && console.debug;
		
		this.debug = function(message) {
			var formattedMessage = this._createMessage(message);
			if (hasDebug)
				console.debug(formattedMessage);
			else
				console.log(formattedMessage);
		}
	}
	return Logger;
});