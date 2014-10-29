'use strict';

describe('Service: AbuseReports', function() {

	// load the service's module
	beforeEach(module('lergoApp'));

	// instantiate service
	var AbuseReports;
	beforeEach(inject(function(abuseReports) {
		AbuseReports = abuseReports;
	}));

	it('should do something', function() {
		expect(!!AbuseReports).toBe(true);
	});

});
