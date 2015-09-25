'use strict';

angular.module('lergoApp').controller('QuestionsAddUpdateDialogCtrl',
		function($scope, $modalInstance, quizItem, lessonOverrideQuestion, QuestionsService, isUpdate, $controller, step, addItemToQuiz, $log, $filter) {

			$scope.quizItem = quizItem;
			// this object will be updated by child scope
			// UpdateQuestionCtrl.
			$scope.permissions = {};
			$scope.isModal = true;
			$scope.isCreate = true;
			$scope.quizItem = quizItem;
			$scope.isUpdate = isUpdate;
			$scope.questionTypeFormAddQuizPopup = {
				value : 'myQuestions'
			};
			var items = [];
			$scope.$on('questionsLoaded', function(event, data) {
				items = data.items;
				if (!!step && !!step.quizItems) {
					_.each(items, function(q) {
						if (step.quizItems.indexOf(q._id) !== -1) {
							q.alreadyAdded = true;
						}
					});
				}

			});
			function addSelectedItems(canClose) {
				$scope.selectedItems = _.filter(items, 'selected');
				angular.forEach($scope.selectedItems, function(item) {
					addItemToQuiz(item, step);
					item.selected = false;
					item.alreadyAdded = true;
				});
				if ($scope.selectedItems.length > 0 && !!canClose) {
					$scope.cancel();
				}
			}
			function addItem(item, canClose) {
				addItemToQuiz(item, step);
				if (!!canClose) {
					$scope.cancel();
				} else {
					QuestionsService.createQuestion({
						'subject' : $scope.quizItem.subject,
						'age' : $scope.quizItem.age,
						'language' : $scope.quizItem.language,
						'tags' : $scope.quizItem.tags
					}).then(function(result) {
						$scope.quizItem = result.data;
					});
				}
			}
			$scope.sections = [ {
				id : 'createNewQuestion',
				controller : 'QuestionsUpdateCtrl',
				tooltip : $filter('i18n')('questions.createNewQuestion'),
				page : 'views/questions/_update.html',
				isCreate : true,
				add : function(item) {
					addItem(item, false);
				},
				addClose : function(item) {
					addItem(item, true);
				}
			}, {
				id : 'myQuestions',
				controller : 'QuestionsIndexCtrl',
				tooltip : $filter('i18n')('questions.selectMyQuestions'),
				page : 'views/questions/_index.html',
				questionTypeToLoad : 'myQuestions',
				isCreate : false,
				add : function() {
					addSelectedItems(false);
				},
				addClose : function() {
					addSelectedItems(true);
				}
			}, {
				id : 'allQuestions',
				controller : 'QuestionsIndexCtrl',
				tooltip : $filter('i18n')('questions.selectAllQuestions'),
				page : 'views/questions/_index.html',
				questionTypeToLoad : 'allQuestions',
				isCreate : false,
				add : function() {
					addSelectedItems(false);
				},
				addClose : function() {
					addSelectedItems(true);
				}
			}, {
				id : 'likedQuestions',
				controller : 'QuestionsIndexCtrl',
				tooltip : $filter('i18n')('questions.selectLikedQuestions'),
				page : 'views/questions/_index.html',
				questionTypeToLoad : 'likedQuestions',
				isCreate : false,
				add : function() {
					addSelectedItems(false);
				},
				addClose : function() {
					addSelectedItems(true);
				}
			} ];
			$scope.setCurrentSelection = function(section) {
				$scope.currentSection = section;
				$scope.isCreate = section.isCreate;
				if (!!section.questionTypeToLoad) {
					$scope.questionTypeFormAddQuizPopup.value = section.questionTypeToLoad;
				}

			};

			$scope.currentSection = _.find($scope.sections, function(section) {
				return 'createNewQuestion' === section.id;
			});

            function isCreateNewQuestionSection (){
                return $scope.currentSection.id === 'createNewQuestion';
            }

			$controller($scope.currentSection.controller, {
				$scope : $scope
			});

			$scope.isActive = function(section) {
				return !!$scope.currentSection && section.id === $scope.currentSection.id;
			};

			$scope.getInclude = function() {
				return $scope.currentSection.page;
			};

			$scope.cancel = function() {
				var item = $scope.quizItem;
				if (!!item && !$scope.isValid(item)) {
                    var answer = true;
                    if ( isCreateNewQuestionSection() ){
                        answer = confirm($filter('i18n')('deleteQuestion.Confirm'));
                    }
                    if ( !!answer ) {
                        QuestionsService.deleteQuestion(item._id);
                    }else{
                        return; // do nothing!
                    }
				}
				$modalInstance.dismiss();
			};
			/**
			 * There are so many things we need to have to enable copy and
			 * override, we better wrap it in a function.
			 */
			$scope.canCopyAndOverride = function() {

				// we can query $scope.permissions even
				// though it is populated in child scope
				// because child controller supports update
				// for my $scope.permissions model rather
				// than overriding it

				return !!lessonOverrideQuestion &&
				// we should have a parent's function to
				// complete the task
				!!$scope.quizItem && !!$scope.quizItem._id &&
				// we should have an item to override
				!!$scope.permissions &&
				// we should have permissions from backend
				!$scope.permissions.canEdit &&
				// user should not be able to edit
				!!$scope.permissions.canCopy;
				// user should be able to copy
			};

			$scope.copyAndReplaceQuestion = function(item) {
				$log.info('copying and replacing question from modal instance');
				$modalInstance.close(item);
				// we will soon open the new modal instance with
				// the copied question.
				lessonOverrideQuestion(step, item._id);
			};

			$scope.isValid = function(quizItem) {
				if (!quizItem || !quizItem.type) {
					return false;
				}
				return QuestionsService.getTypeById(quizItem.type).isValid(quizItem);
			};

		});
