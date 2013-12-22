'use strict';

describe('Directive: modalBackground', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<modal-background></modal-background>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the modalBackground directive');
  }));
});
