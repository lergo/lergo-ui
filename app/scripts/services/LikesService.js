'use strict';

angular.module('lergoApp')
    .service('LikesService', function LikesService($http) {

        function getLike(itemType, item) {
            return $http.get('/backend/user/me/' + itemType + '/' + item._id);
        }

        this.getMyLessonLike = function (item) {
            return getLike('lesson', item);
        };

        this.getMyQuestionLike = function (item) {
            return getLike('question', item);
        };


        function countLikes(itemType, item) {
            return $http.get('/backend/likes/' + itemType + '/' + item._id + '/count');
        }

        this.countLessonLikes = function (item) {
            return countLikes('lesson', item);
        };

        this.countQuestionLikes = function (item) {
            return countLikes('question', item);
        };


        function createLike(itemType, item) {
            return $http.post('/backend/likes/' + itemType + '/' + item._id + '/create');
        }

        this.likeLesson = function (item) {
            return createLike('lesson', item);
        };

        this.likeQuestion = function (item) {
            return createLike('question', item);
        };


    });
