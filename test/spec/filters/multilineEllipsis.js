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

    it('should return the text if it is short enough', function(){
        expect(multilineEllipsis('short')).toBe('short');
    });

    it ('should truncate text with sentences longer than limit' , function(){
        var result = multilineEllipsis('this. is. a. long. text', 10);
        expect(result).toBe('this. is.');

        expect(multilineEllipsis('this. is the long text',10)).toBe('this.');
    });

    it ('should truncate text without sentences longer than limit', function(){
        var result = multilineEllipsis('this is a long text', 10);
        // note: even though "this. is." is the correct answer, our implementation assumes the last
        // "sentence" is incomplete, and so it removed it. leaving us with only "this." - we are ok with this. :)
        expect(result).toBe('this is a');
    });

});
