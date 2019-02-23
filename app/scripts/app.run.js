(function () {
    'use strict';
    angular.module('lergoApp').run(function (Facebook) {
        if ( typeof(conf) !== 'undefined' ) {
            Facebook.init(conf.facebookAppId);
        }else{
            window.location='/error.html';
            throw new Error('service is down');
        }
    });
})();

