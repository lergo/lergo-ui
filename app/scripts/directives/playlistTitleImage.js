'use strict';

angular.module('lergoApp')
    .directive('playlistTitleImage', function (LergoClient) {
        return {
            templateUrl: 'views/directives/_playlistImage.html',
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
    // https://lergo-images.s3-eu-west-1.amazonaws.com/playlist+overlay+only+rev1.png
    // https://lergo-images.s3-eu-west-1.amazonaws.com/lergo+default+image++-+playlist+rev8+right+smaller+smooth+angles.png
    //https://lergo-images.s3-eu-west-1.amazonaws.com/students-walking.jpg