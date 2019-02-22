(function () {
    'use strict';

    angular.module('lergoApp').directive('facebook', function ($timeout, $window) {
        return {
            transclude: true,
            scope: {
                url: '='
            },
            templateUrl: 'views/directives/_facebook.html',
            link: function (scope, element) {
                $timeout(function () {
                    element.bind('click', function (e) {
                        $window.FB.ui({
                            method: 'share',
                            href: scope.url
                        });
                        e.preventDefault();
                    });
                });
            }
        };
    });
})();