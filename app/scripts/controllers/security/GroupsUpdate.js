'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:security/GroupsUpdateCtrl
 * @description
 * # security/GroupsUpdateCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
  .controller('SecurityGroupsUpdateCtrl', function ($scope, LergoClient, $routeParams, $location  ) {

        LergoClient.security.groups.read($routeParams.groupId).then(function( result ){
            $scope.group = result.data;
        });

        var roles = {};

        LergoClient.security.roles.list({}).then(function(result){
            $scope.roles = result.data.data;
            roles = _.indexBy($scope.roles,'_id');
        });

        $scope.addRole = function addRole( role ){

            if ( !role ){
                return;
            }

            if ( typeof(role) === 'string' ){
                role = { '_id' : role };
            }

            if ( !$scope.group.roles ){
                $scope.group.roles = [];
            }
            $scope.group.roles.push(role._id);
        };

        $scope.removeRole = function removeRole(role){
            $scope.group.roles.splice(_.indexOf($scope.group.roles,role),1);
        };

        function backToGroups(){
            $location.path('/security/groups');
        }

        $scope.saveGroup = function saveGroup( done ){

            LergoClient.security.groups.update( $scope.group).then(function success(  ){
                toastr.success('saved successfully');
                if ( done ){
                    backToGroups();
                }
            }, function error( result ){
                toastr.error(result.data)
            })
        };

        $scope.cancel = function(){
            backToGroups();
        };

        $scope.deleteGroup = function(){
            LergoClient.security.groups.delete($scope.group).then(function success(){
                toastr.success('deleted successfully');
            }, function error(result){

                toastr.error(result.data,'error');
            });
        };

        $scope.getRole = function getRole( roleId ){

            return roles[roleId];
        };

        $scope.page = { newRole : null };
        $scope.addRoleFromTypeahead = function( $item ){
            $scope.addRole($item);
            $scope.page.newRole = null;
        };



  });
