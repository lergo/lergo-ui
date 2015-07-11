'use strict';

describe('Controller: LessonsStepDisplayCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsStepDisplayCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LessonsStepDisplayCtrl = $controller('LessonsStepDisplayCtrl', {
            $scope: scope
        });
    }));

    // helper function to initialize array of answers to proper size
    // abstracts the meaning of `currentIndex()` in controller -- a private method
    // so that if implementation changes, we will have a single place to modify in the tests
    function setCurrentIndex( currentIndex ){
        var newAnswers = [];
        for ( var i = 0; i < currentIndex; i++){
            newAnswers.push({});
        }
        scope.answers = newAnswers;
    }

    describe('#nextQuizItem', function(){
        beforeEach(function(){
            scope.questions = { '1' : { id : 1 }   ,  '2' : { 'id' : 2 }   ,  '3'  : {  'id' : 3 }  } ;
            scope.step = { quizItems : [ '1', '2', '3'] };
        });
        it('should do nothing if no questions on scope', function(){
            scope.questions = null;
            setCurrentIndex(0);
            scope.nextQuizItem();
            expect(scope.quizItem).toBe(undefined);
        });
        it('should skip answered questions if unanswered questions exist', function(){
            setCurrentIndex(1);
            scope.nextQuizItem();
            expect(scope.quizItem.id).toBe(2);
        });

        it('should give last question in quiz if all questions were answered LERGO-610', function(){
            setCurrentIndex(3);
            scope.nextQuizItem();
            expect(scope.quizItem.id).toBe(3);
        });
    });

    it('should ')
});
