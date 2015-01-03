'use strict';

describe('Controller: ReportsIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var ReportsIndexCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope ) {
		scope = $rootScope.$new();


		ReportsIndexCtrl = $controller('ReportsIndexCtrl', {
			$scope : scope
		});
	}));

	it('should attach filter object to scope', function() {
		expect(typeof(scope.reportsFilter)).toBe('object');
	});

    describe('scope#isComplete', function () {
        var report;
        beforeEach(function () {
            report = { stepDurations: [
                { 'startTime': 1, 'endTime': 1 }
            ], 'data': { 'lesson': { 'steps': ['one'] } }  };
        });

        it('should see all steps are complete', function () {
            expect(scope.isComplete(report)).toBe(true);
        });

        it('should see step did not finish', function () {
            report.stepDurations[0].endTime = 'nothing!';
            expect(scope.isComplete(report)).toBe(false);
        });
    });

    describe('select all', function(){
        it('should add selected=true to all reports', function(){
            scope.reports = [{},{},{}];
            scope.selectAll({ 'target' : {'checked' : true }});
            _.each(scope.reports, function(report){ expect(report.selected).toBe(true);});
        });
    });

    describe('reportType', function(){

        beforeEach(inject(function(localStorageService, $location ){
            spyOn(localStorageService, 'set');
            spyOn($location,'search');
            scope.reportsPage.reportType = 'mine';
            scope.$apply();
//            $timeout.flush();
        }));

        it('should cause a reload', inject(function(){
            expect(scope.filterPage.current).toBe(1);
            expect(scope.filterPage.updatedLast).not.toBe(undefined);
            expect(scope.reportsFilterOpts.showStudents).toBe(false);

        }));

        it('should update localStorage and location search', inject(function( localStorageService, $location ){
            expect(localStorageService.set).toHaveBeenCalledWith('reportType','mine');
            expect($location.search).toHaveBeenCalledWith('reportType','mine');
        }));
    });

    describe('loadReports',function(  ){

        beforeEach(inject(function( LergoClient, $q ){
            function getReports(){
                var deferred = $q.defer();
                deferred.resolve( { 'data' : { 'data' : [] } } );
                return deferred.promise;
            }

            spyOn(LergoClient.userData, 'getReports').andCallFake(getReports);
            spyOn(LergoClient.userData, 'getStudentsReports').andCallFake(getReports);
        }));



        it('should do nothing if filter is not defined', function(){
            scope.loadReports();
        });

        it('should invoke getReports', inject(function( LergoClient, $timeout  ){
            scope.filterPage.current = 1;
            scope.loadReports();
            expect(LergoClient.userData.getStudentsReports).toHaveBeenCalled();
            $timeout.flush();
        }));

    });
});
