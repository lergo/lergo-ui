'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:noindex
 * @description
 * # noindex
 */
angular.module('lergoApp')
    .directive('noindex', function () {
        return {
            restrict: 'A',
            link: function postLink() {

                // adds the following meta tag to a page. best way to let google know not to show page on search results
                // https://support.google.com/webmasters/answer/93710
                //<meta name="robots" content="noindex">
                if ($('head meta[content=noindex]').length === 0) {
                    $('head').append($('<meta>', {name: 'robots', content: 'noindex'}));
                }

                // NOTE: no need to support navigation IMO since it is meant only for robots
            }
        };
    });
