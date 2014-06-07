'use strict';

angular.module('lergoApp').service('QuestionsService', function QuestionsService($http) {
	// AngularJS will instantiate a singleton by calling "new" on this function
	this.getUserQuestions = function() {
		return $http.get('/backend/user/questions');
	};

	this.getUserQuestionById = function(questionId) {
		return $http.get('/backend/user/questions/' + questionId);
	};

	this.findQuestionsById = function(ids) {
        debugger;
		return $http({
			'url' : '/backend/questions/find',
			'method' : 'GET',
			params : {
				'ids' : ids
			}
		});
	};

	this.createQuestion = function(question) {
		return $http.post('/backend/user/questions', question);
	};

	this.updateQuestion = function(question) {
		return $http.post('/backend/user/questions/' + question._id, question);
	};

	this.getLessonsWhoUseThisQuestion = function(question) {
		return $http.get('/backend/user/questions/' + question._id + '/usages');
	};

	this.checkAnswer = function(question) {
		return $http.post('/backend/questions/checkAnswer', question);

	};

	this.questionsType = [ {
		'id' : 'trueFalse',
		'label' : 'True or False',
		'updateTemplate' : 'views/questions/update/_trueFalse.html',
		'viewTemplate' : 'views/questions/view/_trueFalse.html',
		'answers' : function(quizItem) {
			var answers = [];
			answers.push(quizItem.answer);
			return answers;
		},
		'alias' : []
	}, {
		'id' : 'exactMatch',
		'label' : 'Exact Match',
		'updateTemplate' : 'views/questions/update/_exactMatch.html',
		'viewTemplate' : 'views/questions/view/_exactMatch.html',
		'answers' : function(quizItem) {
			var answers = [];
			quizItem.options.forEach(function(value) {
				answers.push(value.label);
			});
			return answers;
		},
		'alias' : []
	}, {
		'id' : 'multipleChoices',
		'label' : 'Multiple Choice',
		'updateTemplate' : 'views/questions/update/_multipleChoices.html',
		'viewTemplate' : 'views/questions/view/_multipleChoices.html',
		'answers' : function(quizItem) {
			var answers = [];
			if (quizItem.type === 'multipleChoices') {
				quizItem.options.forEach(function(value) {
					if (value.checked === true) {
						answers.push(value.label);
					}
				});
			}
			return answers;
		},
		'alias' : []
	}, {
		'id' : 'openQuestion',
		'label' : 'Open Question',
		'updateTemplate' : 'views/questions/update/_openQuestion.html',
		'viewTemplate' : 'views/questions/view/_openQuestion.html',
		'answers' : function(quizItem) {
			var answers = [];
			answers.push(quizItem.answer);
			return answers;
		},
		'alias' : []
	} ];

	this.getTypeById = function(typeId) {
		for ( var i = 0; i < this.questionsType.length; i++) {
			if (typeId === this.questionsType[i].id) {
				return this.questionsType[i];
			}

		}
		throw new Error('type ' + typeId + ' is unsupported ');
	};
});