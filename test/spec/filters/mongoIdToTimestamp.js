'use strict';

describe('Filter: mongoIdToTimestamp', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var mongoIdToTimestamp;
    beforeEach(inject(function ($filter) {
        mongoIdToTimestamp = $filter('mongoIdToTimestamp');
    }));

    it('should return the input prefixed with "mongoIdToTimestamp filter:"', function () {
        var text = '5414654cf832cd7a6d15593b';

        expect(mongoIdToTimestamp(text)).toBe(1410622796000);
    });

});
