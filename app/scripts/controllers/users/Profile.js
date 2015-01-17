'use strict';

angular.module('lergoApp').controller('UsersProfileCtrl', function($scope, LergoClient, ContinuousSave) {
	$scope.isEditAllow = false;

	var saveProfile = new ContinuousSave({
		'saveFn' : function(value) {
			return LergoClient.users.update(value);
		}
	});

	LergoClient.users.getMyProfile().then(function(result) {
		$scope.user = result.data;
		$scope.$watch('user', saveProfile.onValueChange, true);
	});
	
});
