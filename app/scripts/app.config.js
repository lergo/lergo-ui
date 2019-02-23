(function () {
    'use strict';
    angular.module('lergoApp').config(['$httpProvider', '$logProvider', '$translateProvider',
        function ($httpProvider, $logProvider, $translateProvider) {


            $logProvider.debugEnabled(false);

            try {
                if (window.location.hostname === 'localhost') {
                    $logProvider.debugEnabled(true);
                }
            } catch (e) {
            }

            try {
                if (window.location.origin.indexOf('localhost') > 0) {
                    $logProvider.debugEnabled(true);
                }
            } catch (e) {
            }

            $translateProvider.useUrlLoader('/backend/system/translations/angular-translate.json');
            $translateProvider.preferredLanguage('en');
            $translateProvider.fallbackLanguage(['en']);
            $translateProvider.useMissingTranslationHandler('missingTranslationFactory');
            $translateProvider.useSanitizeValueStrategy('escape');


            // $httpProvider.responseInterceptors.push(interceptor);
            $httpProvider.interceptors.push('RequestProgressInterceptor');
            $httpProvider.interceptors.push('RequestErrorInterceptor');

        }]);
})();
