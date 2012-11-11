define([], function () {
    /**
     * @type {Object}
     * 
     * @exports js/moxie/DestroyUtil
     */
    DestroyUtil = {
        /**
         * Given target object this function will perform a delete on all it's
         * properties.
         * 
         * @param obj
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