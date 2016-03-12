'use strict';

angular.module('lergoApp').service('LessonsService', function LessonsService($http, $sce, $q, $window, VideoService, $log  ) {

    var self = this;

	this.create = function() {
		return $http.post('/backend/lessons/create');
	};

	// will get all lessons - including private.
	// if user not allowed, will return 400.
	// to get user's lessons, use UserDataService
	this.getAll = function( queryObj ) {
        if ( !queryObj ){
            throw new Error('should have at least a query object with pagination..');
        }
		return $http({'method' : 'GET' ,'url' : '/backend/lessons/get/all', 'params' : {
            'query' : queryObj
        }}).then( function(result){
            _.each(result.data.data, function(value){
                value.image = self.getTitleImage(value);
            });
            return result;

        });
	};

    this.getLessonsWhoUseThisQuestion = function(questionId) {
        return $http.get('/backend/lessons/using/question/' + questionId );
    };

    this.overrideQuestion = function( lessonId, questionId ){
        return $http.post('/backend/lessons/' + lessonId + '/question/' + questionId + '/override');
    };

	this.delete = function(id) {
		return $http.post('/backend/lessons/' + id + '/delete');
	};

	this.getPermissions = function(id) {
		return $http.get('/backend/lessons/' + id + '/permissions');
	};

	this.update = function(lesson) {
		return $http.post('/backend/lessons/' + lesson._id + '/update', lesson);
	};
	this.getById = function(id) {
		return $http.get('/backend/lessons/' + id);
	};

	this.findLessonsById = function(ids) {
		return $http({
			'url' : '/backend/lessons/find',
			'method' : 'GET',
			params : {
				'lessonsId' : ids
			}
		});
	};

	this.getLessonIntro = function(id) {
		return $http.get('/backend/lessons/' + id + '/intro');
	};

	this.getPublicLessons = function( queryObj ) {
        if ( !queryObj ){
            throw new Error('you should at least have {"public" : { "exists" : 1 } } ');
        }
		return $http( {
            'method' : 'GET' ,
            'url' : '/backend/public/lessons',
            'params' : { 'query' : JSON.stringify(queryObj) } /* stringify the queryObj as it contains $ signs which angular filters out */
        } );
	};

	this.copyLesson = function(id) {
		return $http.post('/backend/lessons/' + id + '/copy');
	};

    var statsPromise = null;
	this.getStats = function( refresh ) {
        if ( statsPromise === null || !!refresh ){
            statsPromise = $http.get('/backend/system/statistics');
        }
        return statsPromise;

	};

	this.getTitleImage = function(lesson) {
		if (!lesson || !lesson.steps || lesson.steps.length < 1) {
			return;
		}

		for ( var i = 0; i < lesson.steps.length; i++) {
			var id = this.getVideoId(lesson.steps[i]);
			if (id !== null) {
				return $sce.trustAsResourceUrl('http://img.youtube.com/vi/' + id + '/0.jpg');
			}
		}
	};

    /**
     *
     * @param {Lesson} item
     * @returns {number}
     */
    this.countQuestions = function( item ){
        try {
            return _.sumBy(item.steps, function (step) {
                return step.type === 'quiz' ? _.size(step.quizItems) : 0;
            });
        } catch (e) {
            return 0;
        }
    };

    this.getVideoId = function(step){
        var value = null;

        if ( !!step && !!step.videoUrl ){
            try {
                value = VideoService.getMedia(step.videoUrl).id;
            }catch(e){
                $log.error('unable to get video id',e);
            }
        }

        return value;
    };

    this.getShareLink = function(lesson){
        return $window.location.origin + '/index.html#!/public/lessons/' + lesson._id + '/intro';
    };

    this.getIntroLink = function(lesson){
        return '/public/lessons/' + lesson._id + '/intro';
    };
});
