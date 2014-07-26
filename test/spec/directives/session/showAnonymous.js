'use strict';

describe('Directive: session/showAnonymous', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<session/show-anonymous></session/show-anonymous>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the session/showAnonymous directive');
  }));
});
