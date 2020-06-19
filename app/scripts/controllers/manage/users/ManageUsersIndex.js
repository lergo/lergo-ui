'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:admin/ManageUsersIndexCtrl
 * @description
 * # admin/ManageUsersIndexCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersIndexCtrl', function($scope, LergoClient, $log, $translate) {


        $scope.adminFilter = {};
        $scope.filterPage = {};

        $scope.adminFilterOpts = {
            'showSearchText' : true,
            'showRoles' : true
        };


        $scope.loadUsers = function() {
            var queryObj = {
                'filter' : _.merge({}, $scope.adminFilter),
                'sort' : {
                    '_id' : -1
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

        var getDateNow = function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var min = today.getMinutes();
            if(dd<10) {
                dd='0'+dd;
            }
            if(mm<10) {
                mm='0'+mm;
            }
            if(hh<10) {
                hh='0'+hh;
            }
            if(min<10) {
                min='0'+min;
            }
            var name = 'latestUsers-'+dd+'-'+mm+'-'+yyyy+'-'+hh+':'+min+'.csv';
            return name;
        };

        $scope.usermodel = {};
        $scope.usermodel.days = '30';
        $scope.localizedHeaders = function () {
            return _.map($scope.headers, $translate.instant);
        };
        $scope.getUsersFromSignUpDate = function() {
            if ($scope.usermodel.days > 99) {
                $scope.usermodel.days = 30;
            }
            $log.debug('gettingUsersFromSignUpDate');
            LergoClient.users.getDate($scope.usermodel.days).then(function(result) {
                
                $scope.limitedUsers = result.data.data;
                for (var i = 0; i < $scope.limitedUsers.length; i++) {
                    if (!$scope.limitedUsers[i].validated || $scope.limitedUsers[i].validated !== true) {
                        $scope.limitedUsers[i].validated = false;
                    }
                    $scope.limitedUsers[i].signupDate = $scope.getUserSignUpDateForDownload($scope.limitedUsers[i]);
                    delete $scope.limitedUsers[i]._id;  //remove the _id field
                }
                $scope.totalLimitedUsers = result.data.count;
                $scope.usermodel.name = getDateNow();
            });
        };
    
        $scope.getUserSignUpDateForDownload = function (user) {
            var signupDate = new Date(parseInt(user._id.substring(0, 8), 16) * 1000);
            return signupDate.toISOString().substring(0,10);
        };
        $scope.getUserSignUpDate = function (user) {
            return new Date(parseInt(user._id.substring(0, 8), 16) * 1000);
        };
    });
