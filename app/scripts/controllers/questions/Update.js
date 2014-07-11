'use strict';

angular
		.module('lergoApp')
		.controller(
				'QuestionsUpdateCtrl',
				function($scope, QuestionsService, $routeParams, ContinuousSave, $log, $location, FilterService) {

					var saveQuestion = new ContinuousSave({
						'saveFn' : function(value) {
							return QuestionsService.updateQuestion(value);
						}
					});
					$scope.saveQuestion = saveQuestion;

					var questionId = $routeParams.questionId;

					$scope.types = QuestionsService.questionsType;
					$scope.subjects = FilterService.subjects;
					$scope.languages = FilterService.languages;

                    function loadQuestion() {
                        QuestionsService.getQuestionById(questionId).then(function (result) {
                            $scope.quizItem = result.data;
                            // To determine whether advance option should be open or
                            // not
                            var q = $scope.quizItem;
                            $scope.isCollapsed = (!!q.media || !!q.hint || !!q.explanation || !!q.summary);
                            $scope.errorMessage = null;
                        }, function (result) {
                            $scope.error = result.data;
                            $scope.errorMessage = 'Error in fetching questions by id : ' + result.data.message;
                            $log.error($scope.errorMessage);
                        });
                    }

                    if ( !!questionId ){
                        loadQuestion();
                    }


					$scope.$watch('quizItem', saveQuestion.onValueChange, true);
                    $scope.$watch(function(){ return $scope.quizItem.media;}, function(newValue/*, oldValue*/){
                        // guy - todo - remove this when we organize the model for media
                        if ( newValue !== 'image' ){
                            $scope.quizItem.imageUrl = null;
                        }

                        if ( newValue !== 'audio'){
                            $scope.quizItem.audioUrl = null;
                        }
                    });

					// setInterval( function(){ console.log($scope.quizItem)},
					// 1000);

					$scope.getQuestionUpdateTemplate = function() {
						if (!!$scope.quizItem && !!$scope.quizItem.type) {
							var type = QuestionsService.getTypeById($scope.quizItem.type);
							return type.updateTemplate;
						}
						return '';
					};

					$scope.addOption = function() {
						if ($scope.quizItem.options === undefined) {
							$scope.quizItem.options = [];
						}
						// UNTRANSLATED
						var newOption = {
							'label' : ''
						};
						$scope.quizItem.options.push(newOption);

					};
					$scope.updateAnswer = function($event, answer, quizItem) {
						if (quizItem.answer === undefined) {
							quizItem.answer = [];
						}
						var checkbox = $event.target;
						if (checkbox.checked) {
							quizItem.answer.push(answer);
						} else {
							quizItem.answer.splice(quizItem.answer.indexOf(answer), 1);
						}
					};
					$scope.isCorrectAnswer = function(answer, quizItem) {
						if (quizItem.answer === undefined) {
							return false;
						}
						return quizItem.answer.indexOf(answer) > -1;
					};

					$scope.removeOption = function(option) {
						$scope.quizItem.options.splice($scope.quizItem.options.indexOf(option), 1);
						if ($scope.quizItem.answer !== undefined) {
							$scope.quizItem.answer.splice($scope.quizItem.answer.indexOf(option), 1);
						}
					};

					$scope.isSaving = function() {
						return !!saveQuestion.getStatus().saving;
					};

					$scope.done = function() {
						$location.path('/user/create/questions');
					};
					$scope
							.$on(
									'$locationChangeStart',
									function(event) {
										if (!$scope.isValid($scope.quizItem)) {
											var answer = confirm('For the question to be created and saved, you must fill at least the Question field, Question Type and define a Correct Answer. By leaving this page without filling these fields, all changes will be lost.');
											if (!answer) {
												event.preventDefault();
											} else {
												QuestionsService.deleteQuestion(questionId);
											}
										}
									});

					$scope.isValid = function(quizItem) {
						if (!quizItem || !quizItem.type) {
							return false;
						}
						return QuestionsService.getTypeById(quizItem.type).isValid(quizItem);
					};

				});
