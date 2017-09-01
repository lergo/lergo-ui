'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:ManageUsersEditRoleDialogCtrl
 * @description
 * # ManageUsersEditRoleDialogCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersEditRoleDialogCtrl', function ($scope, $uibModalInstance, LergoClient ) {


        $scope.roles = _.map($scope.roles, function( role ){
            return {
                label : role.name,
                value: role._id,
                checked: _.indexOf($scope.user.roles, role._id) >= 0
            };
        });

        $scope.submit = function(){
            LergoClient.users.patchUserRoles($scope.user._id, _.map(_.filter($scope.roles, { checked: true }),'value')).then(function(){
                toastr.success('roles updated successfully');
                $uibModalInstance.close( );
            }, function error(){
                toastr.error('unable to update roles');
            });
        };

        $scope.close = function(){
            $uibModalInstance.dismiss();
        };

    });
