'use strict';

describe('Directive: lergoKsDemo', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div class="lergo-ks-demo"><span>this is the demo</span></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
//        console.log(element.html());
        expect(element.find('.lergo-ks-demo-wrapper').length).toBe(1);
    }));
});
