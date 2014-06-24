'use strict';

angular.module('lergoApp')
    .filter('multilineEllipsis', function ($log) {

        function truncate(text) {
            var sentences = text.split(/([^.!?]*[^.!?\s][.!?]['"]?)(\s|$)/);
            $log.info(sentences);
            sentences.splice(sentences.length - 1, 1);
            text = sentences.join('');
            return text;//  text.replace(/\W*\s(\S)*$/, '...');
        }

        return function (input) {
            return !input ? '' : truncate(input);
        };
    });
