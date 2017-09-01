'use strict';

angular.module('lergoApp').controller('LessonsUpdateCtrl',
    function ($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, LergoFilterService, $uibModal, TagsService, QuestionsService, $rootScope, $window, $filter, LergoTranslate, $translate) {
        $window.scrollTo(0, 0);
        $scope.subjects = LergoFilterService.subjects;
        var addStepClicked = false;
        $scope.popoverState = {open: false, position: 'left'};
        $scope.languages = LergoFilterService.languages;
        var saveLesson = new ContinuousSave({
            'saveFn': function (value) {
                return LergoClient.lessons.update(value);
            }
        });

        $scope.isSaving = function () {
            return !!saveLesson.getStatus().saving;
        };

        $scope.$watch(function () {
            return saveLesson.getStatus();
        }, function (newValue) {
            $scope.saveStatus = newValue;
        }, true);

        $scope.displayStep = function (step) {
            $location.path('/user/lessons/step/display').search('data', JSON.stringify(step));
        };

        $scope.saveButtonDisabled = function () {
            return $scope.isSaving() || !$scope.lesson || !$scope.lesson.name;
        };

        LergoClient.lessons.getById($routeParams.lessonId).then(function (result) {
            $scope.lesson = result.data;
            $scope.errorMessage = null;
            $scope.$watch('lesson', saveLesson.onValueChange, true);
            $scope.$watch('lesson.nextLesson', updateNextLesson);
            $scope.$watch('lesson.priorLesson', updatePriorLesson);
            if (!$scope.lesson.tags) {
                $scope.lesson.tags = [];
            }
            if (!$scope.lesson.language) {
                $scope.lesson.language = LergoTranslate.getLanguageObject().name;
            }
            // Advance option should be open is any of the below properties are defined/non-empty
            $scope.isAdvOptOpen = !!$scope.lesson.nextLesson || !!$scope.lesson.priorLesson || !!$scope.lesson.coverPage;

        }, function (result) {
            $scope.errorMessage = 'Error in fetching Lesson by id : ' + result.data.message;
            $log.error($scope.errorMessage);
        });

        function updateNextLesson(newValue, oldValue) {
            if (!newValue) {
                delete $scope.lesson.nextLessonId;
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.lesson.nextLessonId = id;
            }

        }

        function updatePriorLesson(newValue, oldValue) {
            if (!newValue) {
                delete $scope.lesson.priorLessonId;
            } else if (!!newValue && newValue !== oldValue) {
                var id = newValue.substring(0, newValue.lastIndexOf('/'));
                id = id.substring(id.lastIndexOf('/') + 1);
                $scope.lesson.priorLessonId = id;

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

        $scope.getLessonIntroLink = function (lesson) {
            return LergoClient.lessons.getIntroLink(lesson);
        };

        $scope.addStep = function (lesson, $index) {
            addStepClicked = true;
            if (!lesson.steps) {
                lesson.steps = [];
            }

            var step = {
                'testMode': 'False',
                'retBefCrctAns': 1
            };

            if (typeof($index) === 'number') {
                lesson.steps.splice($index, 0, step); //  http://stackoverflow.com/a/586189/1068746
            } else {
                lesson.steps.push(step);
            }
        };
        $scope.moveStepUp = function (index) {
            var temp = $scope.lesson.steps[index - 1];
            if (temp) {
                $scope.lesson.steps[index - 1] = $scope.lesson.steps[index];
                $scope.lesson.steps[index] = temp;
            }
        };
        $scope.moveStepDown = function (index) {
            var temp = $scope.lesson.steps[index + 1];
            if (temp) {
                $scope.lesson.steps[index + 1] = $scope.lesson.steps[index];
                $scope.lesson.steps[index] = temp;
            }

        };
        $scope.deleteStep = function (step) {
            var str = $filter('translate')('deleteStep.confirm');
            var canDelete = confirm($filter('format')(str, {
                '0': step.title
            }));
            if (canDelete) {
                var steps = $scope.lesson.steps;
                if (!!steps && steps.length > 0 && steps.indexOf(step) >= 0) {
                    steps.splice(steps.indexOf(step), 1);
                }
                $log.info('Step deleted sucessfully');
            }
        };

        function isOwnerOfLesson() {
            return $rootScope.user._id === $scope.lesson.userId;
        }

        /**
         * redirect to admin homepage or user create section
         * depending on the situation.
         */
        $scope.done = function (type) {

            if (type === 'showLesson') {
                $location.path($scope.getLessonIntroLink($scope.lesson));
                return;
            }

            if ($rootScope.user && !isOwnerOfLesson()) { // admin
                $location.path('/admin/homepage/lessons');

            } else { // user
                $location.path('/user/create/lessons');
            }
        };

        $scope.getStepViewByType = function (step) {
            var type = 'none';
            if (!!step && !!step.type) {
                type = step.type;
            }
            return 'views/lesson/steps/_' + type + '.html';
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
            if (!$scope.lesson) {
                return quizItemsWatch;
            }

            quizItemsWatch.splice(0, quizItemsWatch.length);
            if (!!$scope.lesson.steps) {
                $scope.lesson.steps.forEach(function (step) {
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
            return 'views/lesson/steps/_' + type + '.html';
        };


        $scope.removeItemFromQuiz = function (item, step) {
            if (!!step.quizItems && step.quizItems.length > 0 && step.quizItems.indexOf(item) >= 0) {
                step.quizItems.splice(step.quizItems.indexOf(item), 1);
            }
        };

        function addItemToQuiz(item, step) {
            step.quizItems = step.quizItems || [];
            if (step.quizItems.indexOf(item._id) < 0) {
                if (!$scope.lesson.subject) {
                    $scope.lesson.subject = item.subject;
                }
                if (!$scope.lesson.age) {
                    $scope.lesson.age = item.age;
                }
                if (!$scope.lesson.language) {
                    $scope.lesson.language = item.language;
                }
                if (!$scope.lesson.tags || $scope.lesson.tags.length === 0) {
                    $scope.lesson.tags = item.tags;
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

        function lessonOverrideQuestion(questionIdToOverride, callback) {
            $log.info('in lesson controller, overriding question');
            LergoClient.lessons.overrideQuestion($scope.lesson._id, questionIdToOverride).then(function (result) {
                if (!!callback) {
                    callback(result.data.quizItem._id);
                }
                $scope.lesson = result.data.lesson;
            }, function (result) {
                toastr.error('error while overriding question', result.data);
            });
        }

        // this is a wrapper to 'lessonOverrideQuestion' which will, after
        // lesson update
        // list on quizItemsData change ONCE and reopens the dialog
        function lessonOverrideQuestionAndReopenDialog(step, questionIdToOverride) {
            lessonOverrideQuestion(questionIdToOverride, function (newQuizItemId) {

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

                var canEditOrCopy = result.data.canEdit || isOwnerOfLesson();
                if ($scope.quizItemsData.hasOwnProperty(quizItemId) && canEditOrCopy) {
                    openQuestionDialog(step, $scope.quizItemsData[quizItemId], true);
                }

                if (!canEditOrCopy) {
                    toastr.error($translate.instant('lessons.edit.noPermissionsDescription'), $translate.instant('lessons.edit.noPermissionsTitle'));
                }
            });

        };
        $scope.addCreateQuestion = function (step) {
            $scope.addQuestionBtnDisable = true;
            QuestionsService.createQuestion({
                'subject': $scope.lesson.subject,
                'age': $scope.lesson.age,
                'language': $scope.lesson.language,
                'tags': $scope.lesson.tags
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

        $scope.isLessonInvalid = function () {
            return !!$scope.lesson && !$scope.lesson.name;
        };

        $scope.$on('$locationChangeStart', function (event) { // guy -
            // TODO - consider using route change instead.
            persistScroll();
            if ($scope.isLessonInvalid()) {
                var answer = confirm($filter('translate')('deleteLesson.Confirm'));
                if (!answer) {
                    event.preventDefault();
                } else {
                    LergoClient.lessons.delete($scope.lesson._id).then(function () {
                        $scope.errorMessage = null;
                        $log.info('Lesson deleted sucessfully');
                    }, function (result) {
                        $scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
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
