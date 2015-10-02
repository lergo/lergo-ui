'use strict';

describe('Directive: poweredByLergo', function () {

    // load the directive's module
    beforeEach(module('lergoApp', 'lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {

        scope.myLesson = { '_id' : 'theid' };

        element = angular.element('<div powered-by-lergo="myLesson"></div>');
        scope.shareLink = 'http://this-is-a-share-link';
        element = $compile(element)(scope);
        scope.$digest();

        expect(element.text()).toContain(' powered.by.lergo ');
        expect(element.find('a').attr('href').indexOf('/index.html#!/public/lessons/theid/intro') > 0 ).toBe(true);
    }));
});
