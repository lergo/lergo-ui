'use strict';

describe('Directive: reportLessonFilter', function () {

    // load the directive's module
    beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock'));

    var element,
        isolateScope,
        scope;

    var reset = function(){
        element = null;
        isolateScope = null;
        scope = null;
    };


    beforeEach(inject(function ($rootScope) {
        reset();
        scope = $rootScope.$new();
    }));


    var setup = inject(function( $compile ){
        element = angular.element('<div report-lesson-filter="reportLesson"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        isolateScope = element.children().scope();
    });

    it('should find lesson by name and return them to typeahead', inject(function (ReportsService, $q, $timeout) {
        setup();

        expect(typeof(isolateScope.getReportLessonsLike)).toBe('function');

        spyOn(ReportsService,'findLesson').andCallFake(function (){
            var deferred = $q.defer();
            deferred.resolve(['first lesson']);
            return deferred.promise;
        });

        var myData = null;
        isolateScope.getReportLessonsLike('likeExpression').then(function(data){
            myData = data;
        });

        try{
            $timeout.flush();
        }catch(e){}


        waitsFor(function(){
            return myData !== null;
        });

        expect(_.difference(myData,['first lesson']).length).toBe(0);
    }));

    it('should put items selected from typeahead on scope', inject(function(/*$timeout*/){
        scope.reportLesson = null;
        setup();
        expect(typeof(isolateScope.addReportLessonFromTypeahead)).toBe('function');
        isolateScope.addReportLessonFromTypeahead('my item');
        expect(isolateScope.model).toBe('my item'); // now lets test binding back to scope

//        http://stackoverflow.com/questions/27674361/how-to-test-two-way-binding-with-directives-isolatescope-in-jasmineangular
        waitsFor(function(){
            try{ isolateScope.$apply(); } catch (e) { }

            return scope.reportLesson !== null;
        });
        runs(function(){
            expect(scope.reportLesson).toBe('my item');
        });
////
    }));
});
