'use strict';

describe('Filter: format', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var format;
    beforeEach(inject(function ($filter) {
        format = $filter('format');
    }));

    it('should format a string', function () {
        var text = 'angularjs #{name}';
        expect(format(text, {'name' : 'guy'})).toBe('angularjs guy');
    });

});
