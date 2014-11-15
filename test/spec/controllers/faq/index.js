'use strict';

describe('Controller: FaqIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var FaqIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FaqIndexCtrl = $controller('FaqIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
