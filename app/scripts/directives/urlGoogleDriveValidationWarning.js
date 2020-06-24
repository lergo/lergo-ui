'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:noindex
 * @description
 * # noindex
 */
angular.module('lergoApp')
    .directive('urlGoogleDriveValidationWarning', function () {
        return {
            
            restrict: 'E',
            templateUrl : 'views/directives/_urlGoogleDriveValidationWarning.html',
            replace: true,
            scope: {
                googleDriveLink: '@',
            },
            link: function(scope) {
                scope.preferedLink = true;
                scope.$watch('googleDriveLink', function(newValue) {
                    if (newValue) {
                        scope.preferedLink = true;
                        if (scope.googleDriveLink ) {
                            var validCoverPageUrl = /^https:\/\/drive\.google\.com/.test(scope.googleDriveLink);
                            var awsValidCoverPage = /^https:\/\/s3-eu-west-1\.amazonaws\.com/.test(scope.googleDriveLink);
                            if (!validCoverPageUrl && !awsValidCoverPage) {
                                scope.preferedLink = false;
                                setTimeout(function(){ scope.preferedLink = true; }, 3000);
                            }
                        }
                    }
                    
                }, true);
            }
        };
    });

