'use strict';

describe('Controller: CreateLessonCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var CreateLessonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateLessonCtrl = $controller('CreateLessonCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
