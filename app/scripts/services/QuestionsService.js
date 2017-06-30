'use strict';

angular.module('lergoApp').service('QuestionsService', function QuestionsService($http, $log, $filter, $window) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    this.copyQuestion = function (questionId) {
        $log.info('copying question');
        return $http.post('/backend/questions/' + questionId + '/copy');
    };

    this.getQuestionById = function (questionId) {
        if (!!questionId) {
            return $http.get('/backend/questions/' + questionId);
        }
    };

    this.findQuestionsById = function (ids) {
        return $http({
            'url': '/backend/questions/find',
            'method': 'GET',
            params: {
                'questionsId': ids
            }
        });
    };

    this.getPublicQuestions = function (queryObj) {
        if (!queryObj) {
            throw new Error('you should at least have {"public" : { "exists" : 1 } } ');
        }
        return $http({
            'url': '/backend/questions/publicLessons',
            'method': 'GET',
            'params': {
                'query': queryObj
            }
        });
    };

    this.createQuestion = function (question) {
        return $http.post('/backend/questions/create', question);
    };

    this.hasExplanation = function (question) {
        return question.explanation || question.explanationMedia;
    };

    this.isOpenQuestion = function (question) {
        if (!question) {
            return false;
        }
        return question.type === this.QUESTION_TYPE.OPEN_QUESTION;
    };

    this.updateQuestion = function (question) {
        return $http.post('/backend/questions/' + question._id + '/update', question);
    };

    this.checkAnswer = function (question) {
        return $http.post('/backend/questions/checkAnswer', question);

    };

    this.getPermissions = function (id) {
        return $http.get('/backend/questions/' + id + '/permissions');
    };

    this.deleteQuestion = function (id) {
        return $http.post('/backend/questions/' + id + '/delete');
    };

    this.QUESTION_TYPE={
        TRUE_FALSE: 'trueFalse',
        EXACT_MATCH: 'exactMatch',
        MULTIPLE_CHOICES: 'multipleChoices',
        OPEN_QUESTION: 'openQuestion',
        FILL_IN_THE_BLANKS: 'fillInTheBlanks'
    };

    // todo: use object composition to reduce code.
    this.questionsType = [{
        'id': this.QUESTION_TYPE.TRUE_FALSE,
        'label': 'True or False',
        'updateTemplate': 'views/questions/update/_trueFalse.html',
        'viewTemplate': 'views/questions/view/_trueFalse.html',
        'previewTemplate': 'views/questions/view/preview/_trueFalse.html',
        'reportTemplate': 'views/questions/report/_trueFalse.html',
        'aggReportTemplate': 'views/questions/report/agg/_trueFalse.html',
        canShowExpPerAns: false,
        'answers': function (quizItem) {
            return $filter('translate')('quizItem.answer.' + quizItem.answer);
        },
        'isValid': function (quizItem) {
            if (!quizItem.question || !quizItem.answer) {
                return false;
            }
            return true;
        },
        'canSubmit': function (quizItem) {
            return !!quizItem.userAnswer;
        },
        'alias': []
    }, {
        'id': this.QUESTION_TYPE.EXACT_MATCH,
        'label': 'Exact Match',
        'updateTemplate': 'views/questions/update/_exactMatch.html',
        'viewTemplate': 'views/questions/view/_exactMatch.html',
        'previewTemplate': 'views/questions/view/preview/_exactMatch.html',
        'reportTemplate': 'views/questions/report/_exactMatch.html',
        'aggReportTemplate': 'views/questions/report/agg/_exactMatch.html',
        canShowExpPerAns: true,
        'answers': function (quizItem) {
            var answers = [];
            quizItem.options.forEach(function (value) {
                if (!!value.checked) {
                    answers.push(value.label);
                }
            });
            if (answers.length === 1) {  // todo: we don't need this, join will take care of this
                return answers[0];
            }
            return answers.join(' / ');
        },
        'isValid': function (quizItem) {
            if (!quizItem.question || !quizItem.options) {
                return false;
            }
            var result = false;
            quizItem.options.forEach(function (value) {
                if (!!value.label && !!value.checked) {
                    result = true;
                }
            });
            return result;
        },
        'canSubmit': function (quizItem) {
            return !!quizItem.userAnswer;
        },
        'alias': []
    }, {
        'id': this.QUESTION_TYPE.MULTIPLE_CHOICES,
        'label': 'Multiple Choice',
        'updateTemplate': 'views/questions/update/_multipleChoices.html',
        'viewTemplate': 'views/questions/view/_multipleChoices.html',
        'previewTemplate': 'views/questions/view/preview/_multipleChoices.html',
        'reportTemplate': 'views/questions/report/_multipleChoices.html',
        'aggReportTemplate': 'views/questions/report/agg/_multipleChoices.html',
        canShowExpPerAns: true,
        'answers': function (quizItem) {
            var answers = [];
            quizItem.options.forEach(function (value) {
                if (value.checked === true) {
                    answers.push(value.label);
                }
            });
            if (answers.length === 1) {  // todo: we don't need this, join will take care of this
                return answers[0];
            }
            return answers.join(' ; ');
        },
        'isValid': function (quizItem) {
            if (!quizItem.question || !quizItem.options) {
                return false;
            }
            var result = false;
            quizItem.options.forEach(function (value) {
                if (!!value.label && value.checked === true) {
                    result = true;
                }
            });
            return result;
        },
        'canSubmit': function (quizItem) {
            if (!quizItem || !quizItem.options || quizItem.options.length < 1) {
                return false;
            }
            quizItem.userAnswer = [];
            for (var i = 0; i < quizItem.options.length; i++) {
                var option = quizItem.options[i];
                if (option.userAnswer === true) {
                    quizItem.userAnswer.push(option.label);
                }
            }
            return quizItem.userAnswer.length > 0;
        },
        'alias': []
    }, {
        'id': this.QUESTION_TYPE.OPEN_QUESTION,
        'label': 'Open Question',
        'updateTemplate': 'views/questions/update/_openQuestion.html',
        'viewTemplate': 'views/questions/view/_openQuestion.html',
        'previewTemplate': 'views/questions/view/preview/_openQuestion.html',
        'reportTemplate': 'views/questions/report/_openQuestion.html',
        'aggReportTemplate': 'views/questions/report/agg/_openQuestion.html',
        canShowExpPerAns: false,
        'answers': function (quizItem) {
            return quizItem.answer;
        },
        'isValid': function (quizItem) {
            if (!quizItem.question || !quizItem.subType) {
                return false;
            }
            return true;
        },
        'canSubmit': function (quizItem) {
            return !!quizItem.userAnswer;
        },
        'alias': []
    }, {
        'id': this.QUESTION_TYPE.FILL_IN_THE_BLANKS,
        'label': 'Fill In The Blanks',
        'updateTemplate': 'views/questions/update/_fillInTheBlanks.html',
        'viewTemplate': 'views/questions/view/_fillInTheBlanks.html',
        'previewTemplate': 'views/questions/view/preview/_fillInTheBlanks.html',
        'reportTemplate': 'views/questions/report/_fillInTheBlanks.html',
        'aggReportTemplate': 'views/questions/report/agg/_fillInTheBlanks.html',
        canShowExpPerAns: true,
        'answers': function (quizItem) {
            var answer = [];
            if (!!quizItem.answer) {
                for (var i = 0; i < quizItem.answer.length; i++) {
                    answer[i] = quizItem.answer[i].split(';').join(' / ');

                }
            }
            return answer.join(' ; ');
        },
        'isValid': function (quizItem) {
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
            quizItem.answer.forEach(function (value) {
                if (!value) {
                    result = false;
                }
            });
            return result;
        },
        'canSubmit': function (quizItem) {
            if (!quizItem || !quizItem.userAnswer || quizItem.userAnswer.length !== quizItem.answer.length) {
                return false;
            }
            var result = true;
            for (var i = 0; i < quizItem.userAnswer.length; i++) {
                if (!quizItem.userAnswer[i]) {
                    result = false;
                }
            }
            return result;
        },
        'alias': []
    }];

    this.getTypeById = function (typeId) {
        if ( !!typeId ) {
            for (var i = 0; i < this.questionsType.length; i++) {
                if (typeId === this.questionsType[i].id) {
                    return this.questionsType[i];
                }

            }
            throw new Error('type ' + typeId + ' is unsupported ');
        }
    };


    this.getShareLink = function (question) {
        return $window.location.origin + '/#!/public/questions/' + question._id + '/read';
    };
});
