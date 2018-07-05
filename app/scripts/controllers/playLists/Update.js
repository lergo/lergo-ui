'use strict';

angular.module('lergoApp').controller('PlayListsUpdateCtrl',
    function ($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, LergoFilterService, $uibModal, TagsService, QuestionsService, $rootScope, $window, $filter, LergoTranslate, $translate) {
        $window.scrollTo(0, 0);
        $scope.subjects = LergoFilterService.subjects;
        var addStepClicked = false;
        $scope.popoverState = {open: false, position: 'top'};
        $scope.languages = LergoFilterService.languages;
        var savePlayList = new ContinuousSave({
            'saveFn': function (value) {
                return LergoClient.playLists.update(value);
            }
        });

        $scope.isSaving = function () {
            return !!savePlayList.getStatus().saving;
        };

        $scope.$watch(function () {
            return savePlayList.getStatus();
        }, function (newValue) {
            $scope.saveStatus = newValue;
        }, true);

        $scope.displayStep = function (step) {
            $location.path('/user/playLists/step/display').search('data', JSON.stringify(step));
        };

        $scope.saveButtonDisabled = function () {
            return $scope.isSaving() || !$scope.playList || !$scope.playList.name;
        };

        LergoClient.playLists.getById($routeParams.playListId).then(function (result) {
            $scope.playList = result.data;
            $scope.errorMessage = null;
            $scope.$watch('playList', savePlayList.onValueChange, true);
            $scope.$watch('playList.nextPlayList', updateNextPlayList);
            $scope.$watch('playList.priorPlayList', updatePriorPlayList);
            if (!$scope.playList.tags) {
                $scope.playList.tags = [];
            }
            if (!$scope.playList.language) {
                $scope.playList.language = LergoTranslate.getLanguageObject().name;
            }
            // Advance option should be open is any of the below properties are defined/non-empty
            $scope.isAdvOptOpen = !!$scope.playList.nextPlayList || !!$scope.playList.priorPlayList || !!$scope.playList.coverPage;

        }, function (result) {
            $scope.errorMessage = 'Error in fetching PlayList by id : ' + result.data.message;
            $log.error($scope.errorMessage);
        });

        function updateNextPlayList(newValue, oldValue) {
            if (!newValue) {
                delete $scope.playList.nextPlayListId;
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playList.nextPlayListId = id;
            }

        }

        function updatePriorPlayList(newValue, oldValue) {
            if (!newValue) {
                delete $scope.playList.priorPlayListId;
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.playList.priorPlayListId = id;

            }
        }

        $scope.stepTypes = [{
            'id': 'video',
            'label': 'Video'
        }, {
            'id': 'quiz',
            'label': 'Quiz'
        }, {
            'id': 'slide',
            'label': 'Slide'
        }];

        $scope.getPlayListIntroLink = function (playList) {
            return LergoClient.playLists.getIntroLink(playList);
        };

        $scope.addStep = function (playList, $index) {
            addStepClicked = true;
            if (!playList.steps) {
                playList.steps = [];
            }

            var step = {
                'testMode': 'False',
                'retBefCrctAns': 1
            };

            if (typeof($index) === 'number') {
                playList.steps.splice($index, 0, step); //  http://stackoverflow.com/a/586189/1068746
            } else {
                playList.steps.push(step);
            }
        };
        $scope.moveStepUp = function (index) {
            var temp = $scope.playList.steps[index - 1];
            if (temp) {
                $scope.playList.steps[index - 1] = $scope.playList.steps[index];
                $scope.playList.steps[index] = temp;
            }
        };
        $scope.moveStepDown = function (index) {
            var temp = $scope.playList.steps[index + 1];
            if (temp) {
                $scope.playList.steps[index + 1] = $scope.playList.steps[index];
                $scope.playList.steps[index] = temp;
            }

        };
        $scope.deleteStep = function (step) {
            var str = $filter('translate')('deleteStep.confirm');
            var canDelete = confirm($filter('format')(str, {
                '0': step.title
            }));
            if (canDelete) {
                var steps = $scope.playList.steps;
                if (!!steps && steps.length > 0 && steps.indexOf(step) >= 0) {
                    steps.splice(steps.indexOf(step), 1);
                }
                $log.info('Step deleted sucessfully');
            }
        };

        function isOwnerOfPlayList() {
            return $rootScope.user._id === $scope.playList.userId;
        }

        /**
         * redirect to admin homepage or user create section
         * depending on the situation.
         */
        $scope.done = function (type) {

            if (type === 'showPlayList') {
                $location.path($scope.getPlayListIntroLink($scope.playList));
                return;
            }

            if ($rootScope.user && !isOwnerOfPlayList()) { // admin
                $location.path('/admin/homepage/playLists');

            } else { // user
                $location.path('/user/create/playLists');
            }
        };

        $scope.getStepViewByType = function (step) {
            var type = 'none';
            if (!!step && !!step.type) {
                type = step.type;
            }
            return 'views/playList/steps/_' + type + '.html';
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
            if (!$scope.playList) {
                return quizItemsWatch;
            }

            quizItemsWatch.splice(0, quizItemsWatch.length);
            if (!!$scope.playList.steps) {
                $scope.playList.steps.forEach(function (step) {
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
            return 'views/playList/steps/_' + type + '.html';
        };


        $scope.removeItemFromQuiz = function (item, step) {
            if (!!step.quizItems && step.quizItems.length > 0 && step.quizItems.indexOf(item) >= 0) {
                step.quizItems.splice(step.quizItems.indexOf(item), 1);
            }
        };

        function addItemToQuiz(item, step) {
            step.quizItems = step.quizItems || [];
            if (step.quizItems.indexOf(item._id) < 0) {
                if (!$scope.playList.subject) {
                    $scope.playList.subject = item.subject;
                }
                if (!$scope.playList.age) {
                    $scope.playList.age = item.age;
                }
                if (!$scope.playList.language) {
                    $scope.playList.language = item.language;
                }
                if (!$scope.playList.tags || $scope.playList.tags.length === 0) {
                    $scope.playList.tags = item.tags;
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

        function playListOverrideQuestion(questionIdToOverride, callback) {
            $log.info('in playList controller, overriding question');
            LergoClient.playLists.overrideQuestion($scope.playList._id, questionIdToOverride).then(function (result) {
                if (!!callback) {
                    callback(result.data.quizItem._id);
                }
                $scope.playList = result.data.playList;
            }, function (result) {
                toastr.error('error while overriding question', result.data);
            });
        }

        // this is a wrapper to 'playListOverrideQuestion' which will, after
        // playList update
        // list on quizItemsData change ONCE and reopens the dialog
        function playListOverrideQuestionAndReopenDialog(step, questionIdToOverride) {
            playListOverrideQuestion(questionIdToOverride, function (newQuizItemId) {

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

                var canEditOrCopy = result.data.canEdit || isOwnerOfPlayList();
                if ($scope.quizItemsData.hasOwnProperty(quizItemId) && canEditOrCopy) {
                    openQuestionDialog(step, $scope.quizItemsData[quizItemId], true);
                }

                if (!canEditOrCopy) {
                    toastr.error($translate.instant('playLists.edit.noPermissionsDescription'), $translate.instant('playLists.edit.noPermissionsTitle'));
                }
            });

        };
        $scope.addCreateQuestion = function (step) {
            $scope.addQuestionBtnDisable = true;
            QuestionsService.createQuestion({
                'subject': $scope.playList.subject,
                'age': $scope.playList.age,
                'language': $scope.playList.language,
                'tags': $scope.playList.tags
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


        function openQuestionDialog(step, quizItem, isUpdate) {

            persistScroll();
            var modelContent = {};
            modelContent.templateUrl = 'views/questions/addCreateUpdateDialog.html';
            modelContent.windowClass = 'question-bank-dialog ' + LergoTranslate.getDirection();
            modelContent.backdrop = 'static';
            modelContent.controller = 'QuestionsAddUpdateDialogCtrl';
            modelContent.resolve = {
                playListOverrideQuestion: function () {
                    return playListOverrideQuestionAndReopenDialog;
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

        $scope.isPlayListInvalid = function () {
            return !!$scope.playList && !$scope.playList.name;
        };

        $scope.$on('$locationChangeStart', function (event) { // guy -
            // TODO - consider using route change instead.
            persistScroll();
            if ($scope.isPlayListInvalid()) {
                var answer = confirm($filter('translate')('deletePlayList.Confirm'));
                if (!answer) {
                    event.preventDefault();
                } else {
                    LergoClient.playLists.delete($scope.playList._id).then(function () {
                        $scope.errorMessage = null;
                        $log.info('PlayList deleted sucessfully');
                    }, function (result) {
                        $scope.errorMessage = 'Error in deleting PlayList : ' + result.data.message;
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
