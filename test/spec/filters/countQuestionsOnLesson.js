'use strict';

describe('Filter: countQuestionsOnLesson', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var countQuestionsOnLesson;
    beforeEach(inject(function ($filter) {
        countQuestionsOnLesson = $filter('countQuestionsOnLesson');
    }));

    it('should return the input prefixed with "countQuestionsOnLesson filter:"', function () {
        var item = { 'steps': [
            {},
            { 'quizItems': [ 1, 2, 3]},
            { 'quizItems': [1]}
        ] };
        expect(countQuestionsOnLesson(item)).toBe(4);
    });

});
