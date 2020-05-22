'use strict';

describe('Controller: SignupCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var doSuccess = true;

    var SignupCtrl,
        LergoClient,
        $location,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope ) {
        scope = $rootScope.$new();
        doSuccess = true;
        $location = {
            'path' : function(){

            }
        };
        LergoClient = {
            'signup' : function(){
                return {
                    'then' : function(success, error){
                        if ( doSuccess ){
                            success();
                        }else{
                            error( { 'data': { 'message' : 'this is an error'} });
                        }
                    }
                };
            }
        };
        SignupCtrl = $controller('SignupCtrl', {
            $scope: scope,
            LergoClient: LergoClient,
            $location: $location
        });

        scope.signupForm = {
            'username' : 'foo',
            'email' : 'bar',
            'password' : 'a',
            'passwordConfirm' : 'a'
        };
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(typeof(scope.submit)).toBe('function');
    });

    describe('submit', function(){

        beforeEach(function(){
            scope.signupForm = {
                $valid : true,
                email : {},
                name : {},
                emailConfirm: {},
                password: {},
                passwordConfirm : {},
                username : {},
                gpdrOptIn : {}
            } ;
        });

        it('should call lergo signup', function(){

            spyOn(LergoClient,'signup').andReturn({ 'then' : function(){} });
            scope.submit();
            expect(LergoClient.signup).toHaveBeenCalled();
        });

        it('should redirect on success', function(){
            spyOn($location,'path');
            scope.submit();
            expect($location.path).toHaveBeenCalled();
        });

        it('should assign an error message on error', function(){
            doSuccess = false;
            scope.submit();
            expect(scope.errorMessage).toBe('this is an error');
        });
    });
});
