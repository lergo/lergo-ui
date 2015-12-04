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

angular.module('lergoApp').controller('UsersProfileCtrl', function ($scope, $routeParams, $rootScope ) {
    $scope.username = $routeParams.username;

    $scope.getCanEdit = function(){
        return $rootScope.user && $rootScope.user.username === $scope.username;
    };

    $scope.getMode = function(){
        return !!$rootScope.user ? 'private' : 'public';
    };

});
