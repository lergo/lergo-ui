'use strict';

describe('Directive: question', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<question></question>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the question directive');
  }));
});
