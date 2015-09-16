'use strict';

describe('Controller: security/GroupsIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var security/GroupsIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    security/GroupsIndexCtrl = $controller('security/GroupsIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));
});
