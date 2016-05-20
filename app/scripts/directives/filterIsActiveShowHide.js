'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:filterIsActiveShowHide
 * @description
 * # filterIsActiveShowHide
 */
angular.module('lergoApp')
    .directive('filterIsActiveShowHide', function (UsersService, LergoFilterService) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).hide();

                var userPermissions = {};
                UsersService.getUserPermissions().then(function (_userPermissions) {
                    userPermissions = _userPermissions;
                });

                scope.$watch(
                    function () {
                        var relevancyOpts = scope.$eval(attrs.relevancyOpts);
                        return LergoFilterService.isActive(LergoFilterService.RESET_TYPES.LOGO, relevancyOpts, userPermissions);
                    },
                    function (newValue) {
                        scope.showHide(newValue);
                    }
                );

                scope.showHide = function (isActive) {
                    if (!isActive) {
                        element.hide();
                    } else {
                        element.show();
                    }
                };
            }
        };
    });
