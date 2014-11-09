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
        expect(duration(35861)).toBe('00:00:36');
    });

    it ('should support objects with startTime and endTime', function(){
        expect(duration({'startTime' : 0, 'endTime' : 1000 })).toBe('00:00:01');
    });

    it('should show report missing info if duration is not a number or an object', function () {
        expect(duration('this is not a number')).toBe('???report.missing.info???');
    });

    it ( 'should not support objects with only startTime or only endTime' ,function(){
        expect(duration({'startTime' : 1})).toBe('???report.did.not.finish???');
        expect(duration({'endTime' : 1})).toBe('???report.did.not.finish???');
    });

});
