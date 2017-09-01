'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:admin/ManageUpdateUserCtrl
 * @description
 * # admin/ManageUpdateUserCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersUpdateCtrl', function ($scope, $routeParams, LergoClient, $uibModal, $location ) {

        function loadUser() {
            LergoClient.users.read($routeParams.userId).then(function (result) {
                $scope.user = result.data;
            }, function () {
                toastr.error('error getting user');
            });
        }

        loadUser();

        $scope.close = function(){
            $location.path('/manage/users');
        };

        $scope.editUserRoles = function(){

            var newScope = $scope.$new(true);
            newScope.user = $scope.user;
            newScope.roles = $scope.roles;
            $uibModal.open({
                templateUrl: 'views/manage/users/manageUserEditRoleDialog.html',
                controller: 'ManageUsersEditRoleDialogCtrl',
                scope:newScope,
                backdrop:'static',
                size: 'sm'//,
                //windowClass : 'question-bank-dialog'
            }).result.then(loadUser);
        };


        $scope.loadRoles = function(){
            LergoClient.roles.list({projection: {'_id':1,'name' :1}}).then(function(result){
                $scope.roles = _.keyBy(result.data.data,'_id');
            });
        };

        $scope.getRoleName = function(roleId){
            if ($scope.roles ) {
                return $scope.roles[roleId].name;
            }
        };

        $scope.loadRoles();


    });
