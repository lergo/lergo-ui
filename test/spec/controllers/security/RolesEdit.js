'use strict';

describe('Controller: security/RolesEditCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var RolesEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RolesEditCtrl = $controller('RolesEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));
});
