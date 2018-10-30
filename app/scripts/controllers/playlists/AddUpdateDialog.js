'use strict';

/******
 *
 *
 * Limited editors feature support explained
 * =========================================
 *
 *
 * This dialog supports "limited editors" feature. For sake of documentation here is how it behaves, starting from "edit playlist" view.
 *
 * * Edit Playlist  - Limited editor can see all questions in quiz step, even those they cannot edit (for example, wrong language or subject)
 * * Clicking the question - will open the dialog if user is owner of playlist or if editor can edit
 * * CopyAndOverride option will be displayed if - user cannot edit the question.
 *
 *
 * ## Question
 * Why does "CopyAndOverride" work? Why do we not check for "is owner of playlist"?
 *
 * ## Answer
 * Because when we get to this page, 1 of 2 is true - either I can edit, or I am owner of playlist.
 *
 * Thus, it is enough to check if I can edit, because if I can't, I must be owner, and then I can copy & override..
 *
 *
 *
 *
 *******/

/***
 *
 * @module QuestionsAddUpdateDialogCtrl
 * @description
 * Exposes question CRUD from playlist edit view.
 *
 */
angular.module('lergoApp').controller('PlaylistsAddUpdateDialogCtrl',
		function($scope, $uibModalInstance, quizItem, playlistOverrideQuestion, QuestionsService, isUpdate, $controller, step, addItemToQuiz, $log, $filter) {

			$scope.quizItem = quizItem;
			// this object will be updated by child scope
			// QuestionsUpdateCtrl.
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
                // questions should be added in the ascending order of data e.g question created first should come first
				$scope.selectedItems = _.sortBy(_.filter(items, 'selected'),'lastUpdate');
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
				tooltip : $filter('translate')('questions.createNewQuestion'),
				page : 'views/questions/_update.html',
				isCreate : true,
				add : function(item) {
					addItem(item, false);
				},
				addClose : function(item) {
					addItem(item, true);
				}
			}, {
				id : 'myLessons',
				controller : 'LessonsIndexCtrl',
				tooltip : $filter('translate')('lessons.selectMyLessons'),
				page : 'views/lessons/_index.html',
				questionTypeToLoad : 'myLessons',
				isCreate : false,
				add : function() {
					addSelectedItems(false);
				},
				addClose : function() {
					addSelectedItems(true);
				}
			}, {
				id : 'allLessons',
				controller : 'LessonsIndexCtrl',
				tooltip : $filter('translate')('lessons.selectAllLessons'),
				page : 'views/lessons/_index.html',
				questionTypeToLoad : 'allLessons',
				isCreate : false,
				add : function() {
					addSelectedItems(false);
				},
				addClose : function() {
					addSelectedItems(true);
				}
			}, {
				id : 'likedLessons',
				controller : 'LessonsIndexCtrl',
				tooltip : $filter('translate')('lessons.selectLikedLessons'),
				page : 'views/lessons/_index.html',
				questionTypeToLoad : 'likedLessons',
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
				if (!!section.lessonTypeToLoad) {
					$scope.lessonTypeFormAddQuizPopup.value = section.lessonTypeToLoad;
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
                        answer = confirm($filter('translate')('deleteQuestion.Confirm'));
                    }
                    if ( !!answer ) {
                        QuestionsService.deleteQuestion(item._id);
                    }else{
                        return; // do nothing!
                    }
				}
                $uibModalInstance.dismiss();
			};
			/**
			 * There are so many things we need to have to enable copy and
			 * override, we better wrap it in a function.
			 */
			$scope.canCopyAndOverride = function() { // guy: natively support limitedEditors - see page top comment

				// we can query $scope.permissions even
				// though it is populated in child scope
				// because child controller supports update
				// for my $scope.permissions model rather
				// than overriding it

				return !!playlistOverrideQuestion &&
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
                $uibModalInstance.close(item);
				// we will soon open the new modal instance with
				// the copied question.
				playlistOverrideQuestion(step, item._id);
			};

			$scope.isValid = function(quizItem) {
				if (!quizItem || !quizItem.type) {
					return false;
				}
				return QuestionsService.getTypeById(quizItem.type).isValid(quizItem);
			};

		});
