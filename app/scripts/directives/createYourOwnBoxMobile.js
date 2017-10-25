
'use strict';

angular.module('lergoApp')
    .directive('createYourOwnBoxMobile', function (LergoClient, $location, $log) {
        return {
            templateUrl: 'views/directives/_createYourOwnBoxMobile.html',
            restrict: 'A',
            link: function postLink($scope/*, element, attrs*/) {
                $scope.create = function () {
                    $scope.createBtnDisable=true;
                    LergoClient.lessons.create().then(function (result) {
                        var lesson = result.data;
                        $scope.errorMessage = null;
                        $location.path('/user/lessons/' + lesson._id + '/update');
                    }, function (result) {
                        $scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
                        $log.error($scope.errorMessage);
                        $scope.createBtnDisable=false;
                    });
                };
            }
        };
    });
