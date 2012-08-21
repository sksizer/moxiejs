define(function() {
	var MoxieMath = {};
	MoxieMath.boundValues =  function(bottomBounds, upperBounds, newNumber) {
		if (newNumber < bottomBounds)
			return bottomBounds;
		if (newNumber > upperBounds)
			return upperBounds;
		return newNumber
	}

	return MoxieMath;
})