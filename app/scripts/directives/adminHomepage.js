'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:adminHomepage
 * @description
 * # adminHomepage
 */
angular.module('lergoApp')
    .directive('adminHomepage', function ($controller, $routeParams, $location, $route, $log  ) {
        return {
            templateUrl: 'views/admin/homepage.html',
            restrict: 'A',
            transclude: true,
            link: function ($scope) {

                $scope.sections = [{
                    'id': 'lessons',
                    icon: 'fa fa-university',
                    'url' : '#!/admin/homepage/lessons',
                    'permission' : '!!lessons'

                }, {
                    'id': 'playlists',
                    icon: 'fa fa-file',
                    'url' : '#!/admin/homepage/playlists',
                    'permission' : '!!playlists'
                }, {
                    'id': 'abuseReports',
                    icon: 'fa fa-flag',
                    'url' : '#!/admin/homepage/abuseReports',
                    'permission' : 'abuseReports'
                }, {
                    'id': 'roles',
                    'icon': 'fa fa-key',
                    'url' : '#!/manage/roles',
                    'permission' : 'roles'
                }, {
                    'id' : 'users',
                    'icon' : 'fa fa-user',
                    'url' : '#!/manage/users',
                    'permission' : 'users.userCanPatchUsers'
                }

                ];

                try {
                    $scope.currentSection = $route.current.$$route.params.activeTab;
                }catch(e){
                    $log.error('unable to set activeTab', e);
                }

                $scope.isActive = function(section){
                    return $scope.currentSection === section.id;
                };

            }

        };
    });
