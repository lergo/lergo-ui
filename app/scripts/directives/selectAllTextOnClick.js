'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:selectAllTextOnClick
 * @description
 * # selectAllTextOnClick
 */
angular.module('lergoApp')
    .directive('selectAllTextOnClick', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var getMessageText = function() {};
                $(element).click(function () {
                    $timeout(function () {
                        element.select();
                        try {
                            if (document.execCommand('Copy')) {
                                getMessageText =function(type) {
                                    return {
                                        pin: 'invitations.pinCopied',
                                        link: 'invitations.linkCopied'
                                    }[type];
                                };
                                var select = 'selectAllTextOnClick';
                                scope.messageText = getMessageText(attrs[select]);
                                scope.copied = true;
                                console.log('copied: ' + scope.copied);
                                $timeout(function() {scope.copied = false; console.log('slept for 5secs');}, 5000);

                            }
                        } catch (e) {
                        }
                    }, 0);
                });
                scope.copied = false;
            }
        };
    });
