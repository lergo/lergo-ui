'use strict';

describe('Directive: createYourOwnBox', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<create-your-own-box></create-your-own-box>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the createYourOwnBox directive');
  }));
});
