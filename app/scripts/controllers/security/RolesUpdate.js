'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:security/RolesEditCtrl
 * @description
 * # security/RolesEditCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('SecurityRolesUpdateCtrl', function ($scope, LergoClient, $routeParams, $log, $location, $q ) {


        $q.all([getRole(), loadPermissions()]).then( function(){
            _.each($scope.role.permissions,function( rolePermission ){

                _.find($scope.permissions, { value : rolePermission }).checked = true;
            });
        });


        function getRole() {
            return LergoClient.security.roles.read($routeParams.roleId).then(function success(result) {
                $log.info('got role', result.data);
                $scope.role = result.data;
            }, function error(result) {
                $log.error('got error', result.data);
            });
        }

        function goBackToRoles(){
            $location.path('/security/roles');
        }

        $scope.cancel = function(){
            goBackToRoles();
        };

        $scope.deleteRole = function deleteRole(){
            if ( confirm ('are you sure you want to delete role [' + $scope.role.name + ']')){
                LergoClient.security.roles.delete($scope.role._id).then(function success(){
                    toastr.success('deleted successfully');
                    goBackToRoles();

                }, function error(result){
                    if (LergoClient.errors.RoleInUse.typeof(result.data)) {

                        var groups = _.pluck(result.data.description.groups,'name').join(',');
                        toastr.error('used by groups : ' + groups,'role in use');
                    } else {
                        toastr.error(result.data, 'error');
                    }

                })
            }
        };

        function loadPermissions() {
            return LergoClient.security.roles.getPermissions().then(function (result) {
                $scope.permissions = _.map(result.data, function (i) {
                    return {label: i, value: i}
                });
            });
        }

        /**
         *
         * @param done - should we redirect back to roles after we save
         */
        $scope.saveRole = function( done ){

            $scope.role.permissions = _.pluck(_.filter( $scope.permissions, { checked : true }), 'value' );


            LergoClient.security.roles.update($scope.role).then(function success(/*result*/){
                $log.info('saved successfully');
                toastr.success('saved!');
                if ( done ){
                    goBackToRoles();
                }
            }, function error(result){
                $log.error('error when saving');
                toastr.error(result.data,'error when saving');
            });
        };
    });
