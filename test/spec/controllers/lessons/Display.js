'use strict';

describe('Controller: LessonsDisplayCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    describe('non preview mode', function(){


        var LessonsDisplayCtrl,
            route = {},
            scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope ) {
            scope = $rootScope.$new();

            route.current = {
                $$route : {
                    params: {
                        preview:false
                    }
                }
            };


            LessonsDisplayCtrl = $controller('LessonsDisplayCtrl', {
                $scope: scope,
                $route: route
            });
        }));

        it('should set currentStepIndex to 0', function () {
            expect(scope.currentStepIndex).toBe(0);
        });
    });

    describe('controller initial load in preview mode', function () {
        var successResult = null;
        var errorResult = null;
        var scope;

        beforeEach(inject(function ( $rootScope ) {
            successResult = null;
            errorResult = null;
            scope = $rootScope.$new();
        }));
        var loadController = inject(function loadController(LergoClient, $controller ) {

            spyOn(LergoClient.lessons, 'getById').andReturn({
                then: function (success, error) {
                    if ( successResult ){ success(successResult); }
                    if ( errorResult ){ error(errorResult); }
                }
            });

            $controller('LessonsDisplayCtrl', {
                $scope: scope,
                $route:  { current: {$$route: { params: { preview : true }}}}
        });

        });

        it('should call lesson.getById', inject(function (LergoClient) {
            loadController();
            expect(LergoClient.lessons.getById).toHaveBeenCalled();
        }));

        it('should put lesson on scope on success', function(){
            successResult = { data : 'foo' };
            loadController();
            expect(scope.lesson).toBe('foo');
        });

        it('should call toastr on error', inject(function(){
            spyOn(toastr,'error');
            errorResult = {};
            loadController();
            expect(toastr.error).toHaveBeenCalled();
        }));


    });

});
