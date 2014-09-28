'use strict';

describe('Directive: modalBackground', function () {
    beforeEach(module('lergoApp'));

    var element;

    it('should have transcluded content', inject(function ($rootScope, $compile) {
        element = angular.element('<div modal-background>transcluded content</div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('transcluded content');
    }));
});
