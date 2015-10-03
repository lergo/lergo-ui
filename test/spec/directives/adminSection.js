'use strict';

describe('Directive: adminSection', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var $compile,
        scope,
        LergoClient,
        element;

    beforeEach(inject(function ($rootScope, _$compile_, _LergoClient_, $q) {
        scope = $rootScope.$new(true);
        LergoClient = _LergoClient_;
        $compile = _$compile_;
        spyOn(LergoClient,'isLoggedIn').andReturn(window.mockPromise({data:{}}));
        spyOn(LergoClient.users,'getUserPermissions').andReturn(window.mockPromise());
        spyOn($q, 'all').andCallFake(function(){
            return {
                then:function(success){
                    var isLoggedInResult = null;
                    LergoClient.isLoggedIn().then(function(result){
                        isLoggedInResult = result;
                    });

                    var getUserPermissionsResult = null;
                    LergoClient.users.getUserPermissions().then(function(result){
                        getUserPermissionsResult = result;
                    });
                    success([ isLoggedInResult, getUserPermissionsResult  ]);
                }
            };
        });
    }));

    function compile( template ){
        if ( !template ){
            template = '<div admin-section></div>';
        }
        element = angular.element(template);
        element = $compile(element)(scope);
        scope.$digest();
    }

    it('should make element hidden', function () {
        compile();
        expect(element).not.toDisplay();
    });

    it('should show element if user is admin', function(){
        LergoClient.isLoggedIn.andReturn(window.mockPromise({data:{user:{isAdmin:true}}}));
        compile();
        expect(element).toDisplay();
    });

    it('should show if user has matching permissions', function(){
        LergoClient.users.getUserPermissions.andReturn(window.mockPromise({ 'foo' : {'bar' : true }, 'hello' : { 'world' : false }}));
        LergoClient.isLoggedIn.andReturn(window.mockPromise({data:{user:{}}}));

        compile('<div admin-section="foo.bar || hello.world"></div>');
        expect(element).toDisplay();

        compile('<div admin-section="foo.bar && hello.world"></div>');
        expect(element).not.toDisplay();
    });


});
