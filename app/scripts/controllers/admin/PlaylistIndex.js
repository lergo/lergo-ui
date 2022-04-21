'use strict';

angular.module('lergoApp').controller('AdminPlaylistIndexCtrl', function($scope, LergoClient, $log, $filter, $q, $sessionStorage) {
	
	$scope.adminFilter = {};
	$scope.filterPage = {};

    $scope.managePlaylists = {allSelected : false};

	$scope.adminFilterOpts = {
        'showLimitedSubject' : true,
        'showHasLessons' : true,
		'showLimitedPlaylistStatus' : true,
		'showLimitedLanguage' : true,
		'showLimitedAge' : true,
		'showViews' : true,
		'showTags' : true,
		'showCreatedBy' : true,
		'showCreatedByAll' : true,
		'showSearchText' : true,
		'showIsCopyOfPlaylist' : false,
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

	var publicCountSearchDefault = 0;
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


	$scope.loadPlaylists = function() {
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
		LergoClient.playlists.getAll(queryObj).then(function(result) {
			_.forEach(result.data.data, function(playlist) {
				if (!playlist.publicCount) {
					playlist.publicCount = 0;
				}
			});
			$scope.playlists = result.data.data;
			$scope.filterPage.count = result.data.count; // the number of
			// playlists found
			// after filtering
			// them.
		});
	};

	function loadStats() {
		$scope.updateStats(true);
	}

	var users = {};

	$scope.$watch('playlists', function() {
		var requiredUsers = _.difference(_.map($scope.playlists, 'userId'), _.map(users, '_id'));

		if (requiredUsers.length > 0) {
			LergoClient.users.findUsersById(requiredUsers).then(function(result) {
				result.data.forEach(function(user) {
					users[user._id] = user;
				});
			});
		}
	});

	
    $scope.$watch(function allSelected(){
        return _.isEmpty(_.filter($scope.playlists, function(l){ return !l.selected; }));
    }, function( value ){
        $scope.managePlaylists.allSelected = value;
    });

	$scope.getUser = function(playlist) {
		return users[playlist.userId];
	};



	$scope.selectAll = function() {
        _.each($scope.playlists, function(l){
            l.selected = $scope.managePlaylists.allSelected;
        });
	};

    function makePlaylistPublic( playlist, isPublic ){
        if ( isPublic ){
            return LergoClient.playlists.publish(playlist).then(function( result ){
                playlist.public = result.data.public;
            });
        }else{
            return LergoClient.playlists.unpublish(playlist).then(function(){
                delete playlist.public;
            });
        }
	}
	// Jeff: add comment email sent / not sent
	function makeCommentEmailSent( playlist, hasBeenSent ){
        if ( hasBeenSent ){
            return LergoClient.playlists.commentEmailSent(playlist).then(function( result ){
                playlist.commentEmailSent = result.data.commentEmailSent;
            });
        }else{
            return LergoClient.playlists.commentEmailNotSent(playlist).then(function(){
                delete playlist.commentEmailSent;
            });
        }
    }

    function makeAllPublic(playlists, isPublic){
        var promises = _.map(_.filter(playlists, {selected:true}),function(playlist) {
            return makePlaylistPublic(playlist,isPublic);
        });
        $q.all(promises).then($scope.loadPlaylists).then(loadStats);

	}
	function makeAllSent(playlists, hasBeenSent){
        var promises = _.map(_.filter(playlists, {selected:true}),function(playlist) {
            return makeCommentEmailSent(playlist,hasBeenSent);
        });
        $q.all(promises).then($scope.loadPlaylists).then(loadStats);

    }

    $scope.makePublic = function() {
        makeAllPublic( $scope.playlists, true);
    };

	$scope.makePrivate = function() {
		makeAllPublic( $scope.playlists, false );
	};

	$scope.emailHasBeenSent = function() {
        makeAllSent( $scope.playlists, true);
    };

	$scope.emailHasNotBeenSent = function() {
		makeAllSent( $scope.playlists, false );
	};

	$scope.deletePlaylist = function() {
		if (confirm($filter('translate')('deletePlaylists.Confirm'))) {
			angular.forEach($scope.playlists, function(playlist) {
				if (playlist.selected === true) {
					$scope.playlists.splice($scope.playlists.indexOf(playlist), 1);
					LergoClient.playlists.delete(playlist._id).then(function() {
						$scope.errorMessage = null;
						$log.info('Playlist deleted sucessfully');
					}, function(result) {
						$scope.errorMessage = 'Error in deleting Playlist : ' + result.data.message;
						$log.error($scope.errorMessage);
					});
				}
			});
		}
	};

});
