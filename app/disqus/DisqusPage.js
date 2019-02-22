(function(){
    'use strict';
    DisqusPageCtrl.$index = ['$scope', '$routeParams', '$rootScope']
    function DisqusPageCtrl($scope, $routeParams, $rootScope) {
        /*jshint camelcase: false */
        $rootScope.page = { title: $routeParams.disqus_title };
        $scope.disqus = _.pick($routeParams, ['disqus_shortname', 'disqus_identifier', 'disqus_title', 'disqus_url', 'disqus_catgory_id', 'disqus_disable_mobile']);
    }

    angular.module('lergoApp')
        .controller('DisqusPageCtrl',DisqusPageCtrl );
})();        
