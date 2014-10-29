'use strict';

describe('Service: AbuseReports', function() {

	// load the service's module
	beforeEach(module('lergoApp'));

	// instantiate service
	var myAbuseReports;
	beforeEach(inject(function(AbuseReports) {
		myAbuseReports = abuseReports;
	}));

	it('should do something', function() {
		expect(!!myAbuseReports).toBe(true);
	});

});
