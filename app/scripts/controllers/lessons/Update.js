'use strict';

angular.module('lergoApp').controller(
		'LessonsUpdateCtrl',
		function($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, FilterService, $modal, QuestionsService) {
			$scope.subjects = FilterService.subjects;
			$scope.languages = FilterService.languages;
			var saveLesson = new ContinuousSave({
				'saveFn' : function(value) {
					return LergoClient.lessons.update(value);
				}
			});

			$scope.isSaving = function() {
				return !!saveLesson.getStatus().saving;
			};

			$scope.displayStep = function(step) {
				$location.path('/user/lessons/step/display').search('data', JSON.stringify(step));
			};

			LergoClient.lessons.getById($routeParams.lessonId).then(function(result) {
				$scope.lesson = result.data;
				$scope.errorMessage = null;
				$scope.$watch('lesson', saveLesson.onValueChange, true);
			}, function(result) {
				$scope.errorMessage = 'Error in fetching Lesson by id : ' + result.data.message;
				$log.error($scope.errorMessage);
			});

			$scope.stepTypes = [ {
				'id' : 'video',
				'label' : 'Video'
			}, {
				'id' : 'quiz',
				'label' : 'Quiz'
			} ];

			LergoClient.lessons.getById($routeParams.lessonId).then(function(result) {
				$scope.lesson = result.data;
				$scope.$watch('lesson', saveLesson.onValueChange, true);
			});

			$scope.addStep = function(lesson) {
				if (!lesson.steps) {
					lesson.steps = [];
				}

				lesson.steps.push({});
			};
			$scope.moveStepUp = function(index) {
				var temp = $scope.lesson.steps[index - 1];
				if (temp) {
					$scope.lesson.steps[index - 1] = $scope.lesson.steps[index];
					$scope.lesson.steps[index] = temp;
				}
			};
			$scope.moveStepDown = function(index) {
				var temp = $scope.lesson.steps[index + 1];
				if (temp) {
					$scope.lesson.steps[index + 1] = $scope.lesson.steps[index];
					$scope.lesson.steps[index] = temp;
				}

			};
			$scope.deleteStep = function(step) {
				var steps = $scope.lesson.steps;
				if (!!steps && steps.length > 0 && steps.indexOf(step) >= 0) {
					steps.splice(steps.indexOf(step), 1);
				}
			};

			$scope.done = function() {
				$location.path('/user/lessons');
			};

			$scope.getStepViewByType = function(step) {
				var type = 'none';
				if (!!step && !!step.type) {
					type = step.type;
				}
				return 'views/lesson/steps/_' + type + '.html';
			};

			LergoClient.questions.getUserQuestions().then(function(result) {
				$scope.quizItems = result.data;
				$scope.errorMessage = null;
			}, function(result) {
				$scope.errorMessage = 'Error in fetching questions for user : ' + result.data.message;
				$log.error($scope.errorMessage);
			});

			var quizItemsWatch = [];
			$scope.quizItemsData = {};

			$scope.getQuestion = function(item) {
				if ($scope.quizItemsData.hasOwnProperty(item)) {
					return $scope.quizItemsData[item].question;
				}
				return null;
			};

			/**
			 * watch questions in step. iterates over all steps of type 'quiz'
			 * and turns the quizItems arrays to a single array *
			 */
			$scope.$watch(function() {
				if (!$scope.lesson) {
					return quizItemsWatch;
				}

				quizItemsWatch.splice(0, quizItemsWatch.length);

				$scope.lesson.steps.forEach(function(step/* , index */) {
					if (!!step.quizItems && step.quizItems.length > 0) {

						step.quizItems.forEach(function(quizItem) {

							if (quizItemsWatch.indexOf(quizItem) < 0) {
								quizItemsWatch.push(quizItem);
							}

						});
					}
				});
				return quizItemsWatch;
			}, function(newValue, oldValue) {
				if (!!newValue && newValue.length > 0) {
					$log.info('quizItems changed', newValue, oldValue);
					LergoClient.questions.findQuestionsById(newValue).then(function(result) {
						var newObj = {};
						for ( var i = 0; i < result.data.length; i++) {
							newObj[result.data[i]._id] = result.data[i];
						}
						$scope.quizItemsData = newObj;
					});
				}
			}, true);

			$scope.done = function() {
				$location.path('/user/lessons');
			};

			$scope.getStepViewByType = function(step) {
				var type = 'none';
				if (!!step && !!step.type) {
					type = step.type;
				}
				return 'views/lesson/steps/_' + type + '.html';
			};

			LergoClient.questions.getUserQuestions().then(function(result) {
				$scope.quizItems = result.data;
			});

			$scope.removeItemFromQuiz = function(item, step) {
				if (!!step.quizItems && step.quizItems.length > 0 && step.quizItems.indexOf(item) >= 0) {
					step.quizItems.splice(step.quizItems.indexOf(item), 1);
				}
			};

			$scope.addItemToQuiz = function(itemId, step) {

				step.quizItems = step.quizItems || [];
				if (step.quizItems.indexOf(itemId) < 0) {
					step.quizItems.push(itemId);
				}
			};

			$scope.moveQuizItemUp = function(index, step) {
				if (!!step.quizItems) {
					var temp = step.quizItems[index - 1];
					if (temp) {
						step.quizItems[index - 1] = step.quizItems[index];
						step.quizItems[index] = temp;
					}
				}
			};
			$scope.moveQuizItemDown = function(index, step) {
				if (!!step.quizItems) {
					var temp = step.quizItems[index + 1];
					if (temp) {
						step.quizItems[index + 1] = step.quizItems[index];
						step.quizItems[index] = temp;
					}
				}

			};

			$scope.createNewQuestion = function() {
				var quizItem = null;
				QuestionsService.createQuestion().then(function(result) {
					$scope.errorMessage = null;
					quizItem = result.data;
				}, function(result) {
					$scope.error = result.data;
					$scope.errorMessage = 'Error in creating questions : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
				return quizItem;
			};
			$scope.openQuestionBank = function(step) {
				$modal.open({
					templateUrl : 'views/questions/modalindex.html',
					windowClass : 'question-bank-dialog',
					controller : [ '$scope', '$modalInstance', 'step', 'addItemToQuiz', function($scope, $modalInstance, step, addItemToQuiz) {
						$scope.ok = function(items) {
							angular.forEach(items, function(item) {
								if (item.selected === true) {
									addItemToQuiz(item._id, step);
								}
							});
							$modalInstance.close();
						};

						$scope.cancel = function() {
							$modalInstance.dismiss('cancel');
						};
					} ],
					resolve : {
						step : function() {
							return step;
						},
						addItemToQuiz : function() {
							return $scope.addItemToQuiz;
						}
					}
				});
			};

			$scope.openCreateQuestion = function(step) {
				QuestionsService.createQuestion().then(function(result) {
					$scope.errorMessage = null;
					$scope.openCreateQuestionDialog(step, result.data);
				}, function(result) {
					$scope.error = result.data;
					$scope.errorMessage = 'Error in creating questions : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			};
			$scope.openCreateQuestionDialog = function(step, quizItem) {
				$modal.open({
					templateUrl : 'views/questions/modalupdate.html',
					windowClass : 'question-create-dialog',
					controller : [ '$scope', '$modalInstance', 'step', 'addItemToQuiz', 'quizItem',
							function($scope, $modalInstance, step, addItemToQuiz, quizItem) {
								$scope.qItem = quizItem;
								$scope.ok = function(item) {
									addItemToQuiz(item._id, step);
									$modalInstance.close();
								};
								$scope.cancel = function() {
									$modalInstance.dismiss('cancel');
								};
							} ],
					resolve : {
						quizItem : function() {
							return quizItem;
						},
						step : function() {
							return step;
						},
						addItemToQuiz : function() {
							return $scope.addItemToQuiz;
						}
					}
				});
			};

		});
