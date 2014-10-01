'use strict';

describe('Filter: duration', function() {

	// load the filter's module
	beforeEach(module('lergoApp'));

	// initialize a new instance of the filter before each test
	var duration;
	beforeEach(inject(function($filter) {
		duration = $filter('duration');
	}));

    it('should display duration in format hh:mm:ss', function () {
        expect(duration(0)).toBe('00:00:00');
        expect(duration(606012345)).toBe('68:20:12');
    });

    it ('should support objects with startTime and endTime', function(){
        expect(duration({'startTime' : 0, 'endTime' : 1000 })).toBe('00:00:01');
    });

    it ( 'should not support objects with only startTime or only endTime' ,function(){
        expect(duration({'startTime' : 1})).toBe('did not finish');
        expect(duration({'endTime' : 1})).toBe('did not finish');
    });

});
