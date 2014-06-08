'use strict';

describe('Directive: lessonView', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<lesson-view></lesson-view>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the lessonView directive');
  }));
});
