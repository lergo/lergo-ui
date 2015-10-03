// Generated on 2013-10-19 using generator-angular 0.3.0
'use strict';
var LIVERELOAD_PORT = 34729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var path = require('path');
var logger = require('log4js').getLogger('Gruntfile');

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }




    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            jshint: {
                files: [ '<%= yeoman.app %>/**/*.js' ]
            },
            develop: {
                files: ['app/**/*.js', 'test/**/*.js'],
                tasks: ['concurrent:develop']
            },
            karma: {
                files: ['test/**/*.js'],
                tasks: ['karma:unit']
            }
        },
        s3:{
            uploadCoverage: {
                options: {
                    accessKeyId: '<%=s3Config.accessKey%>',
                    secretAccessKey: '<%=s3Config.secretAccessKey%>',
                    bucket: '<%=s3Config.bucket%>',
                    cacheTTL: 0,
                    sslEnabled: false,
                    enableWeb:true,
                    gzip:true
                },
                cwd: 'coverage/',
                src: '**',
                dest: 'ui-coverage/'

            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            proxies: [
                {
                    context: '/backend',
                    host: 'localhost',
                    port: 3000,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            proxySnippet,


                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port:9001,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            main: {
                options: {
                    jshintrc: '.jshintrc'
                },

                files:  {
                    'src':[
                        'Gruntfile.js',
                        '<%= yeoman.app %>/scripts/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    jshintrc: 'test.jshintrc'
                },
                files:  {
                    'src':[
                        'test/**/*.js'
                    ]
                }
            }

        },
        sass: {
            server: {
                files: {
                    '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
                }
            },
            dist: {
                files: {
                    '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
                }
            }
        },
        //compass: {
        //    options: {
        //        sassDir: '<%= yeoman.app %>/styles',
        //        cssDir: '.tmp/styles',
        //        generatedImagesDir: '.tmp/images/generated',
        //        imagesDir: '<%= yeoman.app %>/images',
        //        javascriptsDir: '<%= yeoman.app %>/scripts',
        //        fontsDir: '<%= yeoman.app %>/styles/fonts',
        //        importPath: '<%= yeoman.app %>/bower_components',
        //        httpImagesPath: '/images',
        //        httpGeneratedImagesPath: '/images/generated',
        //        httpFontsPath: '/styles/fonts',
        //        relativeAssets: false
        //    },
        //    dist: {},
        //    server: {
        //        options: {
        //            debugInfo: true
        //        }
        //    }
        //},
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
         dist: {}
         },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
//        imagemin: {
//            dist: {
//                files: [
//                    {
//                        expand: true,
//                        cwd: '<%= yeoman.app %>/images',
//                        src: '{,*/}*.{png,jpg,jpeg}',
//                        dest: '<%= yeoman.dist %>/images'
//                    }
//                ]
//            }
//        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            // dist: {
            //   files: {
            //     '<%= yeoman.dist %>/styles/main.css': [
            //       '.tmp/styles/{,*/}*.css',
            //       '<%= yeoman.app %>/styles/{,*/}*.css'
            //     ]
            //   }
            // }
        },
        html2js: {
            options: {
                // custom options, see below
            },
            main: {
                src: ['app/views/**/*.html','app/views/*.html'],
                dest: '.tmp/html2js/directives.js',
                module: 'directives-templates',
                options: {
                    rename: function (moduleName) {
                        var indexOf = moduleName.indexOf('views');
                        return moduleName.substring(indexOf);
                    }
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'bower_components/**/*',
                            'translations/**/*',
                            'images/{,*/}*.{gif,webp,svg,png,jpg,jpeg}',
                            'emailResources/**/*',
                            'styles/fonts/*',
                            'audio/{,*/}*.mp3'
                        ]
                    },
                    {
                        expand: true,
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'package.json'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }
                ]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            develop: [
//                'jsdoc',
                'jshint',
                'karma:develop'
            ],
            watch:[
                'watch:compass',
                'watch:jshint',
                'watch:livereload'
            ],
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'htmlmin'
            ]
        },
        karma: {
            develop: {
                configFile: 'karma.conf.js',
                singleRun:true,
                port:9001,
                browsers: ['PhantomJS'],
                reporters: ['failed']

            },
            unit: {
                configFile: 'karma.conf.js',
                singleRun:true,
                port:9001,
                browsers: ['PhantomJS']


            },
            debug:{
                configFile: 'karma.conf.js',
                singleRun:false,
                reporters: ['failed'],
                port:9001
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/scripts',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>/scripts'
                    }
                ]
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('readS3Credentials', function(){
        try {
            var s3path = process.env.LERGO_S3 || path.resolve('./dev/s3.json');
            logger.info('looking for s3.json at ' , s3path );
            grunt.config.set('s3Config', require( s3path ));
        }catch(e){
            logger.error('s3 json is undefined, you will not be able to upload to s3',e);
        }
    });

    grunt.registerTask('uploadStatus', [
        'readS3Credentials',
        's3'
    ]);

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'configureProxies',
            'connect:livereload',
            'open',
            'concurrent:watch'

        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'html2js',
        'concurrent:test',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'copy',
        'cdnify',
        'ngmin',
        'cssmin',
        'uglify',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('compass',['sass']);




    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
