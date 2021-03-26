
'use strict';
function playlistsAddlessonctrl($scope, lesson,$uibModalInstance, $log, LergoClient, $location, $rootScope, $window, localStorageService, $timeout) {
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
		$scope.filterPage.size = 100;  // we don't want pagination 
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
				// playlist.alreadyAdded = false;
				playlist.selected = false;
				var lessonsArray =  playlist.steps[0].lessonItems;
                angular.forEach(lessonsArray, function( lesson ) {
                    if (lesson === $scope.lesson._id) {
						// playlist.alreadyAdded = true;
						playlist.selected = true;
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
			$log.debug(result.data.message);
			$scope.createPlaylistBtnDisable = false;
		}, function (result) {
			$scope.error = result.data;
			$scope.errorMessage = 'Error in creating playlist : ' + result.data.message;
			$log.error($scope.errorMessage);
			$scope.createPlaylistBtnDisable = false;
		});
	};

	$scope.changeLikeStatus = function() {
		if ($scope.lesson.AddedToFavorite) {
			LergoClient.likes.likeLesson($scope.lesson).then(function (result) {
				toastr.success('lesson added to Liked Lessons');
				$log.info('liking lesson');
				$scope.lessonLike = result.data;
			});
		} else {
			LergoClient.likes.deleteLessonLike($scope.lesson).then(function () {
				$log.info('unliking lesson');
				toastr.success('lesson removed from Liked Lessons');
				$scope.lessonLike = null;
			});
		}
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

	function removeItemOnce(arr, value) {
		var index = arr.indexOf(value);
		if (index > -1) {
		    arr.splice(index, 1);
		}
		return arr;
	}
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
	$scope.changeSavedToPlaylist = function(playlist) {
		$scope.changeSavedToPlaylistDisabled = true;
		if (playlist.selected) {
			playlist.steps[0].lessonItems.push(lesson._id);
			toastr.success('lesson added to playlist');
			$log.info('adding lesson to playlist');
		} else {
			removeItemOnce(playlist.steps[0].lessonItems, lesson._id);
			toastr.success('lesson removed from playlist');
			$log.info('lesson removed from playlist');
		}
		LergoClient.playlists.update(playlist).then(function() {
			$scope.changeSavedToPlaylistDisabled = false;
		});
	};
	// autofocus not working properly in control of partial view when added
    // through ngInclude this is a hook to get the desired behaviour
    function focusOn(id) {
        var element = document.getElementById(id);
        if (!!element) {
			$timeout(function() {
				element.focus();
			});
        }
	}
	$scope.$watch('summaryCollapsed', function() {
			focusOn('enterNameToPlaylist');
		});

}


angular.module('lergoApp').controller('PlaylistsAddLessonCtrl', ['$scope', 'lesson','$uibModalInstance', '$log', 'LergoClient', '$location', '$rootScope', '$window', 'localStorageService', '$timeout',playlistsAddlessonctrl]);
