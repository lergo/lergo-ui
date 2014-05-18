'use strict';

describe('Filter: i18nDirection', function () {

  // load the filter's module
  beforeEach(module('lergoApp'));

  // initialize a new instance of the filter before each test
  var i18nDirection;
  beforeEach(inject(function ($filter) {
    i18nDirection = $filter('i18nDirection');
  }));

  it('should return the input prefixed with "i18nDirection filter:"', function () {
    var text = 'angularjs';
    expect(i18nDirection(text)).toBe('i18nDirection filter: ' + text);
  });

});
