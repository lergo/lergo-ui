'use strict';

describe('Directive: quizItemExplanationMedia', function () {

  // load the directive's module
  beforeEach(module('lergoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<quiz-item-explanation-media></quiz-item-explanation-media>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the quizItemExplanationMedia directive');
  }));
});
