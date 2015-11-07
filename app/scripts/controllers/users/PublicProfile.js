'use strict';

angular.module('lergoApp').controller('UsersPublicProfileCtrl', function ($scope, LergoClient, $routeParams, $location, localStorageService) {
    var username = $routeParams.username;

    LergoClient.users.getPublicProfile(username).then(function (result) {
        $scope.publicUser = result.data;
    });

    $scope.showPublicQuestion = function () {
        localStorageService.set('questionTypeToLoad', 'allQuestions');
        $location.path('/user/create/questions').search('lergoFilter.createdBy', JSON.stringify({
            _id: $scope.publicUser._id,
            username: $scope.publicUser.username
        }));
    };
});
