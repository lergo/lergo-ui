'use strict';

describe('Directive: lessonIntroLink', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<span lesson-intro-link></a>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect($(element).is('a')).toBe(true);
    }));
});
