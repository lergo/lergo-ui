(function () {
    'use strict';

    angular.module('lergoApp')
        .controller('KitchenSinkCtrl', function ($scope, $window) {
            $scope.hello='world';
            $window.scrollTo(0, 0);
    });
})();
