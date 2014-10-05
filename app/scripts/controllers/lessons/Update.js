'use strict';

angular.module('lergoApp').controller(
    'LessonsUpdateCtrl',
    function ($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, FilterService, $modal, TagsService, QuestionsService, $rootScope, $window) {
        $window.scrollTo(0, 0);
        $scope.subjects = FilterService.subjects;
        $scope.languages = FilterService.languages;
        var saveLesson = new ContinuousSave({
            'saveFn': function (value) {
                return LergoClient.lessons.update(value);
            }
        });

        $scope.isSaving = function () {
            return !!saveLesson.getStatus().saving;
        };

        $scope.displayStep = function (step) {
            $location.path('/user/lessons/step/display').search('data', JSON.stringify(step));
        };

        LergoClient.lessons.getById($routeParams.lessonId).then(function (result) {
            $scope.lesson = result.data;
            $scope.errorMessage = null;
            $scope.$watch('lesson', saveLesson.onValueChange, true);
            $scope.$watch('lesson.nextLesson', updateNextLesson);
            $scope.$watch('lesson.priorLesson', updatePriorLesson);
            if (!$scope.lesson.language) {
                $scope.lesson.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
            }

            if (!$scope.lesson.tags) {
                $scope.lesson.tags = [];
            }
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
   }];

        $scope.addStep = function (lesson) {
            if (!lesson.steps) {
                lesson.steps = [];
            }

            lesson.steps.push({
                'testMode': 'False'
            });
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
            var canDelete = window.confirm('Are you sure you want to delete the step: ' + step.title + ' ?');
            if (canDelete) {
                var steps = $scope.lesson.steps;
                if (!!steps && steps.length > 0 && steps.indexOf(step) >= 0) {
                    steps.splice(steps.indexOf(step), 1);
                }
                $log.info('Step deleted sucessfully');
            }
        };

        $scope.done = function () {
            $location.path('/user/create/lessons');
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
         * watch questions in step. iterates over all steps of type 'quiz' and
         * turns the quizItems arrays to a single array *
         */
        $scope.$watch(function () {
            if (!$scope.lesson) {
                return quizItemsWatch;
            }

            quizItemsWatch.splice(0, quizItemsWatch.length);
            if (!!$scope.lesson.steps) {
                $scope.lesson.steps.forEach(function (step
                    /*
                     * , index
                     */
                ) {
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

        LergoClient.questions.getUserQuestions().then(function (result) {
            $scope.quizItems = result.data;
        });

        $scope.removeItemFromQuiz = function (item, step) {
            if (!!step.quizItems && step.quizItems.length > 0 && step.quizItems.indexOf(item) >= 0) {
                step.quizItems.splice(step.quizItems.indexOf(item), 1);
            }
        };

        $scope.addItemToQuiz = function (item, step) {

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
        };

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
        $scope.openMyQuestionBank = function (step) {
            $scope.openQuestionBankDialog(step);
        };

        $scope.openPublicQuestionBank = function (step) {
            $scope.openQuestionBankDialog(step, true);
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
                        $scope.openCreateUpdateQuestionDialog(step, $scope.quizItemsData[newQuizItemId], false);
                    } finally {
                        unregister();
                    }
                });
            });
        }

        $scope.openQuestionBankDialog = function (step, isPublic) {
            $modal.open({
                templateUrl: 'views/questions/modalindex.html',
                windowClass: 'question-bank-dialog',
                backdrop: 'static',
                controller: ['$scope', '$modalInstance', 'step', 'addItemToQuiz', 'opts',
                                   function ($scope, $modalInstance, step, addItemToQuiz, opts) {
                        $scope.emptySelection = false;
                        $scope.isPublic = opts.isPublic;
                        $scope.ok = function (items) {
                            var isEmpty = true;
                            angular.forEach(items, function (item) {
                                if (item.selected === true) {
                                    isEmpty = false;
                                    addItemToQuiz(item, step);
                                }
                            });




                            $scope.emptySelection = isEmpty;
                            if (!isEmpty) {
                                $modalInstance.close();
                            }
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
     }],
                resolve: {
                    step: function () {
                        return step;
                    },
                    addItemToQuiz: function () {
                        return $scope.addItemToQuiz;
                    },


                    opts: function () {
                        return {
                            'isPublic': !!isPublic
                        };
                    }
                }
            });
        };

        $scope.openUpdateQuestion = function (step, quizItemId) {
            if ($scope.quizItemsData.hasOwnProperty(quizItemId)) {
                $scope.openCreateUpdateQuestionDialog(step, $scope.quizItemsData[quizItemId], false);
            }
        };

        $scope.openCreateQuestion = function (step) {
            QuestionsService.createQuestion({
                'subject': $scope.lesson.subject,
                'age': $scope.lesson.age,
                'language': $scope.lesson.language,
                'tags': $scope.lesson.tags
            }).then(function (result) {
                $scope.errorMessage = null;
                $scope.openCreateUpdateQuestionDialog(step, result.data, true);
            }, function (result) {
                $scope.error = result.data;
                $scope.errorMessage = 'Error in creating questions : ' + result.data.message;
                $log.error($scope.errorMessage);
            });
        };
        $scope.openCreateUpdateQuestionDialog = function (step, quizItem, isCreate) {
            $modal.open({
                templateUrl: 'views/questions/modalupdate.html',
                windowClass: 'question-create-dialog',
                backdrop: 'static',
                controller: ['$scope', '$modalInstance', 'step', 'addItemToQuiz', 'quizItem', 'QuestionsService', 'isCreate', 'lessonOverrideQuestion',
       function ($scope, $modalInstance, step, addItemToQuiz, quizItem, QuestionsService, isCreate, lessonOverrideQuestion) {
                        $scope.quizItem = quizItem;
                        $scope.permissions = {}; // this object will
                        // be updated by
                        // child scope
                        // UpdateQuestionCtrl.
                        $scope.create = isCreate;
                        $scope.ok = function (item) {
                            addItemToQuiz(item, step);
                            $modalInstance.close();
                        };


                        /**
                         * There are so many things we need to have to enable
                         * copy and override, we better wrap it in a function.
                         */
                        $scope.canCopyAndOverride = function () {

                            // we can query $scope.permissions even
                            // though it is populated in child scope
                            // because child controller supports update
                            // for my $scope.permissions model rather
                            // than overriding it

                            return !!lessonOverrideQuestion &&
                            // we should have a parent's function to
                            // complete the task
                            !!$scope.quizItem._id &&
                            // we should have an item to override
                            !!$scope.permissions &&
                            // we should have permissions from backend
                            !$scope.permissions.canEdit &&
                            // user should not be able to edit
                            !!$scope.permissions.canCopy;
                            // user should be able to copy
                        };

                        $scope.copyAndReplaceQuestion = function (item) {
                            $log.info('copying and replacing question from modal instance');
                            $modalInstance.close(); // we will soon open
                            // the new modal
                            // instance with the
                            // copied question.
                            lessonOverrideQuestion(step, item._id);
                        };


                        $scope.cancel = function (item) {
                            if (!$scope.isValid(item)) {
                                QuestionsService.deleteQuestion(item._id);
                            }
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.isValid = function (quizItem) {
                            if (!quizItem || !quizItem.type) {
                                return false;
                            }
                            return QuestionsService.getTypeById(quizItem.type).isValid(quizItem);
                        };
       }],
                resolve: {
                    quizItem: function () {
                        return quizItem;
                    },
                    step: function () {
                        return step;
                    },
                    lessonOverrideQuestion: function () {
                        return lessonOverrideQuestionAndReopenDialog;
                    },
                    addItemToQuiz: function () {
                        return $scope.addItemToQuiz;
                    },
                    isCreate: function () {
                        return isCreate;
                    }
                }
            });
        };
        $scope.$on('$locationChangeStart', function (event) {
            if (!$scope.lesson.name) {
                var answer = confirm($filter('i18n')('deleteLesson.Confirm'));
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

    });