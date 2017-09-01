'use strict';

describe('Directive: goToMyLessonsDemo', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock','directives-templates'));

    var element,
        $rootScope,
        $modal,
        $modalInstance,
        localStorageService,
        $location,
        $compile,
        scope;

    beforeEach(inject(function ( _$compile_, _$rootScope_, _localStorageService_, _$location_, _$uibModal_, _$modalInstanceMock_) {
        $compile = _$compile_;
        $modal = _$uibModal_;
        localStorageService = _localStorageService_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $modalInstance = _$modalInstanceMock_;

        spyOn(localStorageService,'get').andReturn(false);
        spyOn(localStorageService,'set');
        spyOn($location,'url').andReturn('foo');


        spyOn($modal,'open').andReturn($modalInstance);

        compileElement();

    }));

    function compileElement(){
        scope = $rootScope.$new();
        element = angular.element('<div go-to-my-lessons-demo></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }


    describe('load', function(){
        it('should query if localStorage value exists', function(){
            expect(localStorageService.get).toHaveBeenCalledWith('seen.goToMyLessonsDemo');
        });

        it('should do nothing if localStorage kept seen flag', function(){
            localStorageService.get.andReturn(true);
            compileElement();
            expect(scope.openGoToMyLessonsDemoDialog).toBeUndefined();
        });
    });

    describe('listeners', function() {


        /**
         *
         * @type {object}
         * @property {function} locationChangeStart
         */
        var listeners = null;
        beforeEach(function(){
            listeners = window.mapListeners(scope);
        });

        describe('$locationChangeStart', function () {
            it('should open dialog', function () {
                var event = { 'preventDefault' : function(){}};
                spyOn(event,'preventDefault');
                spyOn(scope,'openGoToMyLessonsDemoDialog');
                listeners.locationChangeStart(event);
                expect(event.preventDefault).toHaveBeenCalled();
                expect(scope.openGoToMyLessonsDemoDialog).toHaveBeenCalled();
                expect($location.url).toHaveBeenCalled();
            });
        });
    });

    describe('#openGoToMyLessonsDemoDialog', function(){
        it('should open dialog', function(){
            scope.openGoToMyLessonsDemoDialog();
            expect($modal.open).toHaveBeenCalled();
        });
    });

    describe('#close', function(){
        beforeEach(function(){
            scope.openGoToMyLessonsDemoDialog();
        });

        it('should close dialog', function(){
            scope.close();
            var listeners = window.mapListeners(scope);
            expect(listeners.locationChangeStart).toBeUndefined();
            expect($modalInstance.dismiss).toHaveBeenCalled();
            expect($location.url).toHaveBeenCalled();
        });

        it('should remember', function(){
            scope.close(true);
            expect(localStorageService.set).toHaveBeenCalled();
        });
    });


    describe('#okGotIt, #dontShowAgain', function(){
        it('should call close without/with remember accordingly', function(){
            spyOn(scope,'close');
            scope.okGotIt();
            expect(scope.close).not.toHaveBeenCalledWith(true);
            scope.dontShowAgain();
            expect(scope.close).toHaveBeenCalledWith(true);
        });
    });
});
