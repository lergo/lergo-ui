(function () {
	'use strict';

	angular.module('lergoApp').directive('trueFalse', function() {
		return {
			templateUrl : 'views/directives/_trueFalse.html',
			restrict : 'A',
			scope : {
				quizItem : '=',
				click : '&onClick'
			},
			link : function postLink($scope) {
				$scope.submit = function(option) {
					$scope.quizItem.userAnswer = option;
					$scope.click();
				};

			}
		};
	});
})();
