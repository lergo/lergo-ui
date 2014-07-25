'use strict';

angular.module('lergoApp')
    .service('TagsService', function TagsService( $http ) {
        this.getTagsFromItems = function (items) {
            return _.uniq(_.compact(_.flatten(_.map(items, 'tags'))), 'label');
        };

        this.getAllAvailableTags = function( like, lessonsId, questionsId ){
            return $http({
                url : '/backend/tags/filter',
                method: 'GET',
                params: { like : like, 'lessonsId[]' : lessonsId, 'questionsId[]' : questionsId }
            });
        };
    });
