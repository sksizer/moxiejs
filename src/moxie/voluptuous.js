define(function() {
    var Voluptuous = {
        checkValuesInArray: function(testArray, throwError) {
            if (throwError === undefined) {
                throwError = false;
            }
            
            for (var i = 0; i < testArray.length; i++) {
                var obj = testArray[i];
                if (obj === null || obj === undefined) {
                    if (throwError) {
                        throw new Error('Voluptuous failed on ' + ' of ' + testArray);
                    }
                    return false;
                }
            }
            return true;
        },
        validateNumber: function(testNumber, throwError) {
            if (typeof testNumber === 'number' && !isNaN(testNumber)) {
                return true
            } else {
                if (throwError) {
                    throw new Error('Voluptuous failed on number ' + testNumber);
                } else {
                    return false;
                }
            }
        }
    }
    return Voluptuous;
});