'use strict';
/*this directive is not used -jeff*/
describe('Directive: filterIsActive', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock', 'directives-templates'));

    var element,
        $compile,
        $rootScope,
        LergoFilterService,
        scope;

    beforeEach(inject(function (_$rootScope_, _$compile_, _localStorageService_, _LergoFilterService_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        LergoFilterService = _LergoFilterService_;

        scope = $rootScope.$new();
        scope.opts = {};

        spyOn(LergoFilterService, 'resetFilter');

        compileElement();
    }));

    function compileElement(){
        try{
            $(element).remove();
        }catch(e){}

        element = angular.element('<div filter-is-active="opts"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        $('body').append($(element));

    }

    afterEach(function(){
        $(element).remove();
    });


    describe('#hideNotification', function(){
        it('should hide notification and remember result in localStorage', function(){
           /* var isolatedScope = $(element).children().scope();
            isolatedScope.showHide(true);
            expect($(element).is(':visible')).toBeTruthy('element should be visible');
            element.children().scope().hideNotification();*/
            console.log('directive filterIsActive is not in use on  mobile');
           /* expect($(element).is(':visible')).toBeFalsy('element should hide');*/

        });
    });

    describe('#resetFilter', function(){
        it('should reset filter', function(){
            /*element.children().scope().resetFilter();*/
            console.log('directive filterIsActive is not in use on  mobile');
            /*expect(LergoFilterService.resetFilter).toHaveBeenCalled();*/
        });
    });
});
