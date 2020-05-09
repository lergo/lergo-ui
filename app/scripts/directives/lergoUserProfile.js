'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:lergoUserProfile
 * @description
 * # lergoUserProfile
 */
angular.module('lergoApp')
    .directive('lergoUserProfile', function (LergoClient, $location, $rootScope, ContinuousSave, localStorageService) {
        return {
            templateUrl: 'views/users/_profile.html',
            restrict: 'A',
            link: function postLink($scope, element, attrs) {

                var Modes = {
                    PUBLIC: 'public',
                    PRIVATE: 'private',
                    ANONYMOUS: 'anonymous'
                };

                $scope.$watch(function(){
                    return attrs.mode;
                }, function(){
                    $scope.mode = attrs.mode; // 'private' or 'public'
                });




                var saveProfile = new ContinuousSave({
                    'saveFn': function (value) {
                        return LergoClient.users.update(value);
                    }
                });

                $scope.toggleEdit = function(){
                    $scope.isEditAllow=!$scope.isEditAllow;
                };

                $scope.showStats = function(){
                    return $scope.mode !== Modes.ANONYMOUS;
                };

                $scope.getLessonsCount = function () {
                    if ( !$scope.user || !$scope.user.stats  ){
                        return null;
                    }
                    if ($scope.mode === Modes.PUBLIC) {
                        return $scope.user.stats.publicLessonsCount;
                    } else if ($scope.mode === Modes.PRIVATE) {
                        return $scope.user.stats.allLessonsCount;
                    }
                };

                $scope.getQuestionsCount = function () {
                    if ( !$scope.user || !$scope.user.stats  ){
                        return null;
                    }
                    if ($scope.mode === Modes.PUBLIC) {
                        return $scope.user.stats.publicQuestionsCount;
                    } else if ($scope.mode === Modes.PRIVATE) {
                        return $scope.user.stats.allQuestionsCount;
                    }
                };


                $scope.getCreatedByFilter = function(){
                    if ( $scope.user ) {
                        return JSON.stringify({_id: $scope.user._id, username: $scope.user.username});
                    }
                };

                $scope.getCreatedByAllFilter = function(){
                    if ( $scope.user ) {
                        return JSON.stringify({_id: $scope.user._id, username: $scope.user.username});
                    }
                };

                $scope.userCanEdit = function(){
                    return $scope.mode === Modes.PRIVATE;
                };


                LergoClient.users.getProfile(attrs.username).then(function (result) {
                    $scope.user = result.data;
                    if ($scope.userCanEdit()) { // watch for changes
                        $scope.$watch('user', saveProfile.onValueChange, true);
                    }
                });

                $scope.showPublicQuestion = function () {
                    localStorageService.set('questionTypeToLoad', 'allQuestions');
                    $location.path('/user/create/questions').search('lergoFilter.createdBy', JSON.stringify({
                        _id: $scope.user._id,
                        username: $scope.user.username
                    }));
                };

            }
        };
    });
