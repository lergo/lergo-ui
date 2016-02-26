'use strict';

describe('Controller: ReportsIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp','lergoBackendMock','directives-templates'));

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

    describe('scope#isComplete', function (  ) {
        it('should trigger the service', inject(function( ReportsService ){
            spyOn(ReportsService,'isCompleted');
            scope.isCompleted({ 'data' :  { 'lesson' : { 'steps' : [] } } } );
            expect(ReportsService.isCompleted).toHaveBeenCalled();
        }));
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
            spyOn($location,'search').andReturn({ replace: function(){}});
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
