'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:security/GroupsIndexCtrl
 * @description
 * # security/GroupsIndexCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
  .controller('SecurityGroupsIndexCtrl', function ($scope, LergoClient, $log, $location ) {


        $scope.getGroupName = function( group ){
            if ( group.name && group.name.trim().length > 0 ) {
                return group.name;
            }else{
                return 'no name.. :(';
            }
        };

        $scope.create = function() {
            $scope.errorMessage = null;
            LergoClient.security.groups.create().then(function success( result ){
                var group = result.data;
                $scope.errorMessage = null;
                $location.path('/security/groups/' + group._id + '/update');
            }, function error( result ){
                $scope.errorMessage = 'unknown error';
                try {
                    $scope.errorMessage = 'Error creating group ' + result.data.message;
                }catch(e){}
                $log.error($scope.errorMessage);
                toastr.error($scope.errorMessage,'Error');
            });
        };

        LergoClient.security.groups.list( {}).then(function(result){
            $scope.groups = result.data.data;
        })
  });
