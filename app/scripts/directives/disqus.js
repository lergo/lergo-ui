'use strict';

angular.module('lergoApp')
  .directive('disqus', function ( DisqusService, $log ) {
    return {
      template: '<div></div>',
      restrict: 'A',
        scope: {
            'disqus' : '='
        },
      link: function postLink(scope, element, attrs) {


          // this scope assumes that disqus will load once on the page.
          // it is good to use within an iframe.

          // perhaps we will support reload in the future. not main concern at the moment.



        DisqusService.login().then(function( userDetails ) {

                // follow this documentation to know all about configuration variables
                // https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables

                // these are the authentication variables
                // as documented at: https://help.disqus.com/customer/portal/articles/236206-integrating-single-sign-on

                var disqusDetails = _.merge( {'disqus_shortname' : conf.disqusShortname},scope.disqus, {

                    page: {
                        remote_auth_s3: userDetails.auth,
                        api_key: userDetails.pubKey
                    }
                });

                $log.info('diqusDetails', JSON.stringify(disqusDetails));
                window.disqus_config = function() {
                    if (!this.page) {
                        this.page = {};
                    }
                    _.merge(this, disqusDetails);
                };

                _.merge(window, disqusDetails);




                debugger;


                var $script = $('<script></script>',
                    {
                        'type': 'text/javascript',
                        'async': true,
                        'src': 'scripts/disqus.js'
//                        'src': '//' + window.disqus_shortname + '.disqus.com/embed.js'
                    }
                );


                $('body').append($script);

                $log.info($script);





        });
      }
    };
  });
