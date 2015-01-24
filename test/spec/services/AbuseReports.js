'use strict';

describe('Service: AbuseReports', function() {

	// load the service's module
	beforeEach(module('lergoApp'));

	// instantiate service
	var myAbuseReports;
	beforeEach(inject(function(AbuseReports) {
		myAbuseReports = AbuseReports;
	}));

	it('should report a lesson', inject(function( $httpBackend ) {
        var report = {};
        var lesson = { '_id' : '6' };
		myAbuseReports.abuseLesson( report, lesson );
        $httpBackend.expectPOST('/backend/reportabuse/6/abuse').respond(200);
        $httpBackend.flush();
	}));

    describe('#getAll', function(){
        it('should throw exception if no query obj', function(){
            var hadError = false;
            try{
                myAbuseReports.getAll();
            }catch(e){
                hadError = true;
            }

            expect(hadError).toBe(true);
        });

        it('should get all reports', inject( function( $httpBackend ){
            var queryObj = {};
            $httpBackend.expectGET('/backend/abuseReports/get/all?query=' + encodeURIComponent(JSON.stringify(queryObj))).respond(200);
            myAbuseReports.getAll( queryObj );
            $httpBackend.flush();
        }));
    });

    it('should delete a report', inject(function( $httpBackend ){
        $httpBackend.expectPOST('/backend/abuseReports/6/delete').respond(200);
        myAbuseReports.deleteReports(6);
        $httpBackend.flush();
    }));

    it('should update a report', inject(function($httpBackend){
        $httpBackend.expectPOST('/backend/abuseReports/6/update').respond(200);
        myAbuseReports.update({_id:6});
        $httpBackend.flush();
    }));

});
