'use strict';

angular.module('lergoApp')
    .directive('lergoKsDemo', function () {
        return {
            restrict: 'C',
            link: function postLink(scope, element/*, attrs*/) {
                var html = element.html();
                element.find('*').remove();

                var wrapper = $('<div></div>', {'class': 'lergo-ks-demo-wrapper'});

                element.append(wrapper);


                wrapper.append(
                    $('<div></div>', {'class': 'lergo-ks-preview'}).html(html)
                );


                wrapper.append(
                    $('<pre></pre>', {'class': 'lergo-ks-code'}).text(html)
                );
            }
        };
    });
