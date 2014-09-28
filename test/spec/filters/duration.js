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

});
