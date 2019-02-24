(function () {
    'use strict';
    KitchenSinkCtrl.$inject = ['$scope', '$window'];
    function KitchenSinkCtrl($scope, $window) {
        $scope.hello='world';
        $window.scrollTo(0, 0);
    }
    angular.module('lergoApp')
        .controller('KitchenSinkCtrl', KitchenSinkCtrl);
})();
