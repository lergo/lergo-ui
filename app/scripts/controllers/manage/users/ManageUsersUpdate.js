'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:admin/ManageUpdateUserCtrl
 * @description
 * # admin/ManageUpdateUserCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersUpdateCtrl', function ($scope, $routeParams, LergoClient, $modal ) {

        function loadUser() {
            LergoClient.users.read($routeParams.userId).then(function (result) {
                $scope.user = result.data;
            }, function () {
                toastr.error('error getting user');
            });
        }

        loadUser();

        $scope.addUserToGroup = function(){

            var newScope = $scope.$new(true);
            newScope.user = $scope.user;
            newScope.groups = $scope.groups;
            $modal.open({
                templateUrl: 'views/manage/users/manageUserEditGroupDialog.html',
                controller: 'ManageUsersEditGroupDialogCtrl',
                scope:newScope,
                backdrop:'static',
                size: 'sm'//,
                //windowClass : 'question-bank-dialog'
            }).result.then(loadUser);
        };


        $scope.loadGroups = function(){
            LergoClient.security.groups.list({projection: {'_id':1,'name' :1}}).then(function(result){
                $scope.groups = _.indexBy(result.data.data,'_id');
            })
        };

        $scope.getGroupName = function(groupId){
            if ($scope.groups ) {
                return $scope.groups[groupId].name;
            }
        };

        $scope.loadGroups();


    });
