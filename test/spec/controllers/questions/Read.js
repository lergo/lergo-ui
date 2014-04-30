'use strict';

describe('Controller: QuestionsReadCtrl', function () {

  // load the controller's module
  beforeEach(module('lergoApp'));

  var QuestionsReadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionsReadCtrl = $controller('QuestionsReadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
