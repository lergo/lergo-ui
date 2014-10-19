'use strict';

angular.module('lergoApp').controller('QuestionsAddUpdateDialogCtrl',
		function($scope, $modalInstance, quizItem, lessonOverrideQuestion, QuestionsService, isUpdate, $controller, step, addItemToQuiz, $log) {

			$scope.quizItem = quizItem;
			// this object will be updated by child scope
			// UpdateQuestionCtrl.
			$scope.permissions = {};
			$scope.isModal = true;
			$scope.isCreate = true;
			$scope.quizItem = quizItem;
			$scope.isUpdate = isUpdate;
			$scope.loadPublic = {
				value : false
			};
			function addSelectedItems(items, canClose) {
				$scope.selectedItems = _.filter(items, 'selected');
				angular.forEach($scope.selectedItems, function(item) {
					addItemToQuiz(item, step);
					item.selected = false;
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
				key : 'createNewQuestion',
				page : 'views/questions/_update.html',
				loadPublic : false,
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
				key : 'myQuestions',
				page : 'views/questions/_index.html',
				loadPublic : false,
				isCreate : false,
				add : function(items) {
					addSelectedItems(items, false);
				},
				addClose : function(items) {
					addSelectedItems(items, true);
				}
			}, {
				id : 'publicQuestion',
				controller : 'QuestionsIndexCtrl',
				key : 'allQuestions',
				page : 'views/questions/_index.html',
				loadPublic : true,
				isCreate : false,
				add : function(items) {
					addSelectedItems(items, false);
				},
				addClose : function(items) {
					addSelectedItems(items, true);
				}
			} ];
			$scope.setCurrentSelection = function(section) {
				$scope.currentSection = section;
				$scope.isCreate = section.isCreate;
				$scope.loadPublic.value = section.loadPublic;
				$controller($scope.currentSection.controller, {
					$scope : $scope
				});

			};

			$scope.currentSection = _.find($scope.sections, function(section) {
				return 'createNewQuestion' === section.id;
			});

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
					QuestionsService.deleteQuestion(item._id);
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
