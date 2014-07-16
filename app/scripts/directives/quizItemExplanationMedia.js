'use strict';

angular.module('lergoApp').directive('quizItemExplanationMedia', function($sce) {
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
				if (!!quizItem.explanationMedia && !!quizItem.explanationMedia.type && isValid(quizItem.explanationMedia)) {
					type = quizItem.explanationMedia.type;
				}
				return 'views/questions/view/explanationMedia/_' + type + '.html';
			};
			function isValid(media) {
				if (!media) {
					return false;
				}
				if (media.type === 'image') {
					return isValidImage(media.imageUrl);
				} else if (media.type === 'audio') {
					return isValidAudio(media.audioUrl);
				} else if (media.type === 'video') {
					return isValidVideo(media.videoUrl);
				}
			}

			function isValidImage(url) {
				return !!url;

			}

			function isValidAudio(url) {
				return !!url;

			}

			function isValidVideo(url) {
				return !!url;

			}
			$scope.getYoutubeEmbedSource = function(url) {
				var src = '//www.youtube.com/embed/' + getVideoId(url) + '?rel=0&iv_load_policy=3';
				return $sce.trustAsResourceUrl(src);
			};
			function getVideoId(url) {
				var value = null;
				if (!!url) {
					if (url.toLocaleLowerCase().indexOf('youtu.be') > 0) {
						value = url.substring(url.lastIndexOf('/') + 1);
					} else {
						value = url.split('?')[1].split('v=')[1];
					}
				}

				return value;
			}
		},
		template : '<div ng-include=getMediaTemplate()></div>'
	};
});
