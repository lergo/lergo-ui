(function () {
	'use strict';

	angular.module('lergoApp').directive('quizItemMedia', function($sce) {
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
					if (!!quizItem && !!quizItem.media && !!quizItem.media.type && isValid(quizItem.media)) {
						type = quizItem.media.type;
					}
					return 'views/questions/view/media/_' + type + '.html';
				};
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

				function isValidImage(url) {
					return !!url;

				}

				function isValidAudio(url) {
					return !!url;

				}
			},
			template : '<div ng-include=getMediaTemplate()></div>'
		};
	});
})();
