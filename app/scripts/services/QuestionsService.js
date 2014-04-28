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

	this.submitAnswer = function(question, answer) {
		return $http.post('/backend/user/questions/' + question._id + '/answer', answer);
	};

	this.questionsType = [ {
		'id' : 'trueFalse',
		'label' : 'True or False',
		'updateTemplate' : 'views/questions/update/_trueFalse.html',
		'viewTemplate' : 'views/questions/view/_trueFalse.html',
		'alias' : []
	}, {
		'id' : 'multipleChoiceSingleAnswer',
		'label' : 'Multiple Choices Single Answer',
		'updateTemplate' : 'views/questions/update/_multiChoiceSingleAnswer.html',
		'viewTemplate' : 'views/questions/view/_multiChoiceSingleAnswer.html',
		'alias' : []
	}, {
		'id' : 'multipleChoicesMultipleAnswers',
		'label' : 'Multiple Choices Multiple Answers',
		'updateTemplate' : 'views/questions/update/_multiChoiceMultipleAnswers.html',
		'viewTemplate' : 'views/questions/view/_multiChoiceMultipleAnswers.html',
		'alias' : []
	}, {
		'id' : 'exactMatch',
		'label' : 'Exact Match',
		'updateTemplate' : 'views/questions/update/_exactMatch.html',
		'viewTemplate' : 'views/questions/view/_exactMatch.html',
		'alias' : []
	}, {
		'id' : 'fillInTheBlanks',
		'label' : 'Fill In The Blanks',
		'updateTemplate' : 'views/questions/update//_fillInTheBlanks.html',
		'viewTemplate' : 'views/questions/view/_fillInTheBlanks.html',
		'alias' : []
	}

	];

	this.getTypeById = function(typeId) {
		for ( var i = 0; i < this.questionsType.length; i++) {
			if (typeId === this.questionsType[i].id) {
				return this.questionsType[i];
			}

		}
		throw new Error('type ' + typeId + ' is unsupported ');
	};
});