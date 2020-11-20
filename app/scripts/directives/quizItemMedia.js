'use strict';

angular.module('lergoApp').directive('quizItemMedia', function($sce) {
	return {
		restrict : 'A',
		scope : {
			'quizItem' : '='
		},
		link : function postLink($scope/* , $element , attrs */) {

			function isValidImage(url) {
				return !!url;

			}

			function isValidAudio(url) {
				return !!url;

			}

			function isValid(media) {
				if (!media) {
					return false;
				}
				if (media.type === 'image') {
					return isValidImage(media.imageUrl);
				} else if (media.type === 'audio') {
					return isValidAudio(media.audioUrl);
				}
			}
			$scope.getUrl = function(url) {
				return $sce.trustAsResourceUrl(url);

			};
			$scope.getMediaTemplate = function() {
				var quizItem = $scope.quizItem;
				var type = 'none';
				if (!!quizItem && !!quizItem.media && !!quizItem.media.type && isValid(quizItem.media)) {
					type = quizItem.media.type;
				}
				return 'views/questions/view/media/_' + type + '.html';
			};
		},
		template : '<div ng-include=getMediaTemplate()></div>'
	};
});
