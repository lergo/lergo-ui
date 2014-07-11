'use strict';

describe('Directive: quizItemMedia', function () {
  beforeEach(module('lergoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<quiz-item-media></quiz-item-media>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the quizItemMedia directive');
  }));
});
