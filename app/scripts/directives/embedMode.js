(function () {
    'use strict';

    angular.module('lergoApp')
        .directive('embedMode', function ($window, $log, $routeParams) {
            return {
                restrict: 'A',
                link: function postLink(scope, element/*, attrs*/) {
                    if ($window.parent !== $window || $routeParams.embed === 'true') {
                        scope.embeddedMode = true;
                        $(element).addClass('lergo-embed-mode');

                        var dimensions = [0, 0];
                        scope.$watch(function () {

                            dimensions[0] = $(element).width();
                            dimensions[1] = $(element).height();
                            return dimensions;
                        }, function (newValue, oldValue) {
                            try {
                                if (!!newValue && newValue !== oldValue) {
                                    $window.parent.postMessage({ 'name': 'lergo_size_change', 'data': { 'width': dimensions[0], 'height': dimensions[1] } }, /*$window.location.origin*/ '*');

                                }
                            } catch (e) {
                                $log.error('unable to set height/width on location.search', e);
                            }
                        }, true);

                    }


                }
            };
    });
})();
