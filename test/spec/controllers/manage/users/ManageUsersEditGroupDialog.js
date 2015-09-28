'use strict';

describe('Controller: ManageUsersEditGroupDialogCtrl', function ( ) {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var ManageUsersEditGroupDialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManageUsersEditGroupDialogCtrl = $controller('ManageUsersEditGroupDialogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));
});
