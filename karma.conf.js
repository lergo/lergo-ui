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

            'app/bower_components/jquery/jquery.js',
            'app/bower_components/lodash/lodash.js',

            'app/bower_components/angular/angular.js',
            'app/bower_components/string-format-js/format.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower_components/angular-ui-utils/ui-utils.js',
            'app/bower_components/angular-markdown-directive/markdown.js',
            'app/bower_components/angular-sanitize/angular-sanitize.js',
            'app/bower_components/angular-local-storage/angular-local-storage.js',
            'app/bower_components/google-code-prettify/src/prettify.js',
            'app/bower_components/angular-adaptive-speech/angular-adaptive-speech.js',
            'app/bower_components/angular-gravatar/build/md5.js',
            'app/bower_components/angular-gravatar/build/angular-gravatar.js',
            'app/bower_components/angular-translate/angular-translate.js',
            'app/bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
            'app/scripts/*.js',
            '.tmp/html2js/*.js',
            'app/scripts/**/*.js',
            'test/resources/index.js',
            'test/resources/modules/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
        ],
        port: 8080,
        basePath: '',
        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },
        exclude: [],
        reporters: ['failed', 'coverage'],
        runnerPort: 9100,
        colors: true,
        logLevel: 'info',
        autoWatch: true,
        captureTimeout: 15000,
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
