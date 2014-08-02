'use strict';

describe('Filter: shuffle', function () {

    // load the filter's module
    beforeEach(module('lergoApp'));

    // initialize a new instance of the filter before each test
    var shuffle;
    beforeEach(inject(function ($filter) {
        shuffle = $filter('shuffle');
    }));

    it('should return the array with isShuffled field set to true"', function () {
        var a = [1, 2, 3, 4];
        expect(shuffle(a).isShuffled).toBe(true);
    });

});
