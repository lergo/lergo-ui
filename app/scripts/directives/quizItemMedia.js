'use strict';

angular.module('lergoApp').directive('quizItemMedia', function($sce, $compile, $timeout, $log) {
	return {
		restrict : 'A',
		scope : {
			'quizItem' : '='
		},
		link : function postLink($scope/* , $element , attrs */) {
			$scope.getUrl = function(url) {
				return $sce.trustAsResourceUrl(url);

			};
			$scope.getMediaTemplate = function() {
				var quizItem = $scope.quizItem;
				var type = 'none';
				if (!!quizItem.media && !!quizItem.media.type && (!!quizItem.media.audioUrl || !! quizItem.media.imageUrl)) {
					type = quizItem.media.type;
				}
				return 'views/questions/view/media/_' + type + '.html';
			};

		},
		template : '<div ng-include=getMediaTemplate()></div>'
	};
});
