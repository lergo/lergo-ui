//'use strict';
//
//describe('Directive: onEnter', function () {
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
//        element = angular.element('<on-enter></on-enter>');
//        element = $compile(element)(scope);
//        scope.$digest();
//    });
//
//    it('should make hidden element visible', inject(function () {
//        setup();
//        expect(element.text()).toBe('this is the onEnter directive');
//    }));
//});
