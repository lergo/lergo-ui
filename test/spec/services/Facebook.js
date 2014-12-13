'use strict';

describe('Service: Facebook', function() {

	// load the service's module
	beforeEach(module('lergoApp'));

	// instantiate service
	var facebook;
	beforeEach(inject(function(fb) {
		facebook = fb;
	}));

	it('should do something', function() {
		expect(!!facebook).toBe(true);
	});

});
