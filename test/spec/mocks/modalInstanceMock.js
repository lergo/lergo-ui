'use strict';

angular.module('lergoApp').service('$modalInstance', function(){
    this.dismiss = jasmine.createSpy('$modalInstance.dismiss');
});
