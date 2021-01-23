'use strict';

angular.module('lergoApp')
    .service('PlaylistRprtWriteService', function PlaylistRprtWriteService( $log ) {
        /* jshint -W052 */

        this.calculateOldStepDuration = function (playlistRprt, data) {
            // calculate old step only if we are in new step (which cannot be old) and old step is defined..
            // first step is the end case we are testing here - if we are in the first step, we might get old == 0 or undefined.
            if (data.old !== data.new && data.old !== undefined && data.old !== null && !isNaN(parseInt(data.old, 10))) {
                var finishedStepIndex = Math.floor(data.old);
                var oldStep = playlistRprt.data.playlist.steps[finishedStepIndex];
                var oldDuration = playlistRprt.stepDurations[finishedStepIndex];
                if (!!oldStep && oldStep.type === 'lesson' && !!oldDuration) {

                    // LERGO-457 - lesson step duration should be the sum of durations per answer.
                    $log.info('calculating duration for lesson');

                    var answers = _.filter(playlistRprt.answers, {'stepIndex': finishedStepIndex});
                    // calculate end time by counting the duration on each answer..
                    var lessonDuration = _.reduce(answers, function (num, obj/*, index, list*/) {
                        return num + obj.duration + _.reduce(obj.retries, function(num,retry){ // support retries for question
                            return num+retry.duration;
                        },0);
                    }, 0);

                    oldDuration.endTime = oldDuration.startTime + lessonDuration;
                } else if (!!oldDuration) {

                    oldDuration.endTime = new Date().getTime();
                }
            }
        };


        this.calculatePlaylistRprtDuration = function (playlistRprt) {
            var result = 0;

            angular.forEach(playlistRprt.stepDurations, function (duration) {
                if (!!duration.startTime && !!duration.endTime) {
                    // in case there is an error and endTime < startTime.. lets use 0 instead.. LERGO-468
                    result = result + Math.max(0, (duration.endTime - duration.startTime));
                }
            });
            return result;
        };
    });
