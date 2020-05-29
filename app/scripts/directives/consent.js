'use strict';
angular.module('lergoApp')
    .directive('consent', function (localStorageService) {
        return {
            scope: {},
            templateUrl : 'views/directives/_consent.html',
            controller: function ($scope) {
                var _consent = localStorageService.get('consent');
                $scope.consent = function (consent) {
                    if (consent === undefined) {
                        return _consent;
                    } else if (consent) {
                        localStorageService.set('consent', true);
                        _consent = true;
                    }
                };
            }
        };
    });