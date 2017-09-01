'use strict';

angular.module('lergoApp').service('$modalInstance', function(){
    this.dismiss = jasmine.createSpy('$uibModalInstance.dismiss');
});

angular.module('lergoApp').service('$modalInstanceMock', function(){
    this.dismiss = jasmine.createSpy('$uibModalInstance.dismiss');
});
