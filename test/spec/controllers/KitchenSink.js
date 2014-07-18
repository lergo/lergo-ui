'use strict';

describe('Controller: KitchenSinkCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var KitchenSinkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KitchenSinkCtrl = $controller('KitchenSinkCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
