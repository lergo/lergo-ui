'use strict';

angular.module('lergoApp')
    .controller('MainCtrl', function ($scope) {
        $scope.pages = [
            { 'href':'#homepage', 'title':'Homepage'}
        ];
    });
