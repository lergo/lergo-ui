'use strict';

describe('Directive: lergoProgressBar', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<lergo-progress-bar></lergo-progress-bar>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the lergoProgressBar directive');
  }));
});
