/**
 * @exports js/moxie/device_info
 */
define(function() {
    var DeviceInfo = {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio ? window.devicePixelRatio : 1,
        hasTouch: ('ontouchstart' in window),
        EVENTS: {
            WINDOW_RESIZE: ('ontouchstart' in window) ? 'orientationchange' : 'resize'
        }
    };
    return DeviceInfo;
});