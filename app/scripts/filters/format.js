(function () {
    'use strict';

    angular.module('lergoApp')
        .filter('format', function () {
            return function (input, values) {
                return input.format(values);
            };
        });
})();
