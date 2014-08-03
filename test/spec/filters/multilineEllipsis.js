'use strict';

describe('Filter: multilineEllipsis', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var multilineEllipsis;
    beforeEach(inject(function ($filter) {
        multilineEllipsis = $filter('multilineEllipsis');
    }));

    it('should return a shorter input when multiple newlines are specified in input', function () {
        var text = 'angularjs \n\n\n\n\n some more text';
        expect(multilineEllipsis(text).length < text.length).toBe(true);
    });

});
