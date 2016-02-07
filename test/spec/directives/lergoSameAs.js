'use strict';

describe('Directive: lergoSameAs', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element,
        $rootScope,
        $compile,

        scope;

    beforeEach(inject(function (_$rootScope_, _$compile_ ) {

        $rootScope = _$rootScope_;
        $compile = _$compile_;

        scope = $rootScope.$new();
        element = angular.element('<form name="myForm"><input ng-model="model.email" name="email"/><input ng-model="model.emailConfirm" name="emailConfirm" lergo-same-as="model.email"/></div></form>');
        scope.model = { email : null, emailConfirm: null};
        scope.emailConfirm = null;
        element = $compile(element)(scope);
        scope.$digest();
    }));


    it('indicate error on field if does not match', inject(function () {

        // initial test case. simple error.
        scope.myForm.emailConfirm.$setViewValue('foo@bar.cmo');
        scope.myForm.email.$setViewValue('foo@bar.com');
        scope.$digest();
        expect(scope.myForm.emailConfirm.$error).toBeTruthy();

        // should detect change in emailConfirm
        scope.myForm.emailConfirm.$setViewValue('foo@bar.com');
        scope.$digest();
        expect(JSON.stringify(scope.myForm.emailConfirm.$error)).toBe(JSON.stringify({}),'should be the same');

        // should also detect change in email
        scope.myForm.email.$setViewValue('foo@bar.co');
        scope.$digest();
        expect(scope.myForm.emailConfirm.$error).toBeTruthy();
    }));
});
