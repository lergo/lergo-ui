'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:ManageUsersEditGroupDialogCtrl
 * @description
 * # ManageUsersEditGroupDialogCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersEditGroupDialogCtrl', function ($scope, $modalInstance, LergoClient ) {


        $scope.groups = _.map($scope.groups, function( group ){
            return {
                label : group.name,
                value: group._id,
                checked: _.indexOf($scope.user.groups, group._id) >= 0
            }
        });

        $scope.submit = function(){
            LergoClient.users.patchUserGroups($scope.user._id, _.pluck(_.filter($scope.groups, { checked: true }),'value')).then(function(){
                toastr.success('groups updated successfully');
                $modalInstance.close( );
            }, function error(){
                toastr.error('unable to update groups');
                $modalInstance.dismiss();

            });
        };

        $scope.close = function(){
            $modalInstance.dismiss();
        }

    });
