'use strict';

describe('Service: ReportsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mReportsService;
    beforeEach(inject(function (ReportsService) {
        mReportsService = ReportsService;
    }));

    it('should findLesson by name', inject(function ($httpBackend) {
        $httpBackend.expectGET('/backend/reports/lessons/find?like=lessonName').respond(200);
        mReportsService.findLesson('lessonName');
        $httpBackend.flush();
    }));

    it('should createFromInvitation', inject(function($httpBackend){
        $httpBackend.expectPOST('/backend/reports/lessoninvitation/6').respond(200);
        mReportsService.createFromInvitation({_id:6});
        $httpBackend.flush();
    }));

    it('should call report ready', inject(function($httpBackend){
        $httpBackend.expectPOST('/backend/reports/6/ready').respond(200);
        mReportsService.ready({_id:6});
        $httpBackend.flush();

        $httpBackend.expectPOST('/backend/reports/6/ready').respond(200);
        mReportsService.ready(6);
        $httpBackend.flush();
    }));

    it('should update report', inject(function($httpBackend){
        $httpBackend.expectPOST('/backend/reports/6/update').respond(200);
        mReportsService.update({_id:6});
        $httpBackend.flush();
    }));

    it('should delete report', inject(function($httpBackend){
        $httpBackend.expectPOST('/backend/reports/6/delete').respond(200);
        mReportsService.deleteReport({_id:6});
        $httpBackend.flush();
    }));

    describe('#isCompelted', function(){
        var report;
        beforeEach(function () {
            report = { stepDurations: [
                { 'startTime': 1, 'endTime': 1 }
            ], 'data': { 'lesson': { 'steps': ['one'] } }  };
        });

        it('should see all steps are complete', function () {
            expect(mReportsService.isCompleted(report)).toBe(true);
        });

        it('should see step did not finish', function () {
            report.stepDurations[0].endTime = 'nothing!';
            expect(mReportsService.isCompleted(report)).toBe(false);
        });
    });


    describe('#continueLessonUrl', function(){
        it('should construct a url from report', function(){
            spyOn(mReportsService,'countCompletedSteps').andReturn(24);
            var url = mReportsService.continueLessonUrl({ 'invitationId' : {} , 'data' : { 'lessonId' : 3} , '_id' : 4  });
            expect(url).toBe('/#!/public/lessons/invitations/[object Object]/display?lessonId=3&reportId=4&currentStepIndex=24');
        });

        it('should return N/A if report is undefined', function(){
            expect(mReportsService.continueLessonUrl()).toBe('N/A');
        });
    });

});
