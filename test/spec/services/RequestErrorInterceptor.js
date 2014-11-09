'use strict';

describe('Service: RequestErrorInterceptor', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mRequestErrorInterceptor;
    beforeEach(inject(function (RequestErrorInterceptor) {
        mRequestErrorInterceptor = RequestErrorInterceptor;


    }));

    it('should do something on responseError', function () {
        expect(!!mRequestErrorInterceptor).toBe(true);
        expect(!!mRequestErrorInterceptor.responseError).toBe(true);
    });

    it('should not do anything if we got 401 on route with prefix /public', inject(function($location){
        var pathWasInvoked = 0;

        $location.path = function(){
            pathWasInvoked++;
            return '/public';
        };

        mRequestErrorInterceptor.responseError({ status : 401 });

        expect(pathWasInvoked).toBe(1);
    }));

    it ('should change path if we got on 401 on route without prefix /public', inject(function($location){
        var pathWasInvoked = 0;
        var redirectUrl = null;

        $location.path = function( _redirectUrl ){
            pathWasInvoked++;
            redirectUrl = _redirectUrl;
            return '/private';
        };

        mRequestErrorInterceptor.responseError({ status : 401 });

        expect(pathWasInvoked).toBe(2);
        expect(redirectUrl).toBe('/public/session/login');
    }));

    it('should put errorMessage and pageError on $rootScope if we have an error', inject(function( $rootScope ){
        var data = { 'message' : 'this is an error' };
        mRequestErrorInterceptor.responseError({'status' : 500 , 'data' : data });

        expect($rootScope.errorMessage).toBe('this is an error');
        expect($rootScope.pageError).toBe(data);
    }));

    it('should detect if there is no connection to the server', inject(function($rootScope){
        mRequestErrorInterceptor.responseError({'status' : 500, 'data' : 'something ECONNREFUSED' });
        expect($rootScope.errorMessage).toBe('no connection to server');
        expect($rootScope.pageError.code).toBe(-1);
    }));

    it('should assign a clearError function on rootScope that clears errors', inject(function($rootScope){
        mRequestErrorInterceptor.responseError({'status' : 500, 'data' : 'something ECONNREFUSED' });
        expect($rootScope.errorMessage).toBe('no connection to server');
        expect(!!$rootScope.clearError).toBe(true);
        $rootScope.clearError();
        expect($rootScope.errorMessage).toBe(null);

    }));

});
