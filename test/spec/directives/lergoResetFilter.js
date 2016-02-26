'use strict';

describe('Directive: lergoResetFilter', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock','directives-templates'));

    var element,
        $rootScope,
        $compile,
        $timeout,
        LergoFilterService,
        scope;

    beforeEach(inject(function (_$rootScope_, _$compile_ , _$timeout_, _LergoFilterService_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        LergoFilterService = _LergoFilterService_;

        spyOn(LergoFilterService,'resetFilter').andReturn(null);
        scope = $rootScope.$new();
        element = angular.element('<div lergo-reset-filter></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should call LergoFilterService.resetFilter on click', function () {
        element.click();
        $timeout.flush();
        expect(LergoFilterService.resetFilter).toHaveBeenCalledWith(LergoFilterService.RESET_TYPES.LOGO );
    });

    it('should pass different reset types to function', function(){
        element = angular.element('<div lergo-reset-filter="foo"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        element.click();
        $timeout.flush();
        expect(LergoFilterService.resetFilter).toHaveBeenCalledWith('foo');
    });
});

