'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var isLoggedIn = false;
    var resendSuccess = true;
    var LoginCtrl,
        $location,
        LergoClient,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LergoClient =  {
            'isLoggedIn': function(){
                return { 'then' : function( success , error ){
                    if ( isLoggedIn ){
                        success();
                    }else{
                        error();
                    }
                }};
            },
            'resendValidationEmail' : function(){
                return { 'then' : function(success, error){
                    if ( resendSuccess ){
                        success();
                    }else{
                        error();
                    }
                }};
            }
        };
        spyOn(LergoClient,'isLoggedIn').andCallThrough();
        $location = {
            path: function(){
                return '/public/session/login';
            }
        };
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            LergoClient: LergoClient,
            $location: $location
        });
    }));

    it('assigns login function on scope', function () {
        expect(typeof(scope.login)).toBe('function');
    });

    it('should check if user already logged in on load', function(){
        expect(LergoClient.isLoggedIn).toHaveBeenCalled();
        expect(scope.showLoginPage).toBe(true);
    });

    describe('login', function(){
        var loginSuccess = true;
        beforeEach(function(  ){
            LergoClient.login = function(){
                return {
                    'then' : function( success, error ){
                        if ( loginSuccess ){
                            success( { 'data' : 'this is user' } );
                        }else{
                            error();
                        }
                    }
                };

            };
            spyOn(LergoClient,'login').andCallThrough();

        });

        it('should set user on scope if login success',function(  ){
            spyOn($location,'path').andReturn('foo');
            scope.login();
            expect(scope.user).toBe('this is user');
            expect($location.path).toHaveBeenCalledWith('/user/homepage');
        });

    });

    describe('resendValidationEmail', function(){
        it('should resendValidationEmail', function(){
            spyOn(LergoClient,'resendValidationEmail').andCallThrough();
            scope.clearError = function(){}; // usually added by interceptor
            scope.resendValidationEmail();
            expect(scope.validationEmailSentSuccess).toBe(true);
        });
    });


});
