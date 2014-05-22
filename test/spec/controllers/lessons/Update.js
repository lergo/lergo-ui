'use strict';

describe('Controller: LessonsUpdateCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsUpdateCtrl = $controller('LessonsUpdateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
