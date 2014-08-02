'use strict';

describe('Directive: lergoProgressBar', function () {
    beforeEach(module('lergoApp', 'directives-templates'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div lergo-progress-bar value="value"></div>');
        $rootScope.value = 50;
        element = $compile(element)($rootScope);
        $rootScope.$digest();

        expect(element.text().trim()).toBe('50%');
    }));
});
