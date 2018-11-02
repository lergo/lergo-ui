'use strict';

angular.module('lergoApp').controller('PlaylistsUpdateCtrl',
    function ($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, LergoFilterService, $uibModal, TagsService, QuestionsService, PlaylistsService, $rootScope, $window, $filter, LergoTranslate, $translate) {
        $window.scrollTo(0, 0);
        $scope.subjects = LergoFilterService.subjects;
        var addStepClicked = false;
        $scope.popoverState = {open: false, position: 'top'};
        $scope.languages = LergoFilterService.languages;
        var savePlaylist = new ContinuousSave({
            'saveFn': function (value) {
                return LergoClient.playlists.update(value);
            }
        });

        $scope.isSaving = function () {
            return !!savePlaylist.getStatus().saving;
        };

        $scope.$watch(function () {
            return savePlaylist.getStatus();
        }, function (newValue) {
            $scope.saveStatus = newValue;
        }, true);

        $scope.displayStep = function (step) {
            $location.path('/user/playlists/step/display').search('data', JSON.stringify(step));
        };

        $scope.saveButtonDisabled = function () {
            return $scope.isSaving() || !$scope.playlist || !$scope.playlist.name;
        };

        LergoClient.playlists.getById($routeParams.playlistId).then(function (result) {
            $scope.playlist = result.data;
            $scope.errorMessage = null;
            $scope.$watch('playlist', savePlaylist.onValueChange, true);
            $scope.$watch('playlist.nextPlaylist', updateNextPlaylist);
            $scope.$watch('playlist.priorPlaylist', updatePriorPlaylist);
            if (!$scope.playlist.tags) {
                $scope.playlist.tags = [];
            }
            if (!$scope.playlist.language) {
                $scope.playlist.language = LergoTranslate.getLanguageObject().name;
            }
            // Advance option should be open is any of the below properties are defined/non-empty
            $scope.isAdvOptOpen = !!$scope.playlist.nextPlaylist || !!$scope.playlist.priorPlaylist || !!$scope.playlist.coverPage;

        }, function (result) {
            $scope.errorMessage = 'Error in fetching Playlist by id : ' + result.data.message;
            $log.error($scope.errorMessage);
        });

        function updateNextPlaylist(newValue, oldValue) {
            if (!newValue) {
                delete $scope.playlist.nextPlaylistId;
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playlist.nextPlaylistId = id;
            }

        }

        function updatePriorPlaylist(newValue, oldValue) {
            if (!newValue) {
                delete $scope.playlist.priorPlaylistId;
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playlist.priorPlaylistId = id;

            }
        }

        $scope.stepTypes = [{
            'id': 'video',
            'label': 'Video'
        }, {
            'id': 'quiz',
            'label': 'Quiz'
        }, {
            'id': 'playlist',
            'label': 'Playlist'
        }, {
            'id': 'slide',
            'label': 'Slide'
        }];

        $scope.getPlaylistIntroLink = function (playlist) {
            return LergoClient.playlists.getIntroLink(playlist);
        };

        $scope.addStep = function (playlist, $index) {
            addStepClicked = true;
            if (!playlist.steps) {
                playlist.steps = [];
            }

            var step = {
                'testMode': 'False',
                'retBefCrctAns': 1
            };

            if (typeof($index) === 'number') {
                playlist.steps.splice($index, 0, step); //  http://stackoverflow.com/a/586189/1068746
            } else {
                playlist.steps.push(step);
            }
        };
        $scope.moveStepUp = function (index) {
            var temp = $scope.playlist.steps[index - 1];
            if (temp) {
                $scope.playlist.steps[index - 1] = $scope.playlist.steps[index];
                $scope.playlist.steps[index] = temp;
            }
        };
        $scope.moveStepDown = function (index) {
            var temp = $scope.playlist.steps[index + 1];
            if (temp) {
                $scope.playlist.steps[index + 1] = $scope.playlist.steps[index];
                $scope.playlist.steps[index] = temp;
            }

        };
        $scope.deleteStep = function (step) {
            var str = $filter('translate')('deleteStep.confirm');
            var canDelete = confirm($filter('format')(str, {
                '0': step.title
            }));
            if (canDelete) {
                var steps = $scope.playlist.steps;
                if (!!steps && steps.length > 0 && steps.indexOf(step) >= 0) {
                    steps.splice(steps.indexOf(step), 1);
                }
                $log.info('Step deleted sucessfully');
            }
        };

        function isOwnerOfPlaylist() {
            return $rootScope.user._id === $scope.playlist.userId;
        }

        /**
         * redirect to admin homepage or user create section
         * depending on the situation.
         */
        $scope.done = function (type) {

            if (type === 'showPlaylist') {
                $location.path($scope.getPlaylistIntroLink($scope.playlist));
                return;
            }

            if ($rootScope.user && !isOwnerOfPlaylist()) { // admin
                $location.path('/admin/homepage/playlists');

            } else { // user
                $location.path('/user/create/playlists');
            }
        };

        $scope.getStepViewByType = function (step) {
            var type = 'none';
            if (!!step && !!step.type) {
                type = step.type;
            }
            return 'views/playlist/steps/_' + type + '.html';
        };

        var quizItemsWatch = [];
        $scope.quizItemsData = {};

        $scope.getQuestion = function (item) {
            if ($scope.quizItemsData.hasOwnProperty(item)) {
                return $scope.quizItemsData[item].question;
            }
            return null;
        };

        TagsService.getAllAvailableTags().then(function (result) {
            $scope.allAvailableTags = result.data;
        });

        /**
         * watch questions in step. iterates over all steps of type 'quiz'
         * and turns the quizItems arrays to a single array *
         */
        $scope.$watch(function () {
            if (!$scope.playlist) {
                return quizItemsWatch;
            }

            quizItemsWatch.splice(0, quizItemsWatch.length);
            if (!!$scope.playlist.steps) {
                $scope.playlist.steps.forEach(function (step) {
                    if (!!step.quizItems && step.quizItems.length > 0) {

                        step.quizItems.forEach(function (quizItem) {

                            if (quizItemsWatch.indexOf(quizItem) < 0) {
                                quizItemsWatch.push(quizItem);
                            }

                        });
                    }
                });
            }
            return quizItemsWatch;
        }, function (newValue, oldValue) {
            if (!!newValue && newValue.length > 0) {
                $log.info('quizItems changed', newValue, oldValue);
                LergoClient.questions.findQuestionsById(newValue).then(function (result) {
                    var newObj = {};
                    for (var i = 0; i < result.data.length; i++) {
                        newObj[result.data[i]._id] = result.data[i];
                    }
                    $scope.quizItemsData = newObj;
                });
            }
        }, true);

        $scope.getStepViewByType = function (step) {
            var type = 'none';
            if (!!step && !!step.type) {
                type = step.type;
            }
            return 'views/playlist/steps/_' + type + '.html';
        };


        $scope.removeItemFromQuiz = function (item, step) {
            if (!!step.quizItems && step.quizItems.length > 0 && step.quizItems.indexOf(item) >= 0) {
                step.quizItems.splice(step.quizItems.indexOf(item), 1);
            }
        };

        function addItemToQuiz(item, step) {
            step.quizItems = step.quizItems || [];
            if (step.quizItems.indexOf(item._id) < 0) {
                if (!$scope.playlist.subject) {
                    $scope.playlist.subject = item.subject;
                }
                if (!$scope.playlist.age) {
                    $scope.playlist.age = item.age;
                }
                if (!$scope.playlist.language) {
                    $scope.playlist.language = item.language;
                }
                if (!$scope.playlist.tags || $scope.playlist.tags.length === 0) {
                    $scope.playlist.tags = item.tags;
                }
                step.quizItems.push(item._id);
            }
        }

        $scope.moveQuizItemUp = function (index, step) {
            if (!!step.quizItems) {
                var temp = step.quizItems[index - 1];
                if (temp) {
                    step.quizItems[index - 1] = step.quizItems[index];
                    step.quizItems[index] = temp;
                }
            }
        };
        $scope.moveQuizItemDown = function (index, step) {
            if (!!step.quizItems) {
                var temp = step.quizItems[index + 1];
                if (temp) {
                    step.quizItems[index + 1] = step.quizItems[index];
                    step.quizItems[index] = temp;
                }
            }

        };

        function playlistOverrideQuestion(questionIdToOverride, callback) {
            $log.info('in playlist controller, overriding question');
            LergoClient.playlists.overrideQuestion($scope.playlist._id, questionIdToOverride).then(function (result) {
                if (!!callback) {
                    callback(result.data.quizItem._id);
                }
                $scope.playlist = result.data.playlist;
            }, function (result) {
                toastr.error('error while overriding question', result.data);
            });
        }

        // this is a wrapper to 'playlistOverrideQuestion' which will, after
        // playlist update
        // list on quizItemsData change ONCE and reopens the dialog
        function playlistOverrideQuestionAndReopenDialog(step, questionIdToOverride) {
            playlistOverrideQuestion(questionIdToOverride, function (newQuizItemId) {

                // first - lets watch
                // http://stackoverflow.com/a/13652152/1068746
                var unregister = $scope.$watch('quizItemsData', function () {

                    if (!$scope.quizItemsData.hasOwnProperty(newQuizItemId)) {
                        return; // wait for it to exist ;
                    }

                    try {
                        $scope.openQuestionDialog(step, $scope.quizItemsData[newQuizItemId], false);
                    } finally {
                        unregister();
                    }
                });
            });
        }

        $scope.openUpdateQuestion = function (step, quizItemId) {
            QuestionsService.getPermissions(quizItemId).then(function (result) {

                var canEditOrCopy = result.data.canEdit || isOwnerOfPlaylist();
                if ($scope.quizItemsData.hasOwnProperty(quizItemId) && canEditOrCopy) {
                    openQuestionDialog(step, $scope.quizItemsData[quizItemId], true);
                }

                if (!canEditOrCopy) {
                    toastr.error($translate.instant('playlists.edit.noPermissionsDescription'), $translate.instant('playlists.edit.noPermissionsTitle'));
                }
            });

        };
        $scope.addCreatePlaylist = function (step) {
            $scope.addQuestionBtnDisable = true;
            QuestionsService.createQuestion({
                'subject': $scope.playlist.subject,
                'age': $scope.playlist.age,
                'language': $scope.playlist.language,
                'tags': $scope.playlist.tags
            }).then(function (result) {
                $scope.errorMessage = null;
                openQuestionDialog(step, result.data, false);
                $scope.addQuestionBtnDisable = false;
            }, function (result) {
                $scope.error = result.data;
                $scope.errorMessage = 'Error in creating questions : ' + result.data.message;
                $log.error($scope.errorMessage);
                $scope.addQuestionBtnDisable = false;
            });
        };

        /*$scope.addCreatePlaylist = function (step) {
            $scope.addPlaylistBtnDisable = true;
            PlaylistsService.createPlaylist({
                'subject': $scope.playlist.subject,
                'age': $scope.playlist.age,
                'language': $scope.playlist.language,
                'tags': $scope.playlist.tags
            }).then(function (result) {
                $scope.errorMessage = null;
                openPlaylistDialog(step, result.data, false);
                $scope.addQuestionBtnDisable = false;
            }, function (result) {
                $scope.error = result.data;
                $scope.errorMessage = 'Error in creating playlists : ' + result.data.message;
                $log.error($scope.errorMessage);
                $scope.addPlaylistsBtnDisable = false;
            });
        };*/


        function openQuestionDialog(step, quizItem, isUpdate) {

            persistScroll();
            var modelContent = {};
            modelContent.templateUrl = 'views/playlists/playlist/addCreateUpdateDialog.html';
            modelContent.windowClass = 'question-bank-dialog ' + LergoTranslate.getDirection();
            modelContent.backdrop = 'static';
            modelContent.controller = 'PlaylistsAddUpdateDialogCtrl';
            modelContent.resolve = {
                playlistOverrideQuestion: function () {
                    return playlistOverrideQuestionAndReopenDialog;
                },
                quizItem: function () {
                    return quizItem;
                },
                isUpdate: function () {
                    return isUpdate;
                },
                addItemToQuiz: function () {
                    return addItemToQuiz;
                },
                step: function () {
                    return step;
                }
            };
            var modelInstance = $uibModal.open(modelContent);
            modelInstance.result.then(function () {
                scrollToPersistPosition();
            }, function () {
                scrollToPersistPosition();
            });
        }

        $scope.isPlaylistInvalid = function () {
            return !!$scope.playlist && !$scope.playlist.name;
        };

        $scope.$on('$locationChangeStart', function (event) { // guy -
            // TODO - consider using route change instead.
            persistScroll();
            if ($scope.isPlaylistInvalid()) {
                var answer = confirm($filter('translate')('deletePlaylist.Confirm'));
                if (!answer) {
                    event.preventDefault();
                } else {
                    LergoClient.playlists.delete($scope.playlist._id).then(function () {
                        $scope.errorMessage = null;
                        $log.info('Playlist deleted sucessfully');
                    }, function (result) {
                        $scope.errorMessage = 'Error in deleting Playlist : ' + result.data.message;
                        $log.error($scope.errorMessage);
                    });
                }
            }
        });


        $scope.addCreateLesson = function (step) {
            $scope.addQuestionBtnDisable = true;
            QuestionsService.createQuestion({
                'subject': $scope.playlist.subject,
                'age': $scope.playlist.age,
                'language': $scope.playlist.language,
                'tags': $scope.playlist.tags
            }).then(function (result) {
                $scope.errorMessage = null;
                openLessonDialog(step, result.data, false);
                $scope.addQuestionBtnDisable = false;
            }, function (result) {
                $scope.error = result.data;
                $scope.errorMessage = 'Error in creating questions : ' + result.data.message;
                $log.error($scope.errorMessage);
                $scope.addQuestionBtnDisable = false;
            });
        };


        function openLessonDialog(step, quizItem, isUpdate) {

            persistScroll();
            var modelContent = {};
             modelContent.templateUrl = 'views/lessons/playlist/addCreateUpdateLessondialog.html';
             modelContent.windowClass = 'question-bank-dialog ' + LergoTranslate.getDirection();
             modelContent.backdrop = 'static';
             modelContent.controller = 'LessonsAddUpdateDialogCtrl';
            modelContent.resolve = {
                lessonOverrideQuestion: function () {
                    return lessonOverrideQuestionAndReopenDialog;
                },
                quizItem: function () {
                    return quizItem;
                },
                isUpdate: function () {
                    return isUpdate;
                },
                addItemToQuiz: function () {
                    return addItemToQuiz;
                },
                step: function () {
                    return step;
                }
            };
            var modelInstance = $uibModal.open(modelContent);
            modelInstance.result.then(function () {
                scrollToPersistPosition();
            }, function () {
                scrollToPersistPosition();
            });
        }

        $scope.isPlaylistInvalid = function () {
            return !!$scope.playlist && !$scope.playlist.name;
        };

        $scope.$on('$locationChangeStart', function (event) { // guy -
            // TODO - consider using route change instead.
            persistScroll();
            if ($scope.isPlaylistInvalid()) {
                var answer = confirm($filter('translate')('deletePlaylist.Confirm'));
                if (!answer) {
                    event.preventDefault();
                } else {
                    LergoClient.playlists.delete($scope.playlist._id).then(function () {
                        $scope.errorMessage = null;
                        $log.info('Playlist deleted sucessfully');
                    }, function (result) {
                        $scope.errorMessage = 'Error in deleting Playlist : ' + result.data.message;
                        $log.error($scope.errorMessage);
                    });
                }
            }
        });


        function persistScroll() {
            if (!$rootScope.scrollPosition) {
                $rootScope.scrollPosition = {};
            }
            $rootScope.scrollPosition[$location.path()] = $window.scrollY;
        }

        function scrollToPersistPosition() {
            var scrollY = 0;
            if (!!$rootScope.scrollPosition) {
                scrollY = $rootScope.scrollPosition[$location.path()] || 0;
            }
            $window.scrollTo(0, scrollY);
        }


        $scope.$watch(function () {
            var lang = LergoTranslate.getLanguageObj();
            return {
                'open': !$scope.saveButtonDisabled() && !addStepClicked,
                'position': lang && lang.dir === 'rtl' ? 'left' : 'right'
            };
        }, function (newValue) {
            $scope.popoverState = newValue;
        }, true);
    });
