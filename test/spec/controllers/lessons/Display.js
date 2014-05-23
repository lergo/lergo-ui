'use strict';

describe('Controller: LessonsDisplayCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsDisplayCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsDisplayCtrl = $controller('LessonsDisplayCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
