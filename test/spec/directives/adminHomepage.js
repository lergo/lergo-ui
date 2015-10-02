'use strict';

describe('Directive: adminHomepage', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock','directives-templates'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element('<div admin-homepage></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));



    describe('#isActive', function(){
        it('should return true if currentSection', function(){
            scope.currentSection = 'foo';
            expect(scope.isActive({ id: 'foo' })).toBe(true);
            expect(scope.isActive({ id: 'bar' })).toBe(false);

        });
    });

});
