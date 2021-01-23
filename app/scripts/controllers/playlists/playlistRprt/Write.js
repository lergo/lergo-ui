'use strict';

/**
 *
 * This controller write the events from a playlist a playlistRprt model
 *
 * Usage example: // example - lets say we have viewing a playlist $scope.data =
 * playlist; // lets add a playlistRprt to the playlist playlist.playlistRprt = {}; // lets put
 * the playlistRprt on the scope $scope.playlistRprt = playlist.playlistRprt; // call the playlistRprt
 * controller - the controller will look for "playlistRprt" on the scope
 * $controller('PlaylistsPlaylistRprtWriteCtrl', {$scope: $scope}); // listen to writing
 * on the playlistRprt and do something with it $scope.$watch('playlistRprt', function(){
 *
 * do something when the repost changes
 *
 * });
 *
 *
 *
 *
 *
 * The proper structure for a playlistRprt is the same as a constructed invitation but
 * with more data on it - it holds the real quiz item instead of an ID - it
 * holds the user's answer for each quiz item - it holds the "checkAnswer"
 * response for each answer
 *
 */

var PlaylistsPlaylistRprtWriteCtrl = function ($scope, PlaylistRprtWriteService, PlaylistRprtsService, $log, LergoClient, $q) {
    window.scrollTo(0, 0);
    var playlistRprt = $scope.playlistRprt;
    if (!playlistRprt.answers) {
        playlistRprt.answers = [];
    }
    if (!playlistRprt.stepDurations) {
        playlistRprt.stepDurations = [];
    }
    var stepIndex = 0;

    $scope.$on('startPlaylist', function (event, data) {
        $log.info('starting playlist');
        _.merge(playlistRprt.data, data); // since we compacted data on playlistRprt, playlistRprt it initialized with partial data
    });

    $scope.$on('endPlaylist', function (/* event, data */) {
        window.scrollTo(0, 0);  //  $window was for congrats, but caused karma:unit to fail
        $log.info('playlist ended');
        // mark invitation as finished
        if (!playlistRprt.data.finished) {
            playlistRprt.data.finished = true;
        }
        // mark playlistRprt as finished
        if (!playlistRprt.finished) {
            playlistRprt.finished = true;
        }
        if (!!playlistRprt.data.playlist.temporary) {
            LergoClient.playlists.delete(playlistRprt.data.playlist._id);
        }
    });

    // data is step

    // guy - deprecated, use stepIndexChange instead.
    // $scope.$on('nextStepClick', function(event, data) {
    // $log.info('nextStepClicked', event, data);
    // stepIndex++;
    // });

    $scope.$on('stepIndexChange', function (event, data) {
        $log.info('stepIndexChange');
        /* jshint -W052 */
        stepIndex = ~~data.new;
        // update new duration only if we are still looking at steps inside the
        // playlist.
        if (stepIndex <= playlistRprt.data.playlist.steps.length) {
            var newDuration = playlistRprt.stepDurations[stepIndex];

            if (!newDuration) {
                newDuration = {
                    startTime: new Date().getTime()
                };
                var step = playlistRprt.data.playlist.steps[stepIndex];
                if (!!step) {
                    newDuration.testMode = step.testMode;
                    newDuration.retryLesson = step.retryLesson;
                    newDuration.retBefCrctAns = step.retBefCrctAns;
                }
                playlistRprt.stepDurations.push(newDuration);
            }
        }


        if (~~data.old !== ~~data.new) {
            PlaylistRprtWriteService.calculateOldStepDuration(playlistRprt, data); // updates playlistRprt model
        }
        playlistRprt.duration = PlaylistRprtWriteService.calculatePlaylistRprtDuration(playlistRprt); // does not update playlistRprt model
    });


    // the idea is we always keep data without changing it.
    // when the playlistRprt is done, playlist should look like playlist,
    // lessonItems should be ids,
    // lessons should be the object for the quiz items..
    // just like in DB...
    // the playlistRprt only adds the answers the user game and whether they are right
    // or not.
    // in order to track down each answer and its correlating step

    $scope.$on('lessonAnswered', function (event, data) {
        $log.info('lesson was answered');

        // find answer
        // in case user answered a lesson, and then changed the answer, we
        // will need to find the answer again
        var answer = PlaylistRprtsService.getAnswerToQuizItem(playlistRprt, data.lessonItemId, stepIndex);

        if (!answer) { // add if not exists
            answer = {};
            playlistRprt.answers.push(answer);

            // update the answer
            _.merge(answer, {
                'stepIndex': stepIndex,
                'lessonItemId': data.lessonItemId,
                'lessonItemType': data.lessonItemType,
                'userAnswer': data.userAnswer,
                'checkAnswer': data.checkAnswer,
                'isHintUsed': data.isHintUsed,
                'duration': data.duration
            });
        } else { // assuming retry
            if (!answer.retries) {
                answer.retries = [];
            }
            answer.retries.push(data);
        }

        calculateCorrectPercentage(playlistRprt);

    });

    $log.info('playlistRprt writer initialized');

    function calculateCorrectPercentage(playlistRprt) {
        playlistRprt.correctPercentage = 0;
        var numberOfLessons = 0;
        var promises = [];
        angular.forEach(playlistRprt.data.playlist.steps, function (step) {
            if (step.type === 'lesson' && !!step.lessonItems) {
                angular.forEach(step.lessonItems, function (q) {
                    var d = $q.defer();
                    var lessonPromise = LergoClient.lessons.getLessonById(q);
                    lessonPromise.then(function (lesson) {
                        if (lesson.data.type !== 'openLesson') {
                            numberOfLessons++;
                        }
                        d.resolve();
                    });
                    promises.push(d.promise);
                });
            }
        });

        $q.all(promises).then(function () {
            if (!!playlistRprt.data.lessonItems && numberOfLessons > 0) {
                var correctAnswers = _.filter(playlistRprt.answers, function (answer) {
                    return answer.lessonItemType !== 'openLesson' && answer.checkAnswer.correct === true;
                });
                playlistRprt.correctPercentage = Math.round((correctAnswers.length * 100) / numberOfLessons);
            }

            $log.info('new correct percentage is : ');

        });
    }
};

angular.module('lergoApp').controller('PlaylistsPlaylistRprtWriteCtrl', ['$scope', 'PlaylistRprtWriteService', 'PlaylistRprtsService',
    '$log', 'LergoClient', '$q', PlaylistsPlaylistRprtWriteCtrl]);
