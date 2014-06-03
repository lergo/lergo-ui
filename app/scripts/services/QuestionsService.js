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

	this.checkAnswer = function(question) {
		return $http.post('/backend/questions/checkAnswer', question);

	};

	this.questionsType = [ {
		'id' : 'trueFalse',
		'label' : 'True or False',
		'updateTemplate' : 'views/questions/update/_trueFalse.html',
		'viewTemplate' : 'views/questions/view/_trueFalse.html',
		'alias' : []
	}, {
		'id' : 'exactMatch',
		'label' : 'Exact Match',
		'updateTemplate' : 'views/questions/update/_exactMatch.html',
		'viewTemplate' : 'views/questions/view/_exactMatch.html',
		'alias' : []
	}, {
		'id' : 'multipleChoices',
		'label' : 'Multiple Choice',
		'updateTemplate' : 'views/questions/update/_multipleChoices.html',
		'viewTemplate' : 'views/questions/view/_multipleChoices.html',
		'alias' : []
	}, {
		'id' : 'openQuestion',
		'label' : 'Open Question',
		'updateTemplate' : 'views/questions/update/_openQuestion.html',
		'viewTemplate' : 'views/questions/view/_openQuestion.html',
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