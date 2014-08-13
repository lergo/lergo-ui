'use strict';

angular.module('lergoApp')
  .controller('DisqusPageCtrl', function ($scope, $routeParams, $rootScope) {
        $rootScope.page = { title : $routeParams.disqus_title };
        $scope.disqus = _.pick( $routeParams, ['disqus_shortname', 'disqus_identifier','disqus_title','disqus_url', 'disqus_catgory_id', 'disqus_disable_mobile']);
  });
