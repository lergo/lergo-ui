'use strict';

angular.module('lergoApp')
    .directive('playlistTitleImage', function (LergoClient) {
        return {
            template: '<img class="img-responsive" ng-show="!!img" ng-src="{{img}}" width="100%" />' +
            '<i ng-show="!img" class="fa fa-university"></i>',
            restrict: 'A',
            scope: {
                'playlist': '='
            },
            link: function postLink(scope/*, element, attrs*/) {

                scope.$watch('playlist', function () {
                    scope.img = LergoClient.playlists.getTitleImage(scope.playlist);
                });

            }
        };
    });
