'use strict';
/**
 * Used to turn on logs in tests
 */
angular.module('lergoLogMock', []).run(function($log){

    $log.info = function () {
        console.log(_.map(arguments));
    };
    $log.debug = function () {
        if (console.debugOn) {
            console.debug(_.map(arguments));
        }
    };
    $log.error = function () {
        console.error(_.map(arguments));
    };
    $log.warn = function () {
        console.warn(_.map(arguments));
    };


});