'use strict';

describe('Directive: lessonTitleImage', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<lesson-title-image></lesson-title-image>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the lessonTitleImage directive');
  }));
});
