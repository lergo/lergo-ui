'use strict';

angular.module('lergoApp')
    .controller('KitchenSinkCtrl', function ($scope, $timeout) {
        $scope.tags = [];
        $scope.progressBarValue = 10;



        function increase(){
            $scope.progressBarValue += 10;
            $timeout(increase, 1000)
        }

        $timeout(increase, 1000)

    });
