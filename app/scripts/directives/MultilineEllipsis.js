'use strict';

angular.module('lergoApp')
    .directive('multilineEllipsis', function () {
        return {
            template: '<p ng-transclude></p>',
            transclude:true,
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {

                function truncate(index, text) {
                    return text.replace(/\W*\s(\S)*$/, '...');
                }

                scope.$watch(function(){ return element.text(); }, function(){
                    var $p = $(element.find('p'));
                    var divh = $(element).height();
                    while ($p.outerHeight() > divh) {
                        $p.text(truncate);
                    }
                });
            }
        };
    }
);

