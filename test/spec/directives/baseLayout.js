'use strict';

describe('Directive: baseLayout', function () {


    var translateMock = {
        translate: function (n) {
            return n;
        },
        setLanguage: function () {
//            console.log('setting language', arguments);
            return 'guy';
        }
    };


    var element;
    beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock', function ($provide) {
//        console.log('spying on setLanguage');
        $provide.value('LergoTranslate', translateMock);

//
    }));

    function setup() {
        inject(function ($rootScope, $compile) {
//            console.log('translateMock.setLanguage typeof is ', typeof(translateMock.setLanguage));

            spyOn(translateMock, 'setLanguage');

            element = angular.element('<div class="base-layout"></div>');
            element = $compile(element)($rootScope);
            $rootScope.$digest();
        });
    }


    describe('something', function () {


        it('should put getLabelForLanguage on rootScope', inject(function ($rootScope) {
            setup();
            expect(typeof($rootScope.getLabelForLanguage)).toBe('function');

        }));
//
        it('should invoke setLanguage on LergoTranslate', function () {
            setup();
            expect(translateMock.setLanguage).toHaveBeenCalled();

        });
    });
});
