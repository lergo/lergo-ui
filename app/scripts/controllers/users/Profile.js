'use strict';

angular.module('lergoApp').controller('UsersProfileCtrl', function ($scope, LergoClient, ContinuousSave, $location, localStorageService) {
    $scope.isEditAllow = false;

    var saveProfile = new ContinuousSave({
        'saveFn': function (value) {
            return LergoClient.users.update(value);
        }
    });

    LergoClient.users.getMyProfile().then(function (result) {
        $scope.user = result.data;
        $scope.$watch('user', saveProfile.onValueChange, true);
    });

    $scope.showPublicQuestion = function () {
        localStorageService.set('questionTypeToLoad', 'allQuestions');
        $location.path('/user/create/questions').search('lergoFilter.createdBy', JSON.stringify({
            _id: $scope.user._id,
            username: $scope.user.username
        }));
    };

});
