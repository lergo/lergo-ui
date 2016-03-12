'use strict';

describe('Filter: countQuestionsOnLesson', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var countQuestionsOnLesson;
    beforeEach(inject(function ($filter) {
        countQuestionsOnLesson = $filter('countQuestionsOnLesson');
    }));

    describe('', function () {

        var item = { 'steps': [
            {},
            { 'type' : 'quiz', 'quizItems': [ 1, 2, 3]},
            { 'type' : 'quiz', 'quizItems': [1]}
        ] };

        it('should return the input prefixed with "countQuestionsOnLesson filter:"', function () {
            expect(countQuestionsOnLesson(item)).toBe(4);
        });


    });

    it('should return 0 if input does not exists or if input does not have steps property', function () {
        expect(countQuestionsOnLesson()).toBe(0);
        expect(countQuestionsOnLesson({})).toBe(0);
    });



    it('should fail nicely. return 0 on exception', function () {
        expect(countQuestionsOnLesson({'steps': { 'length': 50 }})).toBe(0);
    });

});
