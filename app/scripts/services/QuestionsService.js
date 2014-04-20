'use strict';

angular.module('lergoApp')
    .service('QuestionsService', function QuestionsService($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getUserQuestions = function () {
            return $http.get('/backend/user/questions');
        };

        this.getUserQuestionById = function (questionId) {
            return $http.get('/backend/user/questions/' + questionId);
        };

        this.createQuestion = function (question) {
            return $http.post('/backend/user/questions', question);
        };

        this.updateQuestion = function (question) {
            return $http.post('/backend/user/questions/' + question._id, question);
        };

        this.getLessonsWhoUseThisQuestion = function (question) {
            return $http.get('/backend/user/questions/' + question._id + '/usages');
        };


        this.questionsType = [
            {
                'id': 'trueFalse',
                'label': 'True or False',
                'updateTemplate': 'views/questions/update/_trueFalse.html',
                'alias': []
            },
            {
                'id': 'multipleChoiceSingleAnswer',
                'label': 'Multiple Choices Single Answer',
                'updateTemplate': 'views/questions/update/_multipleChoiceSingleAnswer',
                'alias': []
            },
            {
                'id': 'multipleChoicesMultipleAnswers',
                'label': 'Multiple Choices Multiple Answers',
                'updateTemplate': 'views/questions/update/_multipleChoiceMultipleAnswers',
                'alias': []
            }

        ];

        this.getTypeById = function (typeId) {
            for (var i = 0; i < this.questionsType.length; i++) {
                if (typeId === this.questionsType[i].id) {
                    return this.questionsType[i];
                }

            }
            throw new Error('type ' + typeId + ' is unsupported ');
        };
    }
);