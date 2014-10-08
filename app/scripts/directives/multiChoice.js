'use strict';

angular.module('lergoApp').directive('multiChoice', function() {
	return {
		templateUrl : 'views/directives/_multiChoice.html',
		restrict : 'A',
		scope : {
			'quizItem' : '='
		},
		link : function postLink($scope) {
			$scope.isMultiChoiceMultiAnswer = function(quizItem) {
				var correctAnswers = _.filter(quizItem.options, 'checked');
				return correctAnswers.length > 1;
			};
			$scope.setSelection = function(quizItem, index) {
				for ( var i = 0; i < quizItem.options.length; i++) {
					if (i !== index) {
						quizItem.options[i].userAnswer = false;
					}
				}
			};
		}
	};
});
