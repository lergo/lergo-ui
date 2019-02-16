(function(){

    'use strict';
    AboutCtrl.$inject = ['$scope','$routeParams', '$window', '$sce','$filter'];

    function AboutCtrl($scope, $routeParams, $window, $sce, $filter) {
        $scope.sections = [
            {
                id: 'overview'
            },
            {
                id: 'contribute'

            },
            {
                id: 'keyContributors'

            },
            {
                id: 'keyFunders'

            },
            {
                id: 'keyFundersPictures'

            },
            {
                id: 'lergoFeedback',
                url: function () {
                    return $sce.trustAsResourceUrl($filter('translate')('about.sections.lergoFeedbackUrl'));
                }
            },
            {
                id: 'friends'

            },
            {
                id: 'faq'

            },
            {
                id: 'privacy'

            },
            {
                id: 'contact'

            }
        ];
        $scope.scrollUp = function() {
            $window.scrollTo(0, 0);
        };

        $scope.currentSection = _.find($scope.sections, function(section) {
            return $routeParams.activeAboutTab === section.id;
        });

        $scope.isActive = function(section) {
            return !!$scope.currentSection && section.id === $scope.currentSection.id;
        };

        $scope.getInclude = function() {
            return 'views/about/_' + $scope.currentSection.id + '.html';
        };
    }

    angular.module('lergoApp').
        controller('AboutCtrl', AboutCtrl );

}());
