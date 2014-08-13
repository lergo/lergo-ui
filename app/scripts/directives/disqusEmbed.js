'use strict';

/**
 * This directive constructs the iframe code for the disqus location.
 * if we are looking at a lesson - we will use the lesson's title and _id to talk to disqus.
 * Other models will have other properties in the future.
 */

angular.module('lergoApp')
  .directive('disqusEmbed', function ( $log ) {
    return {
      template: '<div></div>',
      restrict: 'A',
        scope:{
            'lesson' :'='
        },
      link: function postLink(scope, element, attrs) {
          element = $(element);
          // resizing iframe
          function resizeIframe(){
              var myIframe = element.find('iframe');
              if ( myIframe.length > 0 ){
                  try {
                      myIframe.height(myIframe[0].contentWindow.document.body.scrollHeight );
                  }catch(e){}
                  setTimeout(resizeIframe,1000);
              }

          }
          // convert object to query string. as suggested by:
          // https://gist.github.com/jonmaim/4239779

          var qs = function(obj, prefix){

              function encodeMe( value ){
                  if ( value.indexOf('http://') === 0 || value.indexOf('https://') === 0){
                      return encodeURI(value);
                  }
                  return encodeURIComponent(value);
              }

              var str = [];
              for (var p in obj) {
                  if (obj.hasOwnProperty(p)) {
                      var k = prefix ? prefix + "[" + p + "]" : p,
                          v = obj[k];
                      str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeMe(v));
                  }
              }
              return str.join("&");
          };


          function constructIframeForLesson( lesson ){
              $log.info('constructing iframe for lesson');
              if ( !!lesson ){
                  element.empty();

                  var queryObject = {
                      'disqus_title' : lesson.name,
                      'disqus_url' : window.location.origin + '/backend/disqus/redirect/' + lesson._id,
                      'disqus_shortname' : conf.disqus.shortname

                  };

                  // add category if exists
                  if ( !!conf && !!conf.disqus && !!conf.disqus.lessonsCateogry ){
                      queryObject.disqus_category_id = conf.disqus.lessonsCategory;
                  }

                  window.title = window.disqus_title;

                  var $iframe = $("<iframe></iframe>",{
                     'src' : '/index.html#/disqus/' + lesson._id + '?' + qs(queryObject),
                      'width' : '100%',
                      'frameBorder' : '0',
                      'scrolling' : 'no'

                  });

                  element.append($iframe);
                  resizeIframe();
              }
          }

          scope.$watch('lesson', constructIframeForLesson);




      }
    };
  });
