'use strict';

describe('Controller: DisqusPageCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var DisqusPageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DisqusPageCtrl = $controller('DisqusPageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
