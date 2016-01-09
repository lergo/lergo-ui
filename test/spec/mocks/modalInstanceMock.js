'use strict';

angular.module('lergoApp').service('$modalInstance', function(){
    this.dismiss = jasmine.createSpy('$modalInstance.dismiss');
});

angular.module('lergoApp').service('$modalInstanceMock', function(){
    this.dismiss = jasmine.createSpy('$modalInstance.dismiss');
});
