'use strict';

describe('Directive: lessonTitleImage', function () {
    beforeEach(module('lergoApp'));

    var element;

    it('should show i element if no lesson on scope', inject(function ($rootScope, $compile) {
        element = angular.element('<div lesson-title-image></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('i').length).toBe(1);
    }));
});
