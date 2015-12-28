'use strict';

describe('Directive: lergoInputConverter', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element,
        $rootScope,
        $compile,
        LergoResourceLinksConverter,
        scope;

    beforeEach(inject(function (_$rootScope_, _LergoResourceLinksConverter_) {
        LergoResourceLinksConverter = _LergoResourceLinksConverter_;
        spyOn(LergoResourceLinksConverter,'convert').andReturn('foo');
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        scope.model = 'bar';
        setup();
    }));

    var setup = inject(function (_$compile_) {
        $compile = _$compile_;

        element = angular.element('<div lergo-input-converter ng-model="model"></div>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    it('should make hidden element visible', function () {
        expect(LergoResourceLinksConverter.convert).toHaveBeenCalledWith('bar');
        expect(scope.model).toBe('foo');
    });
});
