'use strict';

angular.module('lergoApp')
    .service('CompletesService', function CompletesService($http) {

       /*  function getIsComplete(itemType, item) {
            return $http.get('/backend/user/me/isCompletes/' + itemType + '/' + item._id);
        }

        this.getMyLessonIsComplete = function (item) {
            return getIsComplete('lesson', item);
        };


        function countIsCompletes(itemType, item) {
            return $http.get('/backend/isCompletes/' + itemType + '/' + item._id + '/count');
        }

        this.countLessonIsCompletes = function (item) {
            return countIsCompletes('lesson', item);
        };

        this.countQuestionIsCompletes = function (item) {
            return countIsCompletes('question', item);
        }; */

        /*  this.likeQuestion = function (item) {
            return createIsComplete('question', item);
        }; */


        function createLessonIsComplete(itemType, item) {
            return $http.post('/backend/completes/' + itemType + '/' + item._id + '/' + item.score + '/' + item.reportId + '/create');
        }

        this.lessonIsComplete = function (item) {
            return createLessonIsComplete('lesson', item);
        };

        function deleteLessonIsComplete(itemType, item){
            return $http.post('/backend/completes/' + itemType + '/' + item._id + '/delete');
        }


        this.deleteLessonIsComplete = function( item ){
            return deleteLessonIsComplete('lesson', item);
        };

        /* this.deleteQuestionIsComplete = function(item){
            return deleteIsComplete('question',item);
        }; */

    });
