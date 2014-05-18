'use strict';

describe('Controller: LessonsStepVideoCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsStepVideoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsStepVideoCtrl = $controller('LessonsStepVideoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
