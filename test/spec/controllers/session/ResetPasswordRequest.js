'use strict';

describe('Controller: SessionResetPasswordRequestCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var SessionResetPasswordRequestCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        SessionResetPasswordRequestCtrl = $controller('SessionResetPasswordRequestCtrl', {
            $scope: scope
        });
    }));

    it('should attach submitForm function on scope', function () {
        expect(typeof(scope.submitForm)).toBe('function');
    });

    describe('submitForm', function(){
        it('should submitForm', inject(function( $httpBackend ){
            $httpBackend.expectPOST('/backend/users/requestPasswordReset').respond(200, { 'data' : {} });
            scope.submitForm();
            expect(scope.requestInProgress).toBe(true);
            $httpBackend.flush();
            expect(scope.requestError).toBe(false);

            $httpBackend.expectPOST('/backend/users/requestPasswordReset').respond(500, { 'data' : {} });
            scope.submitForm();
            $httpBackend.flush();
            expect(scope.requestError).toBe(true);
        }));
    });
});
