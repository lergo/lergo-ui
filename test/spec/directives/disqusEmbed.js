'use strict';

describe('Directive: disqusEmbed', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<disqus-embed></disqus-embed>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('');
    }));
});
