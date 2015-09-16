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
                    $location.path('#!/security/roles');
                }
            }, function error(result){
                $log.error('error when saving');
                toastr.error(result.data,'error when saving');
            });
        };
    });
