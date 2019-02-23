module.exports = function (config) {

    var configuration = {
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        files: [

            'app/node_modules/jquery/jquery.js',
            'app/node_modules/lodash/lodash.js',
            'app/node_modules/angular/angular.js',
            'app/node_modules/string-format-js/format.js',
            'app/node_modules/angular-mocks/angular-mocks.js',
            'app/node_modules/angular-route/angular-route.js',
            'app/node_modules/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/node_modules/angular-ui-utils/modules/event/event.js',
            'app/node_modules/angular-ui-utils/modules/format/format.js',
            'app/node_modules/angular-ui-utils/modules/highlight/highlight.js',
            'app/node_modules/angular-ui-utils/modules/include/include.js',
            'app/node_modules/angular-ui-utils/modules/indeterminate/indeterminate.js',
            'app/node_modules/angular-ui-utils/modules/inflector/inflector.js',
            'app/node_modules/angular-ui-utils/modules/jq/jq.js',
            'app/node_modules/angular-markdown-directive/markdown.js',
            'app/node_modules/angular-sanitize/angular-sanitize.js',
            'app/node_modules/angular-local-storage/dist/angular-local-storage.js',
            'app/node_modules/google-code-prettify/src/prettify.js',
            'app/node_modules/checklist-model/checklist-model.js',
            'app/node_modules/angular-translate/dist/angular-translate.min.js',
            'app/node_modules/angular-translate-loader-url/angular-translate-loader-url.min.js',
            'app/node_modules/ngstorage/ngStorage.min.js',
            'app/node_modules/ng-csv/build/ng-csv.min.js',
            'app/node_modules/ng-focus-if/focusIf.js',
            'app/node_modules/angular-busy/angular-busy.js', 
            'app/scripts/app.js',
            'app/*/*.js',
            'app/*/*/*.js',
            '.tmp/html2js/*.js',
            'app/scripts/**/*.js',
            'test/resources/index.js',
            'test/resources/modules/**/*.js',
            'test/globals/**/*.js',
            'test/spec/**/*.js'
        ],
        port: 8080,
        basePath: '',
        preprocessors: {
            'app/scripts/*/*.js': ['coverage']
        },
        exclude: [],
        reporters: ['failed', 'coverage'],
        runnerPort: 9100,
        colors: true,
        logLevel: 'info',
        autoWatch: true,
        captureTimeout: 210000,
        browserDisconnectTolerance: 3,
        browserDisconnectTimeout : 210000,
        browserNoActivityTimeout : 210000,
        singleRun: false,
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
            subdir: function (browser) {
                var result = browser.toLowerCase().split(/[ /-]/)[0];
                console.log('this is browser', result);
                return result;
            }
        }
    };


    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];

    }

    config.set(configuration);

};
