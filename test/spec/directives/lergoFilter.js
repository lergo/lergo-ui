'use strict';

describe('Directive: lergoFilter', function () {
    beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock', 'LocalStorageModule'));

    var element;

    var elementText = '<div lergo-filter opts="opts" model="model"></div>';

    function generate( scope ){
        inject( function($compile){
            element = angular.element( elementText );
            element = $compile(element)(scope);
            scope.$digest();
        });
    }

    it('should have a form in display', inject(function ($rootScope) {
        $rootScope.model = {};

        generate( $rootScope );

        expect($(element).find('form').length === 1 || $(element).is('form')).toBe(true);
    }));


    // tests that fix to LERGO-490 applies.
    // the fix contained
    it('should trigger watch functions when loading from local storage', inject(function($rootScope, localStorageService, $timeout){
        $rootScope.model = {};
        $rootScope.opts = { 'showAge' : true };
        localStorageService.set('lergoFilter.ageFilter', { 'min' : 10 });

        generate( $rootScope );

        $timeout.flush();
        /*jshint camelcase: false */
        expect(element.children().scope().model.age.dollar_gte).toBe(10);

    }));


    function changeUser( scopeField, modelField ){
        inject(function( $rootScope ){
            $rootScope.model = {};
            $rootScope.opts = {};

            generate($rootScope);

            element.children().scope()[scopeField] = { '_id' : 'this is the id' };
            $rootScope.$digest();

            expect(element.children().scope().model[modelField]).toBe('this is the id');
        });

    }

    it('should update model.userId when "createdBy" is changed', function(){
        changeUser( 'createdBy', 'userId' );
    });

    it('should update reporterId when reportedBy changes', function(){
        changeUser('reportedBy', 'reporterId');
    });
});
