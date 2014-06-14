'use strict';

describe('Controller: FiltersFilterCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var FiltersFilterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FiltersFilterCtrl = $controller('FiltersFilterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
