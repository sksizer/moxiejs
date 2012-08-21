define([], function () {
	
	ObjectUtil = {};
	ObjectUtil.getConfig = function (target, propName, defaultValue, throwError) {
		if (target == null)
			return defaultValue
		else if (target.hasOwnProperty(propName))
			return target[propName];
		else if (throwError)
			throw new Error('Required configuration parameter ' + propName
				+ ' was not provided.');
		else
			return defaultValue;
	}

	// Usage: dump(object)
	ObjectUtil.dump = function (object, pad) {
		var indent = '\t'
		if (!pad) pad = ''
		var out = ''
		if (object.constructor == Array)
		{
			out += '[\n'
			for (var i = 0; i < object.length; i++)
			{
				out += pad + indent + ObjectUtil.dump(object[i], pad + indent) + '\n'
			}
			out += pad + ']'
		}
		else if (object.constructor == Object)
		{
			out += '{\n'
			for (var i in object)
			{
				out += pad + indent + i + ': ' + ObjectUtil.dump(object[i], pad + indent) + '\n'
			}
			out += pad + '}'
		}
		else
		{
			out += object
		}
		return out
	}

	return ObjectUtil;
});