'use strict';

describe('Directive: disqusEmbed', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<disqus-embed></disqus-embed>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the disqusEmbed directive');
  }));
});
