'use strict';

describe('Directive: profileLoginButton', function () {

  // load the directive's module
  beforeEach(module('lergoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  var setup = inject(function( $compile ){
    element = angular.element('<profile-login-button></profile-login-button>');
    element = $compile(element)(scope);
    scope.$digest();
  });

  it('should make hidden element visible', inject(function () {
    setup();
    expect(element.text()).toBe('this is the profileLoginButton directive');
  }));
});
