'use strict';

angular.module('lergoApp')
  .directive('baseLayout', function () {
    return {
      templateUrl: '/views/baseLayout.html',
      transclude:true,
      restrict: 'C',
      link: function postLink(scope, element /*, attrs*/ ) {

      }
    };
  });
