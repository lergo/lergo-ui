'use strict';

describe('Controller: TranslationsDiffCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var TranslationsDiffCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TranslationsDiffCtrl = $controller('TranslationsDiffCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
