//'use strict';
//
//describe('Directive: selectAllTextOnClick', function () {
//
//    // load the directive's module
//    beforeEach(module('lergoApp'));
//
//    var element,
//        scope;
//
//    beforeEach(inject(function ($rootScope) {
//        scope = $rootScope.$new();
//    }));
//
//    var setup = inject(function ($compile) {
//        element = angular.element('<div select-all-text-on-click></div>');
//        element = $compile(element)(scope);
//        scope.$digest();
//    });
//
//    it('should make hidden element visible', inject(function () {
//        setup();
//        expect(element.text()).toBe('this is the selectAllTextOnClick directive');
//    }));
//});
