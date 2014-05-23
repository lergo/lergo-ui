'use strict';

describe('Controller: LessonsStepDisplayCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsStepDisplayCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsStepDisplayCtrl = $controller('LessonsStepDisplayCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
