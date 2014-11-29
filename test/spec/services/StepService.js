'use strict';

describe('Service: Stepservice', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mStepService;
    beforeEach(inject(function (StepService) {
        mStepService = StepService;
    }));

    it('should do something', function () {
        expect(!!mStepService).toBe(true);
    });

    it('should return true if quiz step mode is test', function(){
        expect(mStepService.isTestMode({ 'testMode': 'True'})).toBe(true);
    });

    it('should return false if quiz step mode is false', function(){
       expect(mStepService.isTestMode({ 'testMode' : '' })).toBe(false);
    });

});
