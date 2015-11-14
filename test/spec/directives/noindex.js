'use strict';

describe('Directive: noindex', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        expect($('head [content=noindex]').length).toBe(0, 'noindex should not be on page');
        scope = $rootScope.$new();
        element = angular.element('<div noindex></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    afterEach(function(){
        $('head [content=noindex]').remove();
    });

    it('should make hidden element visible', inject(function () {
        expect($('head [content=noindex]').length).toBe(1);
    }));
});
