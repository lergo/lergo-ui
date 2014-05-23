'use strict';

describe('Controller: LessonsInvitesIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsInvitesIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsInvitesIndexCtrl = $controller('LessonsInvitesIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
