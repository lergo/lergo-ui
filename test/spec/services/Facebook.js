'use strict';

describe('Service: Facebook', function() {

	// load the service's module
	beforeEach(module('lergoApp'));

	// instantiate service
	var mFacebook;
	beforeEach(inject(function(Facebook) {
		mFacebook = Facebook;
	}));

	it('should do something', function() {
		expect(!!mFacebook).toBe(true);
	});

});
