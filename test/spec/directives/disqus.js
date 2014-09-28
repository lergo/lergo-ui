'use strict';

describe('Directive: disqus', function () {
    beforeEach(module('lergoApp'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile, $httpBackend) {
        $httpBackend.expectGET('/backend/user/loggedin').respond({});
        element = angular.element('<disqus></disqus>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('');
    }));
});
