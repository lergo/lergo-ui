(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name lergoApp.controller:RolesUpdateCtrl
     * @description
     * # RolesUpdateCtrl
     * Controller of the lergoApp
     */
    angular.module('lergoApp')
        .controller('RolesUpdateCtrl', function ($scope, LergoClient, $routeParams, $log, $location, $q, LergoFilterService, LergoTranslate ) {


            $scope.limitations = {};
            $scope.options = { limitEditSubject : _.clone(LergoFilterService.subjects).sort(), limitEditLanguage: LergoTranslate.getSupportedLanguages().sort() };


            function getRole() {
                return LergoClient.roles.read($routeParams.roleId).then(function success(result) {
                    $log.info('got role', result.data);
                    $scope.role = result.data;
                }, function error(result) {
                    $log.error('got error', result.data);
                });
            }

            function goBackToRoles(){
                $location.path('/manage/roles');
            }



            $scope.cancel = function(){
                goBackToRoles();
            };

            $scope.deleteRole = function deleteRole(){
                if ( confirm ('are you sure you want to delete role [' + $scope.role.name + ']')){
                    LergoClient.roles.delete($scope.role._id).then(function success(){
                        toastr.success('deleted successfully');
                        goBackToRoles();

                    }, function error(result){
                        if (LergoClient.errors.ResourceInUse.typeof(result.data)) {

                            var users = _.map(result.data.description.users,'username').join(',');
                            toastr.error('used by users : ' + users,'role in use');
                        } else {
                            toastr.error(result.data, 'error');
                        }

                    });
                }
            };

            function loadPermissions() {
                return LergoClient.roles.getPermissions().then(function (result) {
                    $scope.permissions = result.data;
                });
            }

            /**
             *
             * @param done - should we redirect back to roles after we save
             */
            $scope.saveRole = function( done ){
                LergoClient.roles.update($scope.role).then(function success(/*result*/){
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

            getRole();
            loadPermissions();
        });
    });        
