'use strict';

angular.module('lergoApp').controller('PlayListsIndexCtrl', function($scope, $log, LergoClient, $location, $rootScope, $window, localStorageService) {
	// enum
	$scope.PlayListTypeToLoad = {
		user : 'myPlayLists',
		liked : 'likedPlayLists'
	};
	$scope.playListsFilter = {};
	$scope.filterPage = {};
	$scope.totalResults = 0;
	$scope.playListsFilterOpts = {
		'showSubject' : true,
		'showLanguage' : true,
		'showAge' : true,
		'showViews' : true,
		'showTags' : true,
		'showSearchText' : true
	};

	$scope.load = function(playListToLoad) {
		var oldValue = localStorageService.get('playListToLoad');
		if (oldValue !== playListToLoad) {
			localStorageService.set('playListToLoad', playListToLoad);
			$scope.filterPage.current = 1;
			$scope.filterPage.updatedLast = new Date().getTime();
		}
	};

	$scope.loadPlayLists = function() {
		$log.info('loading playLists');
		var queryObj = {
			'filter' : _.merge({}, $scope.playListsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		$scope.playListToLoad = localStorageService.get('playListToLoad');
		var getPlayListsPromise = null;
		if ($scope.playListToLoad === $scope.PlayListTypeToLoad.liked) {
			getPlayListsPromise = LergoClient.userData.getLikedPlayLists(queryObj);
		} else {
			getPlayListsPromise = LergoClient.userData.getPlayLists(queryObj);
			$scope.playListToLoad = $scope.PlayListTypeToLoad.user;
		}

		getPlayListsPromise.then(function(result) {
			$scope.playLists = result.data.data;
			$scope.filterPage.count = result.data.count; // number of playLists
			// after filtering
			// .. changing
			// pagination.
			$scope.totalResults = result.data.total;
			$scope.errorMessage = null;
			$log.info('PlayList fetched successfully');
			scrollToPersistPosition();
		}, function(result) {
			$scope.errorMessage = 'Error in fetching PlayLists : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};

	$scope.create = function() {
        $scope.createPlayListBtnDisable=true;
		LergoClient.playLists.create().then(function(result) {
			var playList = result.data;
			$scope.errorMessage = null;
			$location.path('/user/playLists/' + playList._id + '/update');
		}, function(result) {
			$scope.errorMessage = 'Error in Index.jscreating PlayList : ' + result.data.message;
			$log.error($scope.errorMessage);
            $scope.createPlayListBtnDisable=false;
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
