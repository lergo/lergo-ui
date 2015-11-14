'use strict';

describe('Directive: profileLoginButton', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock','directives-templates'));

    var element,
        $timeout,
        isolatedScope,

        scope;

    beforeEach(inject(function ($rootScope, $compile, _$timeout_) {
        scope = $rootScope.$new();
        scope.user = 'user';
        $timeout = _$timeout_;
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

    describe('mouseClicked', function(){
        it('should call "openMenu" if in mobile', function(){
            spyOn(isolatedScope,'isMobile').andReturn(true);
            spyOn(isolatedScope,'openMenu').andReturn(null);
            isolatedScope.mouseClicked({ preventDefault: function(){} });

            expect(isolatedScope.isMobile).toHaveBeenCalled();
            $timeout.flush();
            expect(isolatedScope.openMenu).toHaveBeenCalledWith(true);
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
            spyOn(LergoClient,'logout').andReturn(window.mockPromise({}));
            spyOn($location,'path');
            isolatedScope.logout();
            expect($location.path).toHaveBeenCalledWith('/');
            expect($rootScope.user).toBe(null);
        }));
    });

});
