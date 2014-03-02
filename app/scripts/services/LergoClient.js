'use strict';

angular.module('lergoApp')
    .service('LergoClient', function LergoClient( $http, $log ) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.signup = function( signupForm ){
            $http.post('/backend/users/signup', signupForm).then( function(){ $log.info('got result from server'); }, function(){ $log.error('got error from server ')})
        }

    }
);
