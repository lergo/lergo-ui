// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/bower_components/jquery/jquery.js',
  'app/bower_components/lodash/dist/lodash.js',
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
  'app/scripts/*.js',
  '.tmp/html2js/*.js',
  'app/scripts/**/*.js',
  'test/mock/**/*.js',
  'test/spec/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

//preprocessors = {
//    'app/views/directives/*.html': ['ng-html2js']
//};

//ngHtml2JsPreprocessor =  {
//    // If your build process changes the path to your templates,
//    // use stripPrefix and prependPrefix to adjust it.
//    stripPrefix: "app/",
////        prependPrefix: "web/path/to/templates/",
//
//        // the name of the Angular module to create
//        moduleName: "directive-templates"
//};

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 15000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
