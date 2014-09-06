'use strict';

angular.module('lergoApp').service('QuestionsService', function QuestionsService($http, $log) {
	// AngularJS will instantiate a singleton by calling "new" on this function
	this.getUserQuestions = function() {
		return $http.get('/backend/user/questions');
	};

	this.copyQuestion = function(questionId) {
		$log.info('copying question');
		return $http.post('/backend/questions/' + questionId + '/copy');
	};

	this.getQuestionById = function(questionId) {
		if (!!questionId) {
			return $http.get('/backend/questions/' + questionId);
		}
	};

	this.findQuestionsById = function(ids) {
		return $http({
			'url' : '/backend/questions/find',
			'method' : 'GET',
			params : {
				'questionsId' : ids
			}
		});
	};

    this.getPublicQuestions = function(){
        return $http({
            'url' : '/backend/questions/publicLessons',
            'method' :'GET'
        });
    };

	this.createQuestion = function(question) {
		return $http.post('/backend/questions/create', question);
	};

	this.updateQuestion = function(question) {
		return $http.post('/backend/questions/' + question._id + '/update', question);
	};

	this.checkAnswer = function(question) {
		return $http.post('/backend/questions/checkAnswer', question);

	};

    this.getPermissions = function(id){
        return $http.get('/backend/questions/' + id + '/permissions');
    };

	this.deleteQuestion = function(id) {
		return $http.post('/backend/user/questions/' + id + '/delete');
	};
	this.questionsType = [ {
		'id' : 'trueFalse',
		'label' : 'True or False',
		'updateTemplate' : 'views/questions/update/_trueFalse.html',
		'viewTemplate' : 'views/questions/view/_trueFalse.html',
		'reportTemplate' : 'views/questions/report/_trueFalse.html',
		'answers' : function(quizItem) {
			return quizItem.answer;
		},
		'isValid' : function(quizItem) {
			if (!quizItem.question || !quizItem.answer) {
				return false;
			}
			return true;
		},
		'canSubmit' : function(quizItem) {
			return !!quizItem.userAnswer;
		},
		'alias' : []
	}, {
		'id' : 'exactMatch',
		'label' : 'Exact Match',
		'updateTemplate' : 'views/questions/update/_exactMatch.html',
		'viewTemplate' : 'views/questions/view/_exactMatch.html',
		'reportTemplate' : 'views/questions/report/_exactMatch.html',
		'answers' : function(quizItem) {
			var answers = [];
			quizItem.options.forEach(function(value) {
				answers.push(value.label);
			});
			if (answers.length === 1) {
				return answers[0];
			}
			return answers.join(' / ');
		},
		'isValid' : function(quizItem) {
			if (!quizItem.question || !quizItem.options) {
				return false;
			}
			var result = false;
			quizItem.options.forEach(function(value) {
				if (!!value.label) {
					result = true;
				}
			});
			return result;
		},
		'canSubmit' : function(quizItem) {
			return !!quizItem.userAnswer;
		},
		'alias' : []
	}, {
		'id' : 'multipleChoices',
		'label' : 'Multiple Choice',
		'updateTemplate' : 'views/questions/update/_multipleChoices.html',
		'viewTemplate' : 'views/questions/view/_multipleChoices.html',
		'reportTemplate' : 'views/questions/report/_multipleChoices.html',
		'answers' : function(quizItem) {
			var answers = [];
			quizItem.options.forEach(function(value) {
				if (value.checked === true) {
					answers.push(value.label);
				}
			});
			if (answers.length === 1) {
				return answers[0];
			}
			return answers.join(' ; ');
		},
		'isValid' : function(quizItem) {
			if (!quizItem.question || !quizItem.options) {
				return false;
			}
			var result = false;
			quizItem.options.forEach(function(value) {
				if (!!value.label && value.checked === true) {
					result = true;
				}
			});
			return result;
		},
		'canSubmit' : function(quizItem) {
			if (!quizItem || !quizItem.options || quizItem.options.length < 1) {
				return false;
			}
			quizItem.userAnswer = [];
			for ( var i = 0; i < quizItem.options.length; i++) {
				var option = quizItem.options[i];
				if (option.userAnswer === true) {
					quizItem.userAnswer.push(option.label);
				}
			}
			return quizItem.userAnswer.length > 0;
		},
		'alias' : []
	}, {
		'id' : 'openQuestion',
		'label' : 'Open Question',
		'updateTemplate' : 'views/questions/update/_openQuestion.html',
		'viewTemplate' : 'views/questions/view/_openQuestion.html',
		'reportTemplate' : 'views/questions/report/_openQuestion.html',
		'answers' : function(quizItem) {
			return quizItem.answer;
		},
		'isValid' : function(quizItem) {
			if (!quizItem.question || !quizItem.subType) {
				return false;
			}
			return true;
		},
		'canSubmit' : function(quizItem) {
			return !!quizItem.userAnswer;
		},
		'alias' : []
	}, {
		'id' : 'fillInTheBlanks',
		'label' : 'Fill In The Blanks',
		'updateTemplate' : 'views/questions/update/_fillInTheBlanks.html',
		'viewTemplate' : 'views/questions/view/_fillInTheBlanks.html',
		'reportTemplate' : 'views/questions/report/_fillInTheBlanks.html',
		'answers' : function(quizItem) {
			var answer = [];
			if (!!quizItem.answer) {
				for ( var i = 0; i < quizItem.answer.length; i++) {
					answer[i] = quizItem.answer[i].split(';').join(' / ');

				}
			}
			return answer.join(' ; ');
		},
		'isValid' : function(quizItem) {
			if (!quizItem.question) {
				return false;
			}
			if (!quizItem.answer || !angular.isArray(quizItem.answer)) {
				quizItem.answer = [];
			}
			if (quizItem.answer.length === 0) {
				return false;
			}
			var result = true;
			quizItem.answer.forEach(function(value) {
				if (!value) {
					result = false;
				}
			});
			return result;
		},
		'canSubmit' : function(quizItem) {
			if (!quizItem || !quizItem.userAnswer || quizItem.userAnswer.length !== quizItem.answer.length) {
				return false;
			}
			var result = true;
			for ( var i = 0; i < quizItem.userAnswer.length; i++) {
				if (!quizItem.userAnswer[i]) {
					result = false;
				}
			}
			return result;
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