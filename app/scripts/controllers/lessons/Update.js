'use strict';

angular.module('lergoApp').controller('LessonsUpdateCtrl', function($scope, $log, LergoClient, $location, $routeParams, ContinuousSave, FilterService, $modal, QuestionsService,$rootScope) {
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
		if(!$scope.lesson.language){
			$scope.lesson.language=FilterService.getLanguageByLocale($rootScope.lergoLanguage);
		}
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
		var canDelete = window.confirm('Are you sure you want to delete the step: ' + step.title + ' ?');
		if (canDelete) {
			var steps = $scope.lesson.steps;
			if (!!steps && steps.length > 0 && steps.indexOf(step) >= 0) {
				steps.splice(steps.indexOf(step), 1);
			}
			$log.info('Step deleted sucessfully');
		}
	};

	$scope.done = function() {
		$location.path('/user/create/lessons');
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
	 * watch questions in step. iterates over all steps of type 'quiz' and turns
	 * the quizItems arrays to a single array *
	 */
	$scope.$watch(function() {
		if (!$scope.lesson) {
			return quizItemsWatch;
		}

		quizItemsWatch.splice(0, quizItemsWatch.length);
		if (!!$scope.lesson.steps) {
			$scope.lesson.steps.forEach(function(step/*
														 * , index
														 */) {
				if (!!step.quizItems && step.quizItems.length > 0) {

					step.quizItems.forEach(function(quizItem) {

						if (quizItemsWatch.indexOf(quizItem) < 0) {
							quizItemsWatch.push(quizItem);
						}

					});
				}
			});
		}
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

	$scope.addItemToQuiz = function(item, step) {

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
			if (!$scope.lesson.tags) {
				$scope.lesson.tags = item.tags;
			}
			step.quizItems.push(item._id);
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

	$scope.openQuestionBank = function(step) {
		$modal.open({
			templateUrl : 'views/questions/modalindex.html',
			windowClass : 'question-bank-dialog',
			backdrop : 'static',
			controller : [ '$scope', '$modalInstance', 'step', 'addItemToQuiz', function($scope, $modalInstance, step, addItemToQuiz) {
				$scope.ok = function(items) {
					angular.forEach(items, function(item) {
						if (item.selected === true) {
							addItemToQuiz(item, step);
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
	
	$scope.openUpdateQuestion = function(step,quizItemId){
		LergoClient.questions.getUserQuestionById(quizItemId).then(function(result) {
		$scope.openCreateQuestionDialog(step, result.data);});
	};

	$scope.openCreateQuestion = function(step) {
		QuestionsService.createQuestion({
			'subject' : $scope.lesson.subject,
			'age' : $scope.lesson.age,
			'language' : $scope.lesson.language,
			'tags' : $scope.lesson.tags
		}).then(function(result) {
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
			backdrop : 'static',
			controller : [ '$scope', '$modalInstance', 'step', 'addItemToQuiz', 'quizItem', 'QuestionsService', function($scope, $modalInstance, step, addItemToQuiz, quizItem, QuestionsService) {
				$scope.qItem = quizItem;
				$scope.ok = function(item) {
					addItemToQuiz(item, step);
					$modalInstance.close();
				};
				$scope.cancel = function(item) {
					if (!$scope.isValid(item)) {
						QuestionsService.deleteQuestion(item._id);
					}
					$modalInstance.dismiss('cancel');
				};
				$scope.isValid = function(quizItem) {
					if (!quizItem || !quizItem.type) {
						return false;
					}
					return QuestionsService.getTypeById(quizItem.type).isValid(quizItem);
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
	$scope.$on('$locationChangeStart', function(event) {
		if (!$scope.lesson.name) {
			var answer = confirm('For the lesson to be created and saved, you must fill at least the Name field. By leaving this page without filling this field, all changes will be lost.');
			if (!answer) {
				event.preventDefault();
			} else {
				LergoClient.lessons.delete($scope.lesson._id).then(function() {
					$scope.errorMessage = null;
					$log.info('Lesson deleted sucessfully');
				}, function(result) {
					$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			}
		}
	});

});
