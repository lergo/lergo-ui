'use strict';

describe('Directive: setFocus', function () {

  // load the directive's module
  beforeEach(module('lergoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<set-focus></set-focus>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the setFocus directive');
  }));
});
