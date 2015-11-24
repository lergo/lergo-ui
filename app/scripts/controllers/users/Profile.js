'use strict';


/**
 *
 * @module ProfilePage
 *
 * @description displays user details, with the following distinctions
 *
 *  - username must appear in the case user originally entered it. not uppercase
 *  - when hovering on "questions" link it should say "only registered users can view questions..."
 *  - for users, page should show number of public questions/lessons and a tooltip stating this is the public questions/lessons count
 *  - should allow users to edit their own profile
 *  - profile should be displayed in 2 places in the app. 1) my personal space, 2) public profile for other users
 *
 */

angular.module('lergoApp').controller('UsersProfileCtrl', function ($scope, LergoClient, ContinuousSave, $location, localStorageService, $routeParams ) {
    $scope.isEditAllow = false;

    var saveProfile = new ContinuousSave({
        'saveFn': function (value) {
            return LergoClient.users.update(value);
        }
    });

    $scope.isMyProfile = !!$routeParams.username;
    var getProfilePromise = $scope.isMyProfile ? LergoClient.users.getPublicProfile($routeParams.username) : LergoClient.users.getMyProfile();

    getProfilePromise.then(function (result) {
        $scope.user = result.data;
        if ( $scope.isMyProfile ) { // watch for changes
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

});
