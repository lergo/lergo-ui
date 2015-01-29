'use strict';

angular.module('lergoApp')
    .directive('lergoProgressBar', function ($log) {
        return {
            template: '<div class="lergo-progress-bar"><div class="lergo-progress-bar-inner progress-bar-success" style="width:0;">&nbsp;{{progress}}%</div></div>',
            restrict: 'A',
            scope: {
                value: '=',
                ready: '&ngReady'
            },
            link: function postLink(scope, element, attrs) {
                var id = new Date().getTime();
                var maxValue = attrs.maxValue || 100;
                var minValue = attrs.minValue || 0;


                scope.$watch('value', function (newValue, oldValue) {

                    $log.info('value has changed', newValue, oldValue, ' id ', id);
                    if (!!newValue) {
                        newValue = Math.min(newValue, maxValue);
                        newValue = Math.max(newValue, minValue);

                        scope.progress = +(100 * newValue / (maxValue - minValue)).toFixed(2);
                        if (newValue !== oldValue) {
                            $(element).find('.lergo-progress-bar-inner').animate({'width': scope.progress + '%'}, 600, 'linear');
                        } else { // initialization issues with angular. first time fired same value will be given.
                            $(element).find('.lergo-progress-bar-inner').css({'width': scope.progress + '%'});
                            scope.ready();
                        }
                    } else {
                        $(element).find('.lergo-progress-bar-inner').css({'width': '0'});
                        scope.ready();
                    }
                });




            }
        };
    });
