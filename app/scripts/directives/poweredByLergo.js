(function () {
    'use strict';

    angular.module('lergoApp')
        .directive('poweredByLergo', function (LessonsService) {
            return {
                template: '<div class="embed-mode-item watch-on-lergo"> <a  href="{{shareLink}}" target="_blank">{{"powered.by.lergo"|translate}}</a> </div>',
                restrict: 'A',
                scope: {
                    'lesson': '=poweredByLergo'
                },
                link: function postLink(scope/*, element, attrs*/) {
                    scope.$watch('lesson', function (newValue) {
                        if (!!newValue) {
                            scope.shareLink = LessonsService.getShareLink(scope.lesson);
                        }
                    });
                }
            };
    });
})();
