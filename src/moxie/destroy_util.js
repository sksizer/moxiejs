define([], function() {

    /**
     * DestroyUtil provides destruction functions to make a browser GC algorithm's
     * life easier.
     * 
     * @exports js/moxie/destroy_util
     */
    var DestroyUtil = {
        /**
         * Given target object this function will perform a delete on all it's
         * properties.
         *
         * @param {Object} obj Target object to extinguish
         */
        destroy: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    delete obj[prop];
                    if (obj.hasOwnProperty(prop)) {
                        throw new Error("Couldn't delete a component " + prop);
                    }
                }
            }
        }
    };

    return DestroyUtil;
});