'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:admin/ManageUsersIndexCtrl
 * @description
 * # admin/ManageUsersIndexCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersIndexCtrl', function($scope, FilterService, LergoClient, $log) {

        $scope.adminFilter = {};
        $scope.filterPage = {};

        $scope.adminFilterOpts = {
            'showSearchText' : true,
            'showGroups' : true
        };


        $scope.loadUsers = function() {
            var queryObj = {
                'filter' : _.merge({}, $scope.adminFilter),
                'sort' : {
                    'lastUpdate' : -1
                },
                'dollar_page' : $scope.filterPage
            };
            $log.debug('loading users');
            LergoClient.users.getAll(queryObj).then(function(result) {
                $scope.users = result.data.data;
                $scope.totalUsers = result.data.count;
                $scope.filterPage.count = result.data.count; // the number of
                // lessons found
                // after filtering
                // them.
            });
        };


    });
