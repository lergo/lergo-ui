'use strict';

angular.module('lergoApp')
    .controller('KitchenSinkCtrl', function ($scope) {
        $scope.hello='world';

        $scope.scrollToTop = function() {
            document.body.scrollTop = 0;
        };
    });
