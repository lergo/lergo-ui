'use strict';

describe('Directive: createYourOwnBox', function () {
    beforeEach(module('lergoApp', 'directives-templates', function($provide){
        $provide.value('LergoTranslate',{
            translate : function(n){ return n;}
        })}));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile, $httpBackend) {

        element = angular.element('<div create-your-own-box></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(typeof(element.children().scope().create)).toBe('function');
    }));
});
