'use strict';

describe('Controller: LessonsIntroCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsIntroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsIntroCtrl = $controller('LessonsIntroCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
