define([
], function(
) {
    'use strict';
    /**
     * DestroyUtil provides destruction functions to make a browser GC algorithm's
     * life easier.
     */
    var DestroyUtil = {
        /**
         * Given target object this function will assign a null value on all of
         * it's properties.
         *
         * @param {Object} obj Target object to extinguish
         */
        destroy: function(obj) {
            for (var prop in obj) {
                // We only want to null out properties on instance (not in
                // prototype)
                if (obj.hasOwnProperty(prop)) {

                    // Per guidance here ->
                    // http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
                    // we just null out value (which actually shouldn't be
                    // necessary - but we're going to err on side of caution for now
                    obj[prop] = null;
                }
            }
        }
    };

    return DestroyUtil;
});
