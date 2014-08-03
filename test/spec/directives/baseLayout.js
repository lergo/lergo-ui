'use strict';

describe('Directive: baseLayout', function () {

    var translateMock = {
        translate: function(n){ return n; },
        setLanguage: function(){}
    };

    beforeEach(module('lergoApp', 'directives-templates', function($provide){
        spyOn(translateMock, 'setLanguage');
        $provide.value('LergoTranslate',translateMock);
    }));

    var element;

    it('should put getLabelForLanguage on rootScope', inject(function ($rootScope, $compile, $httpBackend) {
        $httpBackend.expectGET('/backend/user/loggedin').respond(200, '{}');
        $httpBackend.expectGET('/backend/public/lessons').respond(200, '{}');
        element = angular.element('<div class="base-layout"></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(typeof($rootScope.getLabelForLanguage)).toBe('function');
    }));

    it ( 'should invoke setLanguage on LergoTranslate', function(){
        expect(translateMock.setLanguage).toHaveBeenCalled();
    });
});
