'use strict';

angular.module('lergoApp').controller('PlaylistsUpdateCtrl',
    function ($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, LergoFilterService, $uibModal,
        TagsService, QuestionsService, PlaylistsService, $rootScope, $window, $filter, LergoTranslate, $translate)
         {
        $window.scrollTo(0, 0);

        // back button for 'step/display' in edit playlist
        $scope.currentUrl = false;
        var absUrl = $location.absUrl();
        if (absUrl.indexOf('/playlists/step/display') > -1) {
            $scope.currentUrl = true;
        }

        $scope.goBack = function() {
            window.history.back();
        };

 
        $scope.subjects = LergoFilterService.subjects;
        $scope.adminRatings = LergoFilterService.adminRatings;
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

        $scope.saveButtonDisabled = function () {
            return $scope.isSaving() || !$scope.playlist || !$scope.playlist.name;
        };

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

        function addItemToQuiz(item, step) {
            step.lessonItems = step.lessonItems || [];
            if (step.lessonItems.indexOf(item._id) < 0) {
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
                step.lessonItems.push(item._id);
            }
        }

        function playlistOverrideLesson(lessonIdToOverride, callback) {
            $log.info('in playlist controller, overriding lesson');
            LergoClient.lessons.overrideQuestion($scope.playlist._id, lessonIdToOverride).then(function (result) {
                if (!!callback) {
                    callback(result.data.lessonItem._id);
                }
                $scope.playlist = result.data.playlist;
            }, function (result) {
                toastr.error('error while overriding question', result.data);
            });
        }

        // this is a wrapper to 'playlistOverrideQuestion' which will, after
        // playlist update
        // list on lessonItemsData change ONCE and reopens the dialog
        function playlistOverrideLessonAndReopenDialog(step, lessonIdToOverride) {
            playlistOverrideLesson(lessonIdToOverride, function (newQuizItemId) {

                // first - lets watch
                // http://stackoverflow.com/a/13652152/1068746
                var unregister = $scope.$watch('lessonItemsData', function () {
                    if (!$scope.lessonItemsData.hasOwnProperty(newQuizItemId)) {
                        return; // wait for it to exist ;
                    }

                    try {
                        $scope.openLessonDialog(step, $scope.lessonItemsData[newQuizItemId], false);
                    } finally {
                        unregister();
                    }
                });
            });
        }

        function openLessonDialog(step, lessonItem, isUpdate) {
            persistScroll();
            var modelContent = {};
            modelContent.templateUrl = 'views/lessons/addCreateUpdateDialog.html';
            modelContent.windowClass = 'question-bank-dialog ' + LergoTranslate.getDirection();
            modelContent.backdrop = 'static';
            modelContent.controller = 'LessonsAddUpdateDialogCtrl';
            modelContent.resolve = {
                playlistOverrideLesson: function () {
                    return playlistOverrideLessonAndReopenDialog;
                },
                lessonItem: function () {
                    return lessonItem;
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

        function updateNextPlaylist(newValue, oldValue) {
            if (!newValue) {
                $scope.playlist.nextPlaylistId='';
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playlist.nextPlaylistId = id;
            }

        }

        function updatePriorPlaylist(newValue, oldValue) {
            if (!newValue) {
                $scope.playlist.priorPlaylistId='';
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playlist.priorPlaylistId = id;
            }
        }

        function updateWikiLink(newValue, oldValue) {
            if (!newValue) {
                $scope.playlist.wikiLinkId = '';
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playlist.wikiLinkId = id;
            }
        }

        LergoClient.playlists.getById($routeParams.playlistId).then(function (result) {
            $scope.playlist = result.data;
            $scope.errorMessage = null;
            $scope.$watch('playlist', savePlaylist.onValueChange, true);
            $scope.$watch('playlist.nextPlaylist', updateNextPlaylist);
            $scope.$watch('playlist.priorPlaylist', updatePriorPlaylist);
            $scope.$watch('playlist.wikiLink', updateWikiLink);
            if (!$scope.playlist.tags) {
                $scope.playlist.tags = [];
            }
            if (!$scope.playlist.language) {
                $scope.playlist.language = LergoTranslate.getLanguageObject().name;
            }

            // AdminCommentOpen
            $scope.isAdminCommentOpen = !!$scope.playlist.adminComment || !!$scope.playlist.adminRating;

            // Advance option should be open is any of the below properties are defined/non-empty
            $scope.isAdvOptOpen = !!$scope.playlist.nextPlaylist || !!$scope.playlist.priorPlaylist || !!$scope.playlist.coverPage || !!$scope.playlist.wikiLink;

        }, function (result) {
            $scope.errorMessage = 'Error in fetching Playlist by id : ' + result.data.message;
            $log.error($scope.errorMessage);
        });

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
                'retBefCrctAns': 1,
                'type':'lesson'
            };

            if (typeof($index) === 'number') {
                playlist.steps.splice($index, 0, step); //  http://stackoverflow.com/a/586189/1068746
            } else {
                playlist.steps.push(step);
                $scope.addCreateQuestion(step);
            }
            $scope.getStepViewByType(step);
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

        var lessonItemsWatch = [];
        $scope.lessonItemsData = {};

        $scope.getLesson = function (item) {
            if ($scope.lessonItemsData.hasOwnProperty(item)) {
                return $scope.lessonItemsData[item].name;
            }
            return null;
        };

        TagsService.getAllAvailableTags().then(function (result) {
            $scope.allAvailableTags = result.data;
        });

        /**
         * watch questions in step. iterates over all steps of type lesson
         * and turns the lessonItems arrays to a single array *
         */
        $scope.$watch(function () {
            if (!$scope.playlist) {
                return lessonItemsWatch;
            }
            lessonItemsWatch.splice(0, lessonItemsWatch.length);
            if (!!$scope.playlist.steps) {
                $scope.playlist.steps.forEach(function (step) {
                    if (!!step.lessonItems && step.lessonItems.length > 0) {
                        step.lessonItems.forEach(function (lessonItem) {
                            if (lessonItemsWatch.indexOf(lessonItem) < 0) {
                                lessonItemsWatch.push(lessonItem);
                            }
                        });
                    }
                });
            }
            return lessonItemsWatch;
        }, function (newValue) {
            if (!!newValue && newValue.length > 0) {
                $log.info('lessonItems changed');
                LergoClient.lessons.findLessonsById(newValue).then(function (result) {
                    var newObj = {};
                    for (var i = 0; i < result.data.length; i++) {
                        newObj[result.data[i]._id] = result.data[i];
                    }
                    $scope.lessonItemsData = newObj;
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
            if (!!step.lessonItems && step.lessonItems.length > 0 && step.lessonItems.indexOf(item) >= 0) {
                step.lessonItems.splice(step.lessonItems.indexOf(item), 1);
            }
        };

        $scope.moveQuizItemUp = function (index, step) {
            if (!!step.lessonItems) {
                var temp = step.lessonItems[index - 1];
                if (temp) {
                    step.lessonItems[index - 1] = step.lessonItems[index];
                    step.lessonItems[index] = temp;
                }
            }
        };
        $scope.moveQuizItemDown = function (index, step) {
            if (!!step.lessonItems) {
                var temp = step.lessonItems[index + 1];
                if (temp) {
                    step.lessonItems[index + 1] = step.lessonItems[index];
                    step.lessonItems[index] = temp;
                }
            }

        };

        $scope.openUpdateQuestion = function (step, lessonItemId) {
            QuestionsService.getPermissions(lessonItemId).then(function (result) {

                var canEditOrCopy = result.data.canEdit || isOwnerOfPlaylist();
                if ($scope.lessonItemsData.hasOwnProperty(lessonItemId) && canEditOrCopy) {
                    openLessonDialog(step, $scope.lessonItemsData[lessonItemId], true);
                }

                if (!canEditOrCopy) {
                    toastr.error($translate.instant('playlists.edit.noPermissionsDescription'), $translate.instant('playlists.edit.noPermissionsTitle'));
                }
            });

        };
        $scope.addCreateQuestion = function (step) {
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
        $scope.$watch(function () {
            var lang = LergoTranslate.getLanguageObj();
            return {
                'open': !$scope.saveButtonDisabled() && !addStepClicked,
                'position': lang && lang.dir === 'rtl' ? 'left' : 'right'
            };
        }, function (newValue) {
            $scope.popoverState = newValue;
        }, true);

        $scope.isStepValid = function (step) { // adding this isStepValid is true to enable the Display Step
            if (step) {
                return true;
            }
        };
    });
