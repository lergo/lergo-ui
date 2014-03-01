'use strict';

angular.module('lergoApp')
    .directive('modalBackground', function () {
        return {
            template: '<div class="modal-cover"><div ng-transclude></div></div>',
            restrict: 'A',

            transclude: true,

            link: function (scope, element, attrs) {
                var cover = $('div', {'class': 'modal-cover'});

                attrs.$observe('flag', function (flag) {
                    if (flag) {
                        scope.$watch(attrs.flag, function (flag) {
                            console.log(['flag is ', flag, scope.flag]);
                            if (flag) {
                                console.log('appending');
                                $('body').append(cover);
                            } else {
                                console.log('not appending');
                                $(cover).remove();
                            }
                        });
                    }
                });
            }
        };
    });
