'use strict';

angular.module('lergoApp')
  .directive('lergoProgressBar', function ($log) {
    return {
      template: '<div class="lergo-progress-bar"><div class="lergo-progress-bar-inner progress-bar-success" style="width:0;">&nbsp;{{progress}}%</div></div>',
      restrict: 'A',
      scope:{
        value : '='
      },
      link: function postLink(scope, element, attrs) {

          var maxValue = attrs.maxValue || 100;
          var minValue = attrs.minValue || 0;



          scope.$watch( 'value', function(newValue, oldValue){

              $log.info('value has changed', newValue, oldValue );
              if ( !!newValue ) {
                  newValue = Math.min(newValue, maxValue);
                  newValue = Math.max(newValue, minValue);

                  scope.progress = +(100 * newValue/ (maxValue-minValue)).toFixed(2);
                  if ( newValue !== oldValue ) {
                      $(element).find('.lergo-progress-bar-inner').animate({'width': scope.progress + '%'},600,'linear');
                  }else{
                      $(element).find('.lergo-progress-bar-inner').css({'width': scope.progress + '%'});
                  }
              }else{
                  $(element).find('.lergo-progress-bar-inner').css({'width': '0'});
              }
          });


      }
    };
  });
