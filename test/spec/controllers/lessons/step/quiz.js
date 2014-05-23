'use strict';

describe('Controller: LessonsStepQuizCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsStepQuizCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsStepQuizCtrl = $controller('LessonsStepQuizCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
