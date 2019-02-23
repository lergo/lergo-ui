(function () {
    'use strict';

    angular.module('lergoApp')
        .factory('RequestProgressInterceptor', function ($q, $rootScope) {
            // register the interceptor as a service
            $rootScope.pageRequestProgress = { 'inProgress': true, 'success': false, 'error': false };

            function endRequest(hasError) {
                $rootScope.pageRequestProgress.inProgress = false;
                $rootScope.pageRequestProgress.error = hasError;
                $rootScope.pageRequestProgress.success = !hasError;
            }

            return {
                // optional method
                'request': function (config) {
                    $rootScope.pageRequestProgress.inProgress = true;
                    $rootScope.pageRequestProgress.config = config;
                    // do something on success
    //                endRequest(false);
                    return config || $q.when(config);
                },

                // optional method
                'requestError': function (rejection) {
                    $rootScope.pageRequestProgress.rejection = rejection;

                    // do something on error
                    endRequest(true);

                    return $q.reject(rejection);
                },


                // optional method
                'response': function (response) {
    //                $rootScope.pageRequestProgress.response = response;

                    // do something on success
                    endRequest(false);

                    return response || $q.when(response);
                },

                // optional method
                'responseError': function (rejection) {
                    $rootScope.pageRequestProgress.rejection = rejection;

                    endRequest(true);

                    // do something on error
                    return $q.reject(rejection);
                }
            };
        });
})();

