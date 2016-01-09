'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:goToMyLessonsDemo
 * @description
 * # goToMyLessonsDemo
 */
angular.module('lergoApp')
    .directive('goToMyLessonsDemo', function (LergoClient, $modal) {
        return {
            templateUrl: 'views/demos/goToMyLessonsDemo.html',
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

                var modalInstance;
                scope.openGoToMyLessonsDemoDialog = function () {
                    modalInstance = $modal.open({
                        templateUrl: 'goToMyLessonsDemoDialog.html',
                        size: 'lg',
                        windowClass: 'go-to-my-lessons-demo-dialog',
                        scope: scope
                    });
                };

                scope.okGotIt = function () {
                    modalInstance.dismiss();
                };

                scope.dontShowAgain = function(){
                    debugger;
                };

                LergoClient.lessons.getStats().then(function (result) {
                    try {
                        if (result.data.myLessons > 0) {
                            scope.openGoToMyLessonsDemoDialog();
                        }
                    } catch (e) {
                    }
                });
            }
        };
    });
