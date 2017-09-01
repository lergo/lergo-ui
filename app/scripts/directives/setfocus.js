'use strict';

angular.module('lergoApp').directive('setFocus', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.setFocus);
            scope.$watch(model, function(value) {
                if ( value ) {
                    $timeout(function() {
                        // We must reevaluate the value in case it was changed by a subsequent
                        // watch handler in the digest. - angularjs $digest document
                        if ( scope.model) {
                            element[0].focus();
                        }
                    }, 0, false);
                }
            });
            element.bind('blur', function() {
                $timeout(function() {
                    if (!!model) {
                        scope.$apply(model.assign(scope, false));
                    }
                });
            });
        }
    };
});


