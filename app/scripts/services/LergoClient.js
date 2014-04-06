'use strict';

angular.module('lergoApp')
    .service('LergoClient', function LergoClient( $http, $log ) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        $log.info('initializing');
        this.signup = function( signupForm ){
            return $http.post('/backend/users/signup', signupForm);
        };

        this.isLoggedIn = function(){
            return $http.get('/backend/user/loggedin');
        };

        this.logout = function( ){
            return $http.post('backend/users/logout');
        };

        this.login = function( loginCredentials ){
            return $http.post('/backend/users/login', loginCredentials) ;
        };

    }
);
