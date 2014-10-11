'use strict';

angular.module('lergoApp')
    .directive('tagSection', function ($log, TagsService ) {
        return {
            templateUrl: 'views/directives/_tagSection.html',
            restrict: 'A',
            scope: {
                'tags': '='
            },
            link: function postLink($scope, element, attrs) {
                var separator = attrs.separator || ',';
                var lowerCase = !!attrs.lowerCase;

                $scope.canRemoveTags = true;

                $scope.addTagFromTypeahead = function ($item/*, $model, $label*/) {
                    $scope.error = 'tagSection.alreadyExists';
                    addTag($item.label);

                };

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

                TagsService.getAllAvailableTags().then(function(result){
                    $scope.availableTags = result.data;
                });

                $scope.getTagsLike = function (like) {
                    return TagsService.getAllAvailableTags(like).then(function (result) {
                        return result.data;
                    });
                };


                function addTag(value) {
                    if (!!$scope.tags && $.grep($scope.tags, function (item/*, index*/) {
                        return item.label === value;
                    }).length > 0) {
                        $log.info('error on scope');
                        $scope.error = 'tagSection.alreadyExists';
                        return;
                    }
                    if (!value || value.trim() === '' || value.indexOf(separator) >= 0) {
                        $log.info('error on scope');
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

                $scope.$watch('newTag', function (newValue, oldValue) {
                    if ( newValue === oldValue ){
                        return;
                    }
                    $log.debug('newTag changed', newValue, oldValue);

                    if (typeof($scope.newTag) === 'object') {
                        // if object - it came from typeahead, and our 'on select' listener will take care of it.
                        return;
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
