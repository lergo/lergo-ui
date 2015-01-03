'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:reportLessonFilter
 * @description
 * # reportLessonFilter
 */
angular.module('lergoApp')
    .directive('reportLessonFilter', function (ReportsService, $log) {
        return {
            templateUrl: 'views/directives/_reportLessonFilter.html',
            restrict: 'A',
            scope: {
                'model': '=reportLessonFilter'
            },
            link: function postLink(scope) {
                scope.getReportLessonsLike = function (like) {
                    $log.debug('getting lesson like', like);
                    return ReportsService.findLesson(like).then(function (result) {
                        return result.data;
                    });
                };

                scope.addReportLessonFromTypeahead = function ($item) {
                    scope.model = $item;
                };

                try {
                    scope.newLesson = scope.model.name;
                } catch (e) {
                }
            }
        };
    });
