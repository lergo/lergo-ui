'use strict';

angular.module('lergoApp')
    .directive('textFilter', function () {
        return {
            templateUrl: 'views/directives/textFilter.html',
            restrict: 'AC',
            scope: {
                'items': '=',
                'model': '=',
                'placeholder': '@',
                'select': '&onSelect'
            },
            link: function postLink(scope/*, element, attrs*/) {
                scope.$watch('items', function () {
                    if (!scope.items) {
                        return;
                    }
                    var typeaheadValues = [];
                    _.each(scope.items, function (d) {
                        typeaheadValues.push(d.name);
                        typeaheadValues.push(d.question);
                        typeaheadValues.push(d.description);
                    });

                    scope.searchTypeahead = _.unique(_.compact(typeaheadValues));
                });

                scope.applyOnModel = function ($item, $model, $label) {
                    scope.model = $item;
                    if (!!scope.select && typeof(scope.select) === 'function') {
                        scope.select($item, $model, $label);
                    }
                };


            }
        };
    });
