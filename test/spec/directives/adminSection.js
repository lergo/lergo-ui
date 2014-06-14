'use strict';

describe('Directive: adminSection', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<admin-section></admin-section>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the adminSection directive');
  }));
});
