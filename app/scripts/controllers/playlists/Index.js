'use strict';

angular.module('lergoApp').controller('PlaylistsIndexCtrl', function($scope, $log, LergoClient, $location, $rootScope, $window, localStorageService) {
	// enum
	$scope.LessonTypeToLoad = {
		user : 'myPlaylists',
		liked : 'likedPlaylists'
	};
	$scope.lessonsFilter = {};
	$scope.filterPage = {};
	$scope.totalResults = 0;
	$scope.lessonsFilterOpts = {
		'showSubject' : true,
		'showLanguage' : true,
		'showAge' : true,
		'showViews' : true,
		'showTags' : true,
		'showSearchText' : true
	};

	$scope.load = function(lessonToLoad) {
		var oldValue = localStorageService.get('lessonToLoad');
		if (oldValue !== lessonToLoad) {
			localStorageService.set('lessonToLoad', lessonToLoad);
			$scope.filterPage.current = 1;
			$scope.filterPage.updatedLast = new Date().getTime();
		}
	};
	

    
	$scope.playlists = 
	[
		{
			"id": 1, "name": "firstPlaylist", "list": 
				[
					{"_id" : "3", "name" : "playlist #3" },
					{"_id" : "536df82d634d2fc25445ee39", "name" : "playlist number 3 test" },
					{"_id" : "5eba8713011aee65253b74ae", "name" : "no-name 3"},
					{"_id" : "5d23fce0ef7df85ff68cae07", "name": "Japanese II Vocabulary - Part 3 (7 - 12)"},
					{"_id" : "5d050600ef7df85ff68c8de9", "name": "GENKI - 3 - lesson 3"}
				]
		},
		{
			"id": 2, "name": "secondPlaylist", "list":
				[	
					{"_id" : "2", "name" : "playlist #2" },
					{"_id" : "536df82d634d2fc25445ee39", "name" : "playlist number" },
					{"_id" : "5eba8713011aee65253b74ae", "name" : "ignore name"},
					{"_id" : "5d23fce0ef7df85ff68cae07", "name": "Vocabulary "},
					{"_id" : "5d050600ef7df85ff68c8de9", "name": "Japanese "}
				],
		},
		{
			"id": 3, "name": "thirdPlaylist", "list":
			[
				{"_id" : "1", "name" : "playlist #1" },
				{"_id" : "536df82d634d2fc25445ee39", "name" : "playlist number 1 test" },
				{"_id" : "5eba8713011aee65253b74ae", "name" : "different name"},
				{"_id" : "5d23fce0ef7df85ff68cae07", "name": "Japanese II Vocabulary - Part 1 (7 - 12)"},
				{"_id" : "5d050600ef7df85ff68c8de9", "name": "GENKI - 1 - lesson 3"},
				{
					"_id" : "536df82d634d2fc25445ee39",
					"description" : "שיעור זה כולל לימוד אוצר מילים למילים הכי נפוצות בשפה.",
					"lastUpdate" : 1403236370393,
					"name" : "שיעור אנגלית - אוצר מילים 1",
					"steps" : [
						{
							"title" : "תרגול",
							"type" : "quiz",
							"quizItems" : [
								"536df871beb2119a597a7c37",
								"536df8b4d0cdc0245b4c996d"
							],
							"retBefCrctAns" : 1
						}
					],
					"userId" : "53aec297f9fcc48f0cfe2f5a",
					"views" : 6,
					"subject" : "english",
					"language" : "hebrew",
					"age" : 8,
					"createdAt" : "2014-05-10T09:58:05.000Z",
					"username" : "navalevy"
				},
				{
					"_id" : "53a5cac15c26c2ca3dbb9da1",
					"userId" :  ("5353ccbb73d77eb17ea37b12"),
					"createdAt" : "2014-06-21T18:11:13.955Z",
					"age" : 11,
					"timeStamp" : "2014-06-21T18:11:13.000Z",
					"questionsCount" : 0,
					"lastUpdate" :   ("1403374418460"),
					"name" : "Colors",
					"language" : "other",
					"subject" : "spelling",
					"steps" : [
						{
							"title" : "vocabulary",
							"type" : "quiz",
							"quizItems" : [
								"53a5cae75c26c2ca3dbb9da2"
							],
							"retBefCrctAns" : 1
						}
					],
					"views" : 1,
					"username" : "jlevym"
				}
			]
		}
	]
		

	
	 console.log($scope.playlists);
        
    // $scope.playlists = 
    //     [
    //         $scope.playlist0, $scope.playlist1, $scope.playlist2
	// 	] 
		
		$scope.playlistToShow = $scope.playlists[0];
		$scope.GetRowIndex = function (index) {
			$scope.playlistToShow = $scope.playlists[index];
		};	

	$scope.loadLessons = function() {
		$log.info('loading lessons');
		var queryObj = {
			'filter' : _.merge({}, $scope.lessonsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		$scope.lessonToLoad = localStorageService.get('lessonToLoad');
		var getLessonsPromise = null;
		if ($scope.lessonToLoad === $scope.LessonTypeToLoad.liked) {
			getLessonsPromise = LergoClient.userData.getLikedLessons(queryObj);
		} else {
			getLessonsPromise = LergoClient.userData.getLessons(queryObj);
			$scope.lessonToLoad = $scope.LessonTypeToLoad.user;
		}

		getLessonsPromise.then(function(result) {
			$scope.lessons = result.data.data;
			$scope.filterPage.count = result.data.count; // number of lessons
			// after filtering
			// .. changing
			// pagination.
			$scope.totalResults = result.data.total;
			$scope.errorMessage = null;
			$log.info('Lesson fetched successfully');
			scrollToPersistPosition();
		}, function(result) {
			$scope.errorMessage = 'Error in fetching Lessons : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};

	$scope.create = function() {
        $scope.createLessonBtnDisable=true;
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			$scope.errorMessage = null;
			$location.path('/user/lessons/' + lesson._id + '/update');
		}, function(result) {
			$scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
			$log.error($scope.errorMessage);
            $scope.createLessonBtnDisable=false;
		});
	};

	var path = $location.path();
	$scope.$on('$locationChangeStart', function() {
		persistScroll($scope.filterPage.current);
	});

	$scope.$watch('filterPage.current', function(newValue, oldValue) {
		if (!!oldValue) {

			persistScroll(oldValue);
		}
	});
	function persistScroll(pageNumber) {
		if (!$rootScope.scrollPosition) {
			$rootScope.scrollPosition = {};
		}
		$rootScope.scrollPosition[path + ':page:' + pageNumber] = $window.scrollY;
	}
	function scrollToPersistPosition() {
		var scrollY = 0;
		if (!!$rootScope.scrollPosition) {
			scrollY = $rootScope.scrollPosition[path + ':page:' + $scope.filterPage.current] || 0;
		}
		$window.scrollTo(0, scrollY);
	}
});