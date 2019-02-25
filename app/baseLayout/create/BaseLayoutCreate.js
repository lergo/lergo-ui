(function(){  
        'use strict';
        BaseLayoutCreateCtrl.$index = ['$scope', '$routeParams', '$controller'];
        function BaseLayoutCreateCtrl($scope, $routeParams, $controller) {

                $scope.sections = [ {
                id : 'invites',
                icon : 'fa fa-envelope',
                controller : 'InvitesIndexCtrl',
                include : 'views/invites/_index.html'
                }, {
                id : 'reports',
                icon : 'fa fa-bar-chart-o',
                controller : 'ReportsIndexCtrl',
                include : 'views/reports/_index.html'

                }, {
                id : 'lessons',
                icon : 'fa fa-university',
                controller : 'LessonsIndexCtrl',
                include : 'views/lessons/_index.html'
                }, {
                id : 'questions',
                icon : 'fa fa-question-circle',
                controller : 'QuestionsIndexCtrl',
                include : 'views/questions/_index.html'
                }, {
                id : 'profile',
                icon : 'fa fa-user',
                controller : 'UsersProfileCtrl',
                include : 'views/users/_userEditProfile.html'
                } ];

                $scope.currentSection = _.find($scope.sections, function(section) {
                        return $routeParams.activeTab === section.id;
                });

                $controller($scope.currentSection.controller, {
                        $scope : $scope
                });

                $scope.isActive = function(section) {
                        return !!$scope.currentSection && section.id === $scope.currentSection.id;
                };

        }

        angular.module('lergoApp')
                .controller('BaseLayoutCreateCtrl', BaseLayoutCreateCtrl);
})();