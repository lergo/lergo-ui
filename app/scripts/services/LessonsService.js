'use strict';

angular.module('lergoApp').service('LessonsService', function LessonsService($http, $sce, $q, $window ) {

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

    var stats = null;
	this.getStats = function( refresh ) {
        if ( stats === null || !!refresh ){
            return $http.get('/backend/system/statistics').then(function(result){ stats = result.data;  return result; });
        }else{
            var deferred = $q.defer();
            deferred.resolve({ data: stats });
            return deferred.promise;
        }

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
	this.getVideoId = function(step) {
		var value = null;
		if (!!step && !!step.videoUrl) {
			if (step.videoUrl.toLocaleLowerCase().indexOf('youtu.be') > 0) {
				value = step.videoUrl.substring(step.videoUrl.lastIndexOf('/') + 1);
			} else {
				var temp = step.videoUrl.split('?')[1];
				if (!!temp) {
					value = step.videoUrl.split('?')[1].split('v=')[1];
				}
			}
		}
		return value;
	};

    this.getShareLink = function(lesson){
        return $window.location.origin + '/index.html#!/public/lessons/' + lesson._id + '/intro';
    };
});
