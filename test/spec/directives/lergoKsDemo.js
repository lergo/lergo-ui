'use strict';

describe('Directive: lergoKsDemo', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<lergo-ks-demo></lergo-ks-demo>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the lergoKsDemo directive');
  }));
});
