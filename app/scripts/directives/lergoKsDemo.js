(function () {
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

                    //escape HTML
                    // http://stackoverflow.com/a/374176
                    var escapedHtml = $('<div/>').text(html).html();

                    wrapper.append(
                        $('<pre></pre>', {'class': 'lergo-ks-code'}).html( prettyPrintOne(escapedHtml))
                    );
                }
            };
    });
})();
