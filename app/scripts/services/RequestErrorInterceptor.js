(function () {
    'use strict';

    angular.module('lergoApp')
        .factory('RequestErrorInterceptor', function ($rootScope, $q, $location) {

            var scope = $rootScope;

            return {
                'responseError': function (response) {

                    var status = response.status;

                    if (status === 500) {

                        if (typeof (response.data) === 'string' && response.data.indexOf('ECONNREFUSED') > 0) {
                            scope.errorMessage = 'no connection to server';
                            scope.pageError = {
                                'code': -1,
                                'key': 'no.connection.to.server',
                                'message': 'no connection to server'
                            };
                        } else {
                            try {
                                scope.errorMessage = response.data.message;
                                scope.pageError = response.data;
                            } catch (e) {
                                scope.errorMessage = 'unknown error';
                                scope.pageError = {
                                    'code': -2,
                                    'key': 'unknown.error',
                                    'message': 'unknown error'
                                };
                            }
                        }

                        scope.clearError = function () {
                            scope.errorMessage = null;
                            scope.pageError = null;
                        };

                    }

                    if (status === 401 && $location.path().indexOf('/public') !== 0) {
                        $location.path('/public/session/login');
                        return;
                    }

                    if (!!response.message) {
                        scope.pageError = response.message;
                    }
                    // otherwise
                    return $q.reject(response);

                }

            };

        });
})();
