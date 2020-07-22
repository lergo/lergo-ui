'use strict';

angular.module('lergoApp')
    .service('PlaylistRprtsService', function PlaylistRprtsService($log, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function


        this.getById = function (playlistRprtId) {
            return $http.get('/backend/playlistRprts/' + playlistRprtId + '/read');
        };

        this.getClassPlaylistRprtById = function (playlistRprtId) {
            return $http.get('/backend/playlistRprts/class/' + playlistRprtId + '/read');
        };

        this.findStudentPlaylist = function (like) {
            return $http({
                method: 'GET',
                url: '/backend/playlistRprts/studentsplaylists/find',
                params: {
                    like: like
                }
            });
        };

        this.findPlaylist = function (like, playlistRprtType) {
            return $http({
                method: 'GET',
                url: '/backend/playlistRprts/playlists/find',
                params: {
                    'like': like,
                    'playlistRprtType': playlistRprtType
                }
            });
        };

        this.continuePlaylistUrl = function (playlistRprt) {
            if (!!playlistRprt) {
                /* http://localhost:9000/#!/public/playlists/invitations/54a7a46d63abbaf42baf8aef/display?
                 * playlistId=53ca325179cee56d19e61548&
                 * lergoLanguage=en&
                 * playlistRprtId=54a7a46d63abbaf42baf8af0&
                 * currentStepIndex=0 */
                return '/#!/public/playlists/invitations/' + playlistRprt.invitationId +
                    '/display?playlistId=' + playlistRprt.data.playlistId + '&playlistRprtId=' +
                    playlistRprt._id + '&currentStepIndex=' + this.countCompletedSteps(playlistRprt);
            } else {
                return 'N/A';
            }
        };

        this.countCompletedSteps = function (playlistRprt) {
            var completedSteps = 0;
            _.each(playlistRprt.stepDurations, function (elem) {
                if (angular.isNumber(elem.startTime) && angular.isNumber(elem.endTime)) {
                    completedSteps++;
                }
            });
            return completedSteps;
        };

        /**
         * PlaylistRprt is not completed if
         * 1. PlaylistRprt is null
         *
         *
         * @param playlistRprt
         * @returns {boolean}
         */
        this.isCompleted = function (playlistRprt) {
            if (!playlistRprt) {
                return false;
            }
            /*  guy - adding this to :
             *  (1) shorten the process
             *  (2) fix bug where invitation is deleted and then suddenly 'incomplete' appears in playlistRprts index page.
             *  return true; */
            else if (playlistRprt.finished) {
                return true;
            }
            else {
                try {

                    var allStepsCompleted = playlistRprt.data.playlist.steps.length === this.countCompletedSteps(playlistRprt);
                    return !!playlistRprt.data && !!playlistRprt.data.playlist && !!playlistRprt.data.playlist.steps && allStepsCompleted;
                }
                catch(err) {
                    /*cannot read length of undefined*/
                }
            }
            return false;
        };

        /**
         *
         * find an existing answer for specific lesson in specific step identified by index.
         *
         * @param playlistRprt the playlistRprt
         * @param quizItemId id of quizItem we want answer for
         * @param stepIndex the step identified by index in playlist steps.
         * @returns {null|object} null if no answer, otherwise returns the answer
         */
        //
        //
        this.getAnswerToQuizItem = function (playlistRprt, quizItemId, stepIndex) {
            var result = _.find(playlistRprt.answers, function (item) {
                return (item.quizItemId === quizItemId) && (item.stepIndex === stepIndex);
            });
            if (!result) {
                return null; // make sure to return null, and not any other value like undefined
            }
            return result;
        };

        /**
         * turns list of answers for specific step to a map of quizItemId and the answer.
         *
         * @param playlistRprt the playlistRprt
         * @param stepIndex step we are interested in
         * @returns {object} a map between quiz item id, and the answer
         */
        this.getAnswersByQuizItemId = function (playlistRprt, stepIndex) {
            var result = {};
            _.each(playlistRprt.answers, function (item) {
                if (item.stepIndex === stepIndex) {
                    result[item.quizItemId] = item;
                }
            });
            return result;
        };


        /**
         *
         * @param invitation
         * @param overrides - a temporary solution for allowing users to register their names for each playlistRprt.
         *                      contains 'invitee' details in the same structure as it appears on invitation.
         *                      it will be applied on update, which should happen as soon as playlist starts.
         * @returns {*}
         */
        this.createFromInvitation = function (invitation, overrides) {
            return $http.post('/backend/playlistRprts/playlistinvitation/' + invitation._id, overrides);
        };

        this.update = function (playlistRprt) {
            console.log('the playlistRprt is: ',playlistRprt);
            return '';
            return $http.post('/backend/playlistRprts/' + playlistRprt._id + '/update', playlistRprt);
        };

        this.ready = function (playlistRprtId) {
            if (typeof(playlistRprtId) === 'object') {
                return $http.post('/backend/playlistRprts/' + playlistRprtId._id + '/ready');
            } else {
                return $http.post('/backend/playlistRprts/' + playlistRprtId + '/ready');
            }

        };

        this.deletePlaylistRprt = function (playlistRprt) {
            if (playlistRprt.isClassPlaylistRprt === true) {
                return $http.post('/backend/playlistRprts/class/' + playlistRprt._id + '/delete');
            } else {
                return $http.post('/backend/playlistRprts/' + playlistRprt._id + '/delete');
            }
        };

        this.getStudents = function () {
            return $http.get('/backend/playlistRprts/students');
        };

        this.getClasses = function () {
            return $http.get('/backend/playlistRprts/classes');
        };
    });
