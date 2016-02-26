'use strict';

describe('Directive: clearErrors', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element,
        $rootScope,
        $timeout,
        $compile,
        scope;

    beforeEach(inject(function (_$rootScope_, _$compile_, _$timeout_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        scope = $rootScope.$new();
        element = angular.element('<form name="someForm"><input ng-model="email" name="email" clear-errors/></form>');
        element = $compile(element)(scope);
    }));

    var triggerKeyDown = function (element, keyCode) {
        var e = angular.element.Event('keydown');
        e.which = keyCode;
        element.trigger(e);
    };

    it('should clear errors on keydown', function () {
        scope.someForm.email.$setValidity('someError', false);
        expect(scope.someForm.email.$error.someError).toBe(true, 'error was set by setValidity');
        var input = element.find('input');
        input.val('anotherValue');
        triggerKeyDown( input, 53); // any key code..
        $timeout.flush();
        expect(!!scope.someForm.email.$error.someError).toBe(false, 'error should have been cleaned by directive');
    });
});
