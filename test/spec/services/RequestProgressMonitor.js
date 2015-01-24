'use strict';

describe('Service: RequestProgressMonitor', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mRequestProgressMonitor;
    beforeEach(inject(function (RequestProgressMonitor) {
        mRequestProgressMonitor = RequestProgressMonitor;
    }));

    it('should do something', function () {
        expect(!!mRequestProgressMonitor).toBe(true);
    });

    it('should create new monitor', function(){
        var mon = mRequestProgressMonitor.newMonitor({ 'then' : function(){} });
        expect(!!mon).toBe(true);
        expect(mon.error).toBe(false);
        expect(mon.success).toBe(false);
        expect(mon.inProgress).toBe(true);
    });

    it('should monitor success or error of request', function(){
        var doSuccess = true;
        var promise = { 'then' : function( success ,error ){
            if ( doSuccess ){
                success();
            } else{
                error();
            }
        } };
        var mon = mRequestProgressMonitor.newMonitor( promise );
        expect(mon.success).toBe(true);
        expect(mon.error).toBe(false);

        doSuccess = false;
        mon = mRequestProgressMonitor.newMonitor(promise);
        expect(mon.success).toBe(false);
        expect(mon.error).toBe(true);
    });


});
