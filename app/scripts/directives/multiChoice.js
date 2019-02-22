(function () {
	'use strict';

	angular.module('lergoApp').directive('multiChoice', function() {
		return {
			templateUrl : 'views/directives/_multiChoice.html',
			restrict : 'A',
			scope : {
				quizItem : '=',
				click : '&onClick'
			},
			link : function postLink($scope) {
				$scope.isMultiChoiceMultiAnswer = function(quizItem) {
					var correctAnswers = _.filter(quizItem.options, 'checked');
					return correctAnswers.length > 1;
				};
				$scope.setSingleAnswer = function(quizItem, index) {

					_.each(quizItem.options, function(opt){ opt.userAnswer = false; });
					quizItem.options[index].userAnswer = true;

					quizItem.userAnswer = [];
					quizItem.userAnswer.push(quizItem.options[index].label);
					$scope.click();
				};
			}
		};
	});
})();
