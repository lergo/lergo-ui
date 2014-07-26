'use strict';

describe('Filter: multilineEllipsis', function () {

  // load the filter's module
  beforeEach(module('lergoApp'));

  // initialize a new instance of the filter before each test
  var multilineEllipsis;
  beforeEach(inject(function ($filter) {
    multilineEllipsis = $filter('multilineEllipsis');
  }));

  it('should return the input prefixed with "multilineEllipsis filter:"', function () {
    var text = 'angularjs';
    expect(multilineEllipsis(text)).toBe('multilineEllipsis filter: ' + text);
  });

});
