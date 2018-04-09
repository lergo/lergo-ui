'use strict';

angular.module('lergoApp', [
    'LocalStorageModule',
    'pascalprecht.translate',
    'checklist-model',
    'ngRoute',
    'ui.bootstrap',
    'ui.utils',
    'btford.markdown',
    'ngStorage',
    'ngCsv',
    'cgBusy',
    'focus-if'
]);


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

// guy - this is a temporary fix for angular-bootstrap
// https://github.com/angular-ui/bootstrap/issues/2828
angular.module('lergoApp').directive('tooltip', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            attrs.tooltipTrigger = attrs.tooltipTrigger;
            attrs.tooltipPlacement = attrs.tooltipPlacement || 'top';
        }
    };
});
angular.module('lergoApp').run(function (Facebook) {
    if ( typeof(conf) !== 'undefined' ) {
        Facebook.init(conf.facebookAppId);
    }else{
        window.location='/error.html';
        throw new Error('service is down');
    }
});


angular.module('lergoApp').value('cgBusyDefaults', {
    message: 'busy.message',
    templateUrl: 'views/busy/template.html'
});

