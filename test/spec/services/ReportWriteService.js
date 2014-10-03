'use strict';

describe('Service: Reportwriteservice', function () {

    // load the service's module
    beforeEach(module('lergoApp', 'LergoTestResources'));

    // instantiate service
    var mReportWriteService;
    var mLergoTestResourcesService;

    beforeEach(inject(function (ReportWriteService, LergoTestResourcesService) {
        mReportWriteService = ReportWriteService;
        mLergoTestResourcesService = LergoTestResourcesService;
    }));

    it('should do something', function () {
        expect(!!mReportWriteService).toBe(true);
    });

    it('should calculate duration of entire report based on all steps', function () {
        var report = mLergoTestResourcesService.reportDurationWriteTest.report1;
        expect(!!report).toBe(true);

        var result = mReportWriteService.calculateReportDuration(report);
        expect(result).toBe(report.duration);
    });

});
