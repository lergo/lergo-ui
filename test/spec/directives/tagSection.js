'use strict';

describe('Directive: tagSection', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<tag-section></tag-section>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the tagSection directive');
  }));
});
