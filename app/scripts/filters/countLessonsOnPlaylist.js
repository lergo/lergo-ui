'use strict';

angular.module('lergoApp')
    .filter('countLessonsOnPlaylist', function ( PlaylistsService ) {

        function countLessonsOnPlaylist(item) {
            return PlaylistsService.countLessons(item);
        }

        countLessonsOnPlaylist.$stateful = true;
        return countLessonsOnPlaylist;
    });