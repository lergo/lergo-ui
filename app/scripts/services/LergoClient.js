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

        this.createLesson = function( lesson ){
            return $http.post('/backend/user/lessons', lesson) ;
        };
        this.getLessons = function(){
            return $http.get('/backend/user/lessons') ;
        };
        this.deleteLesson = function(id){
            return $http.post('/backend/user/lessons/'+id+'/delete') ;
        };
        
       
    }
);
