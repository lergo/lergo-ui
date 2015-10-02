'use strict';

describe('Directive: profileLoginButton', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock','directives-templates'));

    var element,
        isolatedScope,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.user = 'user';
        element = angular.element('<div profile-login-button="user"></div>');
        element = $compile(element)(scope);

        scope.$digest();
        isolatedScope = element.children().scope();
    }));

    describe('#openMenu', function(){
        it('should set openMenu with given value', function(){
            isolatedScope.openMenu( true  );
            expect(isolatedScope.menuIsOpen).toBe( true );
            isolatedScope.openMenu( false );
            expect(isolatedScope.menuIsOpen).toBe( false );
        });
    });

    describe('#logout', function(){
        it('should call LergoClient.logout', inject(function(LergoClient){
            spyOn(LergoClient,'logout').andReturn({then:function(){}});
            isolatedScope.logout();
            expect(LergoClient.logout).toHaveBeenCalled();
        }));

        it('should call path with / when logout is done and set $rootScope.user to null' , inject(function(LergoClient, $location, $rootScope ){
            $rootScope.user = 'foo';
            spyOn(LergoClient,'logout').andReturn({
                then:function(success){
                    success();
                }
            });
            spyOn($location,'path');
            isolatedScope.logout();
            expect($location.path).toHaveBeenCalledWith('/');
            expect($rootScope.user).toBe(null);
        }));
    });

});
