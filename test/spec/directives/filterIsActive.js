'use strict';

describe('Directive: filterIsActive', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock', 'directives-templates'));

    var element,
        $compile,
        $rootScope,
        localStorageService,
        LergoFilterService,
        scope;

    beforeEach(inject(function (_$rootScope_, _$compile_, _localStorageService_, _LergoFilterService_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        localStorageService = _localStorageService_;
        LergoFilterService = _LergoFilterService_;

        scope = $rootScope.$new();
        localStorageService.clearAll();

        spyOn(LergoFilterService, 'resetFilter');

        compileElement();
    }));

    function compileElement(){
        try{
            $(element).remove();
        }catch(e){}
        element = angular.element('<div class="filter-is-active"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        $('body').append($(element));

    }

    afterEach(function(){
        $(element).remove();
    });

    var OFF_FLAG='filterActiveNotification';

    describe('on load', function () {
        it('should hide if localStorage says so', function(){
            localStorageService.set(OFF_FLAG,'off');
            compileElement();
            expect($(element).is(':visible')).toBeFalsy();
        });

    });

    describe('#hideNotification', function(){
        it('should hide notification and remember result in localStorage', function(){
            expect($(element).is(':visible')).toBeTruthy('element should be visible');
            expect(localStorageService.get(OFF_FLAG)).toBeNull();
            element.children().scope().hideNotification();
            expect($(element).is(':visible')).toBeFalsy('element should hide');
            expect(localStorageService.get(OFF_FLAG)).not.toBeNull();

        });
    });

    describe('#resetFilter', function(){
        it('should reset filter', function(){
            element.children().scope().resetFilter();
            expect(LergoFilterService.resetFilter).toHaveBeenCalled();
        });
    });
});
