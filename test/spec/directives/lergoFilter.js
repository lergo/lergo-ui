'use strict';

describe('Directive: lergoFilter', function () {
    beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock', 'LocalStorageModule'));

    var element;

    var elementText = '<div lergo-filter opts="opts" model="model"></div>';

    function generate( scope ){
        inject( function($compile, $httpBackend ){

            element = angular.element( elementText );
            element = $compile(element)(scope);
            scope.$digest();
            $httpBackend.flush();

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


    /**
     *
     * @param scopeField
     * @param scopeValue
     * @param modelField
     * @param modelValue
     * @param opts { noValue : _value to put to signify 'no value'_ }
     */
    function testChangeProperty( scopeField, scopeValue, modelField, modelValue, opts ){
        opts = opts || { 'noValue' : null };
        inject(function( $rootScope ){
            $rootScope.model = {};

            $rootScope.opts = { 'showStudents' : true, 'showLanguage': true};

            generate($rootScope);


            element.children().scope()[scopeField] = scopeValue;
            $rootScope.$digest();


            expect(_.isEqual(element.children().scope().model[modelField],modelValue)).toBe(true);

            element.children().scope()[scopeField] = opts.noValue;
            $rootScope.$digest();
            expect(element.children().scope().model[modelField]).toBe(undefined);
        });

    }

    it('should update model.userId when "createdBy" is changed', function(){
        testChangeProperty( 'createdBy', { '_id' : 'this is the id' }, 'userId', 'this is the id' );
    });

    it('should update reporterId when reportedBy changes', function(){
        testChangeProperty('reportedBy', { '_id' : 'this is the id' }, 'reporterId', 'this is the id');
    });

    it('should update lessonId when reportLesson changes', function(){
        testChangeProperty('reportLesson', { '_id' : 'this is reportLesson' }, 'data.lessonId', 'this is reportLesson');
    });

    it('should update reportStudent', function(){
        testChangeProperty('reportStudent', 'the name', 'data.invitee.name', 'the name' );
    });

    it('should update tags', function(){
        testChangeProperty('filterTags', [{'label' : 'guy'}], 'tags.label',{ 'dollar_in' : ['guy']});
        testChangeProperty('filterTags', [], 'tags.label',undefined);
    });

    it('should update reportStudent if options changed', inject(function ($rootScope) {

        $rootScope.opts = { 'showStudents': false };
        $rootScope.model = {};
        generate($rootScope);
        var elementScope = element.children().scope();
        elementScope.reportStudent = 'i am a student';
        elementScope.$digest();
        expect(elementScope['data.invitee.name']).toBe(undefined);


        elementScope.opts = { 'showStudents': true };
        elementScope.$digest();
        expect(elementScope.model['data.invitee.name']).toBe('i am a student');
    }));


    it('should update model on lesson statusValue change', function () {
        testChangeProperty('statusValue', 'private', 'public', { 'dollar_exists': false });
        testChangeProperty('statusValue', 'public', 'public', { 'dollar_exists': true });
    });

    it('should update model on report statusValue change', function () {
        testChangeProperty('reportStatusValue', 'complete', 'data.finished', { 'dollar_exists': true  });
        testChangeProperty('reportStatusValue', 'incomplete', 'data.finished', { 'dollar_exists': false  });
    });

    function changeMinMaxFilters(scopeFilter, modelFilter) {
        testChangeProperty(scopeFilter, {'max': 5}, modelFilter, { 'dollar_lte': 5 }, {'noValue': {}});
        testChangeProperty(scopeFilter, {'min': 5}, modelFilter, { 'dollar_gte': 5 }, {'noValue': {}});
        testChangeProperty(scopeFilter, {'min': 5, 'max': 7}, modelFilter, { 'dollar_lte': 7, 'dollar_gte': 5 }, {'noValue': {}});
    }

    it('should update ageFilter', function(){
        changeMinMaxFilters('ageFilter','age');
    });

    it('should update ageFilter', function(){
        changeMinMaxFilters('viewsFilter','views');
    });

    it('should update ageFilter', function(){
        changeMinMaxFilters('correctPercentage','correctPercentage');
    });


    it ('should delete some null properties from model', inject(function( $rootScope ){
        $rootScope.model = {};
        $rootScope.opts = {};
        generate( $rootScope );
        var elementScope = element.children().scope();

        // guy - removed language because it cannot have value null anymore.. default is current language, and has all/other. so no null. ever..
        var fields = [ 'subject', 'public', 'status', 'age', 'userId', 'views', 'searchText', 'correctPercentage', 'data.finished' ];
        _.each( fields, function(field){
            elementScope.model[field] = null;
        });

        elementScope.$digest();
        _.each(fields, function(field){
            expect(elementScope.model[field]).toBe(undefined, 'field ' + field + ' has the wrong value');
        });
    }));

    it('should update language if changed on rootScope', inject(function($rootScope, $timeout){
        $rootScope.model = {};
        $rootScope.opts =  {};

        generate($rootScope);
        var elementScope = element.children().scope();
        $rootScope.lergoLanguage = 'dummy';
        elementScope.$digest();
        $timeout.flush();
        $rootScope.lergoLanguage = 'en';
        elementScope.$digest();
        expect(elementScope.model.language).toBe('english');
    }));

    it('should consider routeParams', inject(function($routeParams, $rootScope){
        $routeParams['lergoFilter.model.subject'] = '"math"';
        $rootScope.model = {};
        $rootScope.opts =  { 'showSubject' : true };
        generate($rootScope);
        var elementScope = element.children().scope();
        expect(elementScope.model.subject).toBe('math');
    }));
});
