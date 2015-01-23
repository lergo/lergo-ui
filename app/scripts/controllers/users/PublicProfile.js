'use strict';

angular.module('lergoApp').controller('UsersPublicProfileCtrl', function ($scope, LergoClient, $routeParams) {
    var username = $routeParams.username;

    LergoClient.users.getPublicProfile(username).then(function (result) {
        $scope.user = result.data;
    });

});
