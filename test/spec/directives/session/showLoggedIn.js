'use strict';

describe('Directive: session/showLoggedIn', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<session/show-logged-in></session/show-logged-in>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the session/showLoggedIn directive');
  }));
});
