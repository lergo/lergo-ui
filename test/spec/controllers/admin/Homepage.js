'use strict';

describe('Controller: AdminHomepageCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var AdminHomepageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminHomepageCtrl = $controller('AdminHomepageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
