'use strict';

angular.module('lergoApp').service('LessonsService', function LessonsService($http,$sce) {

	this.create = function() {
		return $http.post('/backend/lessons/create');
	};

    // will get all lessons - including private.
    // if user not allowed, will return 400.
    // to get user's lessons, use UserDataService
    this.getAll = function(){
        return $http.get('/backend/lessons/get/all');
    };

	this.delete = function(id) {
		return $http.post('/backend/user/lessons/' + id + '/delete');
	};

    this.getPermissions = function(id){
        return $http.get('/backend/user/lessons' + id + '/permissions');
    };

	this.update = function(lesson) {
		return $http.post('/backend/lessons/' + lesson._id + '/update', lesson);
	};
	this.getById = function(id) {
		return $http.get('/backend/lessons/' + id);
	};

    this.getPublicLessons = function (){
        return $http.get('/backend/public/lessons');
    };

    this.copyLesson = function( id ) {
        return $http.post('/backend/user/lessons/' + id + '/copy');
    };
    
    this.getStats = function (){
        return $http.get('/backend/system/statistics');
    };
    
    this.getTitleImage = function(lesson) {
		if (!lesson || !lesson.steps || lesson.steps.length < 1) {
			return;
		}
		for ( var i = 0; i < lesson.steps.length; i++) {
			var id = this.getVideoId(lesson.steps[i]);
			if (id !== null) {
				return  $sce.trustAsResourceUrl('http://img.youtube.com/vi/' + id + '/0.jpg');
			}
		}
	};
	this.getVideoId = function(step) {
		var value = null;
		if (!!step && !!step.videoUrl) {
			if (step.videoUrl.toLocaleLowerCase().indexOf('youtu.be') > 0) {
				value = step.videoUrl.substring(step.videoUrl.lastIndexOf('/') + 1);
			} else {
				value = step.videoUrl.split('?')[1].split('v=')[1];
			}
		}
		return value;
	};
});
