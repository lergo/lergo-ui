'use strict';

angular.module('lergoApp').controller('AdminLessonIndexCtrl', function($scope, LergoClient, $log, $filter, $q, $sessionStorage) {
	
	$scope.adminFilter = {};
	$scope.filterPage = {};

    $scope.manageLessons = {allSelected : false};

	$scope.adminFilterOpts = {
        'showLimitedSubject' : true,
        'showHasQuestions' : true,
		'showLimitedLessonStatus' : true,
		'showLimitedLanguage' : true,
		'showLimitedAge' : true,
		'showViews' : true,
		'showTags' : true,
		'showCreatedBy' : true,
		'showCreatedByAll' : true,
		'showSearchText' : true,
		'showIsCopyOf' : true,
		'showHasAdminComment' : true,
		'showAdminRating' : true,
		'showRemoveCreatedBy': true,
		'showRemoveSubject': true,
		'showHasAdminCommentEmailSent': true
	};

    var defaultFilter = {};
    LergoClient.users.getUserPermissions().then(function( permissions ){
        if ( permissions && permissions.limitations && permissions.limitations.editOnlyUnpublishedContent ){
            defaultFilter.public = { $exists : false } ;
        }
	});

	var publicCountSearchDefault = 3;
	$scope.publicCountSearch =  $sessionStorage.publicCountSearch || publicCountSearchDefault;
	/* for sorting the table */
	$scope.greaterThan = function(prop, val){
		return function(item){
			$scope.updatedValue = val;
		    return item[prop] >= val;
		};
	};
	$scope.resetPublicCountSearch = function() {
		$sessionStorage.publicCountSearch = publicCountSearchDefault;
		$scope.publicCountSearch = publicCountSearchDefault;
	};

	// need to persist the textSearch
	$scope.$watch('updatedValue', function(newValue) {
		if (newValue !== publicCountSearchDefault) {
			$sessionStorage.publicCountSearch = newValue;
		} else {
			$scope.publicCountSearch = publicCountSearchDefault;
		}
	});


	$scope.loadLessons = function() {
		//increase page size
		$scope.filterPage.size = 90;
		var queryObj = {
            // make merge first argument be an empty object, otherwise "defaultFilter" is modified
            // and the merge result is remembered forever!
            // for example - makes "has questions" not reset properly.
			'filter' : _.merge( {},defaultFilter, $scope.adminFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		LergoClient.lessons.getAll(queryObj).then(function(result) {
			_.forEach(result.data.data, function(lesson) {
				if (!lesson.publicCount) {
					lesson.publicCount = 0;
				}
			});
			$scope.lessons = result.data.data;
			$scope.filterPage.count = result.data.count; // the number of
			// lessons found
			// after filtering
			// them.
		});
	};

	function loadStats() {
		$scope.updateStats(true);
	}

	var users = {};

	$scope.$watch('lessons', function() {
		var requiredUsers = _.difference(_.map($scope.lessons, 'userId'), _.map(users, '_id'));

		if (requiredUsers.length > 0) {
			LergoClient.users.findUsersById(requiredUsers).then(function(result) {
				result.data.forEach(function(user) {
					users[user._id] = user;
				});
			});
		}
	});

	
    $scope.$watch(function allSelected(){
        return _.isEmpty(_.filter($scope.lessons, function(l){ return !l.selected; }));
    }, function( value ){
        $scope.manageLessons.allSelected = value;
    });

	$scope.getUser = function(lesson) {
		return users[lesson.userId];
	};



	$scope.selectAll = function() {
        _.each($scope.lessons, function(l){
            l.selected = $scope.manageLessons.allSelected;
        });
	};

    function makeLessonPublic( lesson, isPublic ){
        if ( isPublic ){
            return LergoClient.lessons.publish(lesson).then(function( result ){
                lesson.public = result.data.public;
            });
        }else{
            return LergoClient.lessons.unpublish(lesson).then(function(){
                delete lesson.public;
            });
        }
	}
	// Jeff: add comment email sent / not sent
	function makeCommentEmailSent( lesson, hasBeenSent ){
        if ( hasBeenSent ){
            return LergoClient.lessons.commentEmailSent(lesson).then(function( result ){
                lesson.commentEmailSent = result.data.commentEmailSent;
            });
        }else{
            return LergoClient.lessons.commentEmailNotSent(lesson).then(function(){
                delete lesson.commentEmailSent;
            });
        }
    }

    function makeAllPublic(lessons, isPublic){
        var promises = _.map(_.filter(lessons, {selected:true}),function(lesson) {
            return makeLessonPublic(lesson,isPublic);
        });
        $q.all(promises).then($scope.loadLessons).then(loadStats);

	}
	function makeAllSent(lessons, hasBeenSent){
        var promises = _.map(_.filter(lessons, {selected:true}),function(lesson) {
            return makeCommentEmailSent(lesson,hasBeenSent);
        });
        $q.all(promises).then($scope.loadLessons).then(loadStats);

    }

    $scope.makePublic = function() {
        makeAllPublic( $scope.lessons, true);
    };

	$scope.makePrivate = function() {
		makeAllPublic( $scope.lessons, false );
	};

	$scope.emailHasBeenSent = function() {
        makeAllSent( $scope.lessons, true);
    };

	$scope.emailHasNotBeenSent = function() {
		makeAllSent( $scope.lessons, false );
	};

	$scope.deleteLesson = function() {
		if (confirm($filter('translate')('deleteLessons.Confirm'))) {
			angular.forEach($scope.lessons, function(lesson) {
				if (lesson.selected === true) {
					$scope.lessons.splice($scope.lessons.indexOf(lesson), 1);
					LergoClient.lessons.delete(lesson._id).then(function() {
						$scope.errorMessage = null;
						$log.info('Lesson deleted sucessfully');
					}, function(result) {
						$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
						$log.error($scope.errorMessage);
					});
				}
			});
		}
	};

});
