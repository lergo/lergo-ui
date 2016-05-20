'use strict';

describe('Directive: filterIsActiveShowHide', function () {

    // load the directive's module
    beforeEach(module('lergoApp'));

    var element,
        $compile,
        $rootScope,
        scope;

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $compile = _$compile_;
        element = angular.element('<div filter-is-active-show-hide></div>');
        element = _$compile_(element)(scope);
    }));


    describe('#showHide', function(){
        it('should show/hide the element when filter is active or not', function(){
            var $element = $(element);
            $('body').append($element);
            scope.showHide(true);
            expect($element.is(':visible')).toBe(true);
            scope.showHide(false);
            expect($element.is(':visible')).toBe(false);
            scope.showHide(true);
            expect($element.is(':visible')).toBe(true);
            $element.remove();
        });
    });
});
