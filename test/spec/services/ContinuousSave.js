'use strict';

describe('Service: ContinuousSave', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var MContinuousSave;
    var eventHandlers = {};
    var confirmResult = false;

    beforeEach(inject(function (ContinuousSave, $rootScope ) {
        MContinuousSave = ContinuousSave;
        eventHandlers = {};
        $rootScope.$on = function( eventName, handler ){
            eventHandlers[eventName] = handler;
        };

        spyOn(window,'confirm').andReturn(confirmResult);
    }));

    describe('match versions', function () {

        it('should return false if never saved', function () {
            var cs = new MContinuousSave({});
            var matchResult = cs.versionMatch();
            expect(matchResult).toBe(false);
        });

        it('should return false if never got response from backend', function () {

        });

    });

    describe('getStatus', function () {
        it('should return status', function () {
            var cs = new MContinuousSave({});
            var status = cs.getStatus();
            expect(!!status).toBe(true);
        });

        it('should specify we are not saving after it loaded', function () {
            var cs = new MContinuousSave({});
            var status = cs.getStatus();
            expect(status.saving).toBe(false);
        });

        it('should specify we are saving as long as saving is in process', function () {
            var opts = {
                'saveFn': function () {
                    return {
                        'then': function (/*success, error*/) {
                        }
                    };
                }
            };
            var cs = new MContinuousSave(opts);
            cs.save();
            var status = cs.getStatus();
            expect(status.saving).toBe(true);
        });

    });

    describe('onValueChange', function () {
        it('should be a function', function () {
            var cs = new MContinuousSave({});
            expect(typeof(cs.onValueChange)).toBe('function');
        });

        it('should do nothing if newVersion and oldVersion are the same', function () {
            var cs = new MContinuousSave({});
            cs.onValueChange(1, 1);
            // no assertion. lets just verify we support this scenario
        });

        it('should do nothing if newVersion does not exist', function(){
            var cs = new MContinuousSave({});
            cs.onValueChange(null, {});
            // no assertion. lets just verify we support this scenario
        });

        it('should do nothing if lastUpdate does not equal between new and old', function(){
            var cs = new MContinuousSave({});
            cs.onValueChange({ 'lastUpdate': 1},{ 'lastUpdate' : 2});
            // no assertion. lets just verify we support this scenario
        });


        it('should save data on localStorage', inject(function(localStorageService, $timeout, $browser ){
            var cs = new MContinuousSave({});
            spyOn(localStorageService,'add');
            cs.onValueChange({'new':'value', 'lastUpdate': 1},{'old':'value', 'lastUpdate' : 1});
            expect(localStorageService.add).toHaveBeenCalled();

            expect($browser.deferredFns[0].time).toBe(0); // verifies we trigger "save" in a timeout
        }));

    });

    describe('locationChangeStart handler', function(){
        it('should exist', function(){
            new MContinuousSave({});
            expect(!!eventHandlers.$locationChangeStart).toBe(true);
        });

        it('should pop a confirm window if there are unsaved changes', function(){
            var event = { 'preventDefault' : function(){} };
            spyOn(event,'preventDefault').andCallThrough();

            var cs = new MContinuousSave({});
            cs.onValueChange({ '_id' : '111', 'lastUpdate':1},{ '_id' : '111', 'lastUpdate': 1 });
            eventHandlers.$locationChangeStart( event );
            var pf = MContinuousSave.getPreventedFlag();
            expect(event.preventDefault).toHaveBeenCalled();
            expect(pf.hasOwnProperty('111')).toBe(true);
            expect(pf.alerted).toBe(true);
            expect(window.confirm).toHaveBeenCalled();

            //debugger;
            // lets validate it is rerunnable
            eventHandlers.$locationChangeStart( event );
            expect(window.confirm.callCount).toBe(2);
        });

        it('should do nothing if no local version present', function(){
            new MContinuousSave({});
            eventHandlers.$locationChangeStart( {} );
            expect(window.confirm).not.toHaveBeenCalled();
        });

    });


    describe('#save', function () {
        it('should throw an exception if saveFn is undefined', function () {
            var cs = new MContinuousSave({});
            var hadError = false;
            try {
                cs.save();
            } catch (e) {
                hadError = true;
            }
            expect(hadError).toBe(true);
        });

        it('should save the model', function () {
            var opts = {
                'saveFn': function () {
                    return {
                        'then': function (success/*, error*/) {
                            success({});
                        }
                    };
                }
            };
            spyOn(opts,'saveFn').andCallThrough();
            var cs = new MContinuousSave(opts);
            cs.save();
            expect(opts.saveFn).toHaveBeenCalled();

            expect(cs.getStatus().saving).toBe(false); // verify flag is off now
        });

        it('should trigger save again if returned result is older than local version', inject(function( $browser){

            var newValue = { 'lastUpdate' : 2 };
            var triggerAnotherSave = true;
            var opts = {
                'saveFn': function ( model ) {
                    return {
                        'then': function (success/*, error*/) {
                            if ( triggerAnotherSave ){
                                success({ 'data' : { 'lastUpdate' : 1 } });
                            }else{
                                success({ 'data' : model });
                            }

                        }
                    };
                }
            };

            var cs = new MContinuousSave(opts);
            cs.onValueChange( newValue , _.clone(newValue) );
            $browser.deferredFns = [];
            cs.save();
            expect($browser.deferredFns[0].time).toBe(0);

            // now lets see it does not trigger save again if all is well
            triggerAnotherSave = false;
            $browser.deferredFns = [];
            cs.save();
            expect($browser.deferredFns.length).toBe(0);
        }));

        it('should do nothing if already saving', function(){
            var cs = new MContinuousSave({});
            cs.getStatus().saving = true;
            cs.save();
        });

        it('should retry on an error', inject(function ($browser) {
            var newValue = { 'lastUpdate' : 2 };

            var opts = {
                'retries': 1,
                'saveFn': function (/*model*/) {
                    return {
                        'then': function (success, error) {
                            error({'data': {'lastUpdate': 1}});
                        }
                    };
                }
            };

            var cs = new MContinuousSave(opts);
            cs.onValueChange(newValue, _.clone(newValue));
            $browser.deferredFns = [];
            cs.save();
            expect($browser.deferredFns[0].time).toBe(1000);
            // now lets see what happens when we exceed number of retries

            cs.save(); // need to execute one more since retries condition is gt, not gte.
            $browser.deferredFns = [];
            cs.save();
            expect($browser.deferredFns.length).toBe(0);
        }));

    });

});
