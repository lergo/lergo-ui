'use strict';

describe('Directive: textFilter', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<text-filter></text-filter>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the textFilter directive');
  }));
});
