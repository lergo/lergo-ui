'use strict';

angular.module('lergoApp')
    .service('TagsService', function TagsService() {
        this.getTagsFromItems = function (items) {
            return _.uniq(_.compact(_.flatten(_.map(items, 'tags'))), 'label');
        };
    });
