'use strict';
 
describe('Directive: lessonTitleImage', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element;
    

    it('should show i element if no lesson on scope', inject(function ($rootScope, $compile) {
        element = angular.element('<div lesson-title-image></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('i').length).toBe(0); // no <i element
    }));
});
