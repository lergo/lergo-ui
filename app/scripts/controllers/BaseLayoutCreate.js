'use strict';

angular.module('lergoApp').controller('BaseLayoutCreateCtrl', function($scope, $routeParams, $controller  ) {


    $scope.sections = [
        {
            'id' : 'lessons',
            'controller' : 'LessonsIndexCtrl'
        },
        {
            'id' : 'questions',
            'controller' : 'QuestionsIndexCtrl'
        },
        {
            'id' : 'reports',
            'controller' : 'ReportsIndexCtrl'
        }
    ];


    $scope.currentSection = _.find( $scope.sections, function( section ){ return $routeParams.activeTab === section.id; });

    $controller($scope.currentSection.controller, { $scope : $scope });

    $scope.isActive = function( section ){
        return !!$scope.currentSection && section.id === $scope.currentSection.id;
    };

    $scope.getInclude = function(){
        return  'views/' + $scope.currentSection.id + '/_index.html';
    };
});
