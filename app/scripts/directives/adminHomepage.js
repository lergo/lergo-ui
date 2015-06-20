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
                    'url' : '#!/admin/homepage/lessons'

                }, {
                    'id': 'abuseReports',
                    icon: 'fa fa-flag',
                    'url' : '#!/admin/homepage/abuseReports'
                }, {
                    'id': 'roles',
                    'icon': '',
                    'url' : '#!/security/roles'
                }

                ];

                try {
                    $scope.currentSection = $route.current.$$route.params.activeTab;
                }catch(e){
                    $log.error('unable to set activeTab', e);
                }

                $scope.isActive = function(section){
                    return $scope.currentSection === section.id;
                }

            }

        };
    });
