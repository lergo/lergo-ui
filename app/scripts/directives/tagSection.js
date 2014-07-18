'use strict';

angular.module('lergoApp')
    .directive('tagSection', function ($log) {
        return {
            templateUrl: 'views/directives/_tagSection.html',
            restrict: 'A',
            scope: {
                'tags': '=',
                'tagsAvailable': '='
            },
            link: function postLink($scope, element, attrs) {
                var separator = attrs.separator || ',';
                var lowerCase = !!attrs.lowerCase;

                $scope.canRemoveTags = true;


                function endsWith(str, suffix) {
                    return str.indexOf(suffix, str.length - suffix.length) !== -1;
                }

                function trim(str, suffix) {
                    var trimmed = str.substring(0, str.length - suffix.length).trim();
                    return lowerCase ? trimmed.toLowerCase() : trimmed;
                }

                $scope.removeTag = function (tag) {
                    $scope.tags.splice($scope.tags.indexOf(tag), 1);
                };


                function addTag(value) {
                    if (!!$scope.tags && $.grep($scope.tags, function (item/*, index*/) {
                        return item.label === value;
                    }).length > 0) {
                        $scope.error = 'tagSection.alreadyExists';
                        return;
                    }
                    if ( !value || value.trim() === '' || value.indexOf(separator) >= 0) {
                        $scope.error = 'tagSection.invalidTag';
                        return;
                    }
                    if (!$scope.tags) {
                        $scope.tags = [
                            {'label': value}
                        ];
                    } else {
                        $scope.tags.push({'label': value});
                    }
                    $scope.newTag = '';
                }

                $scope.finishTyping = function (tag) {

                    addTag(tag);
                };

                $scope.$watch('newTag', function () {
                    $log.info('newTag changed');

                    if (typeof($scope.newTag) === 'object') {
                        $scope.newTag = $scope.newTag.label;
//                  return;
                    }

                    $scope.error = null;
                    if (!!$scope.newTag && endsWith($scope.newTag, separator)) {
                        var value = trim($scope.newTag, separator);


                        addTag(value);
                    }
                });

            }
        };
    });
