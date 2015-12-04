'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:lergoUserProfile
 * @description
 * # lergoUserProfile
 */
angular.module('lergoApp')
    .directive('lergoUserProfile', function (LergoClient, $location, ContinuousSave, localStorageService) {
        return {
            templateUrl: 'views/users/_profile.html',
            restrict: 'A',
            link: function postLink($scope, element, attrs) {

                var Modes = {
                    PUBLIC: 'public',
                    PRIVATE: 'private'
                };

                $scope.$watch(function(){
                    return attrs.mode;
                }, function(){
                    $scope.mode = attrs.mode; // 'private' or 'public'
                });


                $scope.$watch(function(){
                    return attrs.canEdit;
                }, function( ){
                    $scope.userCanEdit = attrs.canEdit === 'true';
                });

                var saveProfile = new ContinuousSave({
                    'saveFn': function (value) {
                        return LergoClient.users.update(value);
                    }
                });

                $scope.toggleEdit = function(){
                    $scope.isEditAllow=!$scope.isEditAllow;
                };

                $scope.getLessonsCount = function () {

                    if (!$scope.user || !$scope.user.stats) {
                        return '';
                    }
                    if ($scope.mode === Modes.PUBLIC) {
                        return $scope.user.stats.publicLessonsCount;
                    } else {
                        return $scope.user.stats.allLessonsCount;
                    }
                };

                $scope.getQuestionsCount = function () {
                    if (!$scope.user || !$scope.user.stats) {
                        return '';
                    }
                    if ($scope.mode === Modes.PUBLIC) {
                        return $scope.user.stats.publicQuestionsCount;
                    } else {
                        return $scope.user.stats.allQuestionsCount;
                    }
                };


                $scope.getCreatedByFilter = function(){
                    if ( $scope.user ) {
                        return JSON.stringify({_id: $scope.user._id, username: $scope.user.username});
                    }
                };


                LergoClient.users.getProfile(attrs.username).then(function (result) {
                    $scope.user = result.data;
                    console.log('got user', result.data);
                    if ($scope.userCanEdit) { // watch for changes
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
