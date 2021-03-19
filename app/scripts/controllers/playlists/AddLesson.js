
'use strict';
function playlistsAddlessonctrl($scope, lesson,$uibModalInstance, $log, LergoClient, $location, $rootScope, $window, localStorageService) {
	$scope.lesson = lesson;
	$scope.summaryCollapsed = true;

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
    $scope.PlaylistTypeToLoad = {
		user : 'myPlaylists',
		liked : 'likedPlaylists'
	};
	$scope.playlistsFilter = {};
	$scope.filterPage = {};
	$scope.totalResults = 0;
    $scope.playlistsFilterOpts = { };
    // {
	// 	'showSubject' : true,
	// 	'showLanguage' : true,
	// 	'showAge' : true,
	// 	'showViews' : true,
	// 	'showTags' : true,
	// 	'showSearchText' : true
	// };
 
	$scope.playlistToShow = $scope.playlists;

 
	$scope.load = function(playlistToLoad) {
		var oldValue = localStorageService.get('playlistToLoad');
		if (oldValue !== playlistToLoad) {
			localStorageService.set('playlistToLoad', playlistToLoad);
			$scope.filterPage.current = 1;
			$scope.filterPage.updatedLast = new Date().getTime();
		}
	};

	$scope.loadPlaylists = function() {
		$log.info('loading playlists..');

		var queryObj = {
			'filter' : _.merge({}, $scope.playlistsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
        };
		$scope.playlistToLoad = localStorageService.get('playlistToLoad');
		var getPlaylistsPromise = null;
		if ($scope.playlistToLoad === $scope.PlaylistTypeToLoad.liked) {
			getPlaylistsPromise = LergoClient.userData.getLikedPlaylists(queryObj);
		} else {
			getPlaylistsPromise = LergoClient.userData.getPlaylists(queryObj);
			$scope.playlistToLoad = $scope.PlaylistTypeToLoad.user;
		}

		getPlaylistsPromise.then(function(result) {
            $scope.playlists = result.data.data;
            angular.forEach($scope.playlists, function(playlist) {
                playlist.alreadyAdded = false;
                var lessonsArray =  playlist.steps[0].lessonItems;
                angular.forEach(lessonsArray, function( lesson ) {
                    if (lesson === $scope.lesson._id) {
                       
                        playlist.alreadyAdded = true;
                    }
                });
            });
			$scope.filterPage.count = result.data.count; // number of playlists
			// after filtering
			// .. changing
			// pagination.
			$scope.totalResults = result.data.total;
			$scope.errorMessage = null;
			$log.info('Playlist fetched successfully');
			scrollToPersistPosition();
		}, function(result) {
			$scope.errorMessage = 'Error in fetching Playlists : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};
	$scope.addNewPlaylistVisible = true;
	$scope.lesson.AddedToFavorite = true;
	$scope.createPlaylistWhenSavingLesson = function() {
		$scope.addNewPlaylistVisible = false;
		$scope.createPlaylistBtnDisable=true;
		$uibModalInstance.dismiss();
		LergoClient.playlists.createToAddLesson({
			'name': $scope.newPlaylist.name,
			'subject': $scope.lesson.subject,
			'age': $scope.lesson.age,
			'language': $scope.lesson.language,
			'tags': $scope.lesson.tags,
			'steps': [
				{ 'testMode' : 'False',
				'retBefCrctAns' : 1,
				'type' : 'lesson',
				'lessonItems' : [ $scope.lesson._id]
				}
			]
		}).then(function (result) {
			$scope.errorMessage = null;
			console.log('need to place the name input here', result);
			//openLessonDialog(step, result.data, false);
			$scope.createPlaylistBtnDisable = false;
		}, function (result) {
			$scope.error = result.data;
			$scope.errorMessage = 'Error in creating questions : ' + result.data.message;
			$log.error($scope.errorMessage);
			$scope.createPlaylistBtnDisable = false;
		});
	};

	$scope.changeLikeStatus = function() {
		if ($scope.lesson.AddedToFavorite) {
			LergoClient.likes.likeLesson($scope.lesson).then(function (result) {
				$log.info('liking lesson');
				$scope.lessonLike = result.data;
			});
		} else {
			LergoClient.likes.deleteLessonLike($scope.lesson).then(function () {
				$log.info('unliking lesson');
				$scope.lessonLike = null;
			});
		}
	};

	// $scope.likeLesson = function () {
	// 	$log.info('liking lesson');
	// 	LergoClient.likes.likeLesson($scope.lesson).then(function (result) {
	// 		$scope.lessonLike = result.data;
	// 	});
	// };

	// $scope.unlikeLesson = function () {
	// 	$log.info('unliking lesson');
	// 	LergoClient.likes.deleteLessonLike($scope.lesson).then(function () {
	// 		$scope.lessonLike = null;
	// 	});
	// };

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
	$scope.lessonItemsData = {};
	$scope.getLesson = function (item) {
		if ($scope.lessonItemsData.hasOwnProperty(item)) {
			return $scope.lessonItemsData[item].name;
		}
		return null;
    };

    
    $scope.addLessonToPlaylist = function() {
        $log.info('lesson added to playlist');
            // lessons should be added in the ascending order of data e.g lesson created first should come first
        $scope.selectedPlaylist = _.sortBy(_.filter($scope.playlists, 'selected'),'lastUpdate');
        angular.forEach($scope.selectedPlaylist, function(playlist) {
            playlist.steps[0].lessonItems.push(lesson._id);
            LergoClient.playlists.update(playlist);
            playlist.selected = false;
            playlist.alreadyAdded = true;
        });
        if ($scope.selectedPlaylist.length > 0  ) {
            $scope.cancel();
        }
    };


}


angular.module('lergoApp').controller('PlaylistsAddLessonCtrl', ['$scope', 'lesson','$uibModalInstance', '$log', 'LergoClient', '$location', '$rootScope', '$window', 'localStorageService',playlistsAddlessonctrl]);
