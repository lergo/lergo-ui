'use strict';

describe('Controller: LessonsInvitesPublicShareCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var LessonsInvitesPublicShareCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsInvitesPublicShareCtrl = $controller('LessonsInvitesPublicShareCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
