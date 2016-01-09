'use strict';

describe('Directive: goToMyLessonsDemo', function () {

  // load the directive's module
  beforeEach(module('lergoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  var setup = inject(function( $compile ){
    element = angular.element('<go-to-my-lessons-demo></go-to-my-lessons-demo>');
    element = $compile(element)(scope);
    scope.$digest();
  });

  it('should make hidden element visible', inject(function () {
    setup();
    expect(element.text()).toBe('this is the goToMyLessonsDemo directive');
  }));
});
