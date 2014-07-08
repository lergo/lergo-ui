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
    var text = 'angularjs';
    expect(countQuestionsOnLesson(text)).toBe('countQuestionsOnLesson filter: ' + text);
  });

});
