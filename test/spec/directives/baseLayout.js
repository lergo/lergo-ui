'use strict';

describe('Directive: baseLayout', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<base-layout></base-layout>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the baseLayout directive');
  }));
});
