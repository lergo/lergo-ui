'use strict';

describe('Controller: security/GroupsUpdateCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var security/GroupsUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    security/GroupsUpdateCtrl = $controller('security/GroupsUpdateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));
});
