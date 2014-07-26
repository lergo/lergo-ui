'use strict';

describe('Controller: LessonsInvitationsDisplayCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsInvitationsDisplayCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsInvitationsDisplayCtrl = $controller('LessonsInvitationsDisplayCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
