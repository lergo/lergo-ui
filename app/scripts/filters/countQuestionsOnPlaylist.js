'use strict';

angular.module('lergoApp')
    .filter('countQuestionsOnPlaylist', function ( PlaylistsService ) {

        function countQuestionsOnPlaylist(item) {
            return PlaylistsService.countQuestions(item);
        }

        countQuestionsOnPlaylist.$stateful = true;
        return countQuestionsOnPlaylist;
    });
