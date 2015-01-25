'use strict';

angular.module('lergoApp').controller('UsersPublicProfileCtrl', function ($scope, LergoClient, $routeParams, $location, localStorageService) {
    var username = $routeParams.username;

    LergoClient.users.getPublicProfile(username).then(function (result) {
        $scope.user = result.data;
    });
    $scope.showPublicQuestion = function () {
        localStorageService.set('questionTypeToLoad', 'allQuestions');
        $location.path('/user/create/questions/').search('createdBy', $scope.user);
    };
});
