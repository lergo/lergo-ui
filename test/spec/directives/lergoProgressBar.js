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

    it('should invoke ready callback after it is loaded', inject(function($rootScope, $compile, $timeout ){

        var doStuffCalled = false;
        element = angular.element('<div lergo-progress-bar value="value" ng-ready="doStuff()"></div>');
        $rootScope.value = 50;
        $rootScope.doStuff = function(){
            doStuffCalled = true;
        };
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        try {
            $timeout.flush();
        }catch(e){}
        expect(doStuffCalled).toBe(true);

    }));
});
