'use strict';

angular.module('lergoApp').controller('PlaylistsDisplayCtrl',
    function($scope, $routeParams, LergoClient, PlaylistRprtsService, $log, $controller, $rootScope, $location, shuffleLessonsFilter, $window, $route ,$timeout) {

	// guy - using this flag because ng-cloak and other solutions will not apply
	// to this scenario.
	// the display to the playlist is simply taking time, because we have to fetch
	// the playlist and the playlistRprt
	// so once they are loaded, we will switch that flag to true.
	// otherwise we get a flash of the last screen (LERGO-358).
	$scope.loaded = false;
	$window.scrollTo(0, 0);
	$controller('PlaylistsStepDisplayCtrl', {
		$scope : $scope
	});

    if ( $route && $route.current && $route.current.$$route && $route.current.$$route.params &&  $route.current.$$route.params.preview ){
        LergoClient.playlists.getById( $routeParams.playlistId).then(function(result){
            $scope.playlist = result.data;
        }, function(){
            toastr.error('failed loading playlist', 'error');
        });
	}
	$scope.display = '/playlists/Display.js';

	$scope.currentStepIndex = parseInt($routeParams.currentStepIndex || 0, 10);
	$log.info('current step index');

    // for quiz steps, we also put "answers" on the scope in case user refreshes the page etc.
    function updateLessonsAnswers(){
        if ( !!$scope.step && !!$scope.step.quizItems && $scope.answers ){

            if ( !!$scope.playlistRprt && !isNaN(parseInt($scope.currentStepIndex,10))  ){
                $scope.answers = PlaylistRprtsService.getAnswersByQuizItemId( $scope.playlistRprt, parseInt($scope.currentStepIndex,10) );
            }
        }
    }



	// will update step on scope
	function updateCurrentStep() {
		if ($scope.currentStepIndex >= 0) {
			if (!!$scope.playlist) {

                $scope.step = $scope.playlist.steps[$scope.currentStepIndex];
                updateLessonsAnswers();

				if (!!$scope.step) {
					shuffleLessonsFilter( { 'array' : $scope.step.quizItems, 'disabled' : !$scope.step.shuffleLesson , 'playlistRprt' : $scope.playlistRprt , 'stepIndex' : $scope.currentStepIndex } );
				}
			} else {
				$scope.step = null;
			}
		}
	}

	// resolving initialization issue - in case we don't have a playlist yet, and
	// we are not at step -1, $scope.step will be null/undefined.so we listen on
	// playlist and initialize it
	if (!$scope.playlist) {
		var unwatchPlaylist = $scope.$watch('playlist', function(newValue) {
			if (!!newValue && $scope.currentStepIndex !== undefined) {
				updateCurrentStep();
				unwatchPlaylist();
			}
		});
	}

	$scope.$watch('currentStepIndex', function(newValue, oldValue) {
        if ( !!$scope.playlist ) {
            $log.info('currentStepIndex changed');
            updateCurrentStep();

            // in case of temporary playlist we don't want to remember history
            // conversion ~~ to support string and numbers
            if (!!$scope.playlist.temporary || parseInt(newValue + '',10) === 0 ) { // temporary means "create playlist from mistakes" and such..
                $location.search('currentStepIndex', newValue).replace();
            } else {
                $location.search('currentStepIndex', newValue);
            }
            $rootScope.$broadcast('stepIndexChange', {
                'old': oldValue,
                'new': newValue
            });
        }
	});

	$scope.$watch(function() {
		return $routeParams.currentStepIndex;
	}, function(newValue/* , oldValue */) {
		if (newValue !== undefined) {
			$scope.currentStepIndex = newValue;
		}
	});

	$scope.hasNextStep = function() {
		return !!$scope.playlist && $scope.playlist.steps && $scope.currentStepIndex < $scope.playlist.steps.length;
	};

	$scope.showSteps = function() {
		return $scope.currentStepIndex >= 0;
	};

	$scope.nextStep = function() {
        $scope.continueBtnDisable = true;
		if ($scope.hasNextStep()) {
			$scope.currentStepIndex++;
		}
		// avoiding clicking more then once
		$timeout(function(){
            $scope.continueBtnDisable = false;
        },1000);

	};
	$scope.loaded = true;


});
