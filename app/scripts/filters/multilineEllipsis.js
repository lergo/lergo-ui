(function () {
    'use strict';

    angular.module('lergoApp')
        .filter('multilineEllipsis', function (/*$log*/) {

            function truncate(text, lengthLimit) {

                lengthLimit = lengthLimit || 320;

                var textArgs = text.split('\n\n\n');

                if (textArgs.length > 1){
                    return textArgs[0];
                }

                if (text.length < lengthLimit ){
                    return text;
                }

                text = text.substring(0,lengthLimit);

                if ( new RegExp('.*(\\.|!|\n|\\?)$').test( text.trim() )){
                    return text.trim();
                }
                var sentences = _.filter(_.compact(text.split(/\.|!|\n|\?/).map($.trim)),function(str){ return str !== ''; });
    //            $log.info(sentences);
                if ( sentences.length > 1 ) {
                    sentences.splice(sentences.length - 1, 1);
                }
                // index of last sentence - more or less, it doesn't really matter
                var joinedSentences = sentences.join(' ');
                var lastSentence = _.last(sentences);
                var endOfText = joinedSentences.length + text.substring( joinedSentences.length - lastSentence.length ).indexOf(_.last(sentences));
                return text.substring(0,endOfText + 1).trim();//  text.replace(/\W*\s(\S)*$/, '...');
            }

            return function (input ,limit) {
                return !input ? '' : truncate(input, limit );
            };
    });
})();
