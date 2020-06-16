'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:admin/ManageUsersIndexCtrl
 * @description
 * # admin/ManageUsersIndexCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ManageUsersIndexCtrl', function($scope, LergoClient, $log) {


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
            console.log('queryObj.filter: ', queryObj.filter);
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
        $scope.days = '30';
        $scope.localizedHeaders = function () {
            return _.map($scope.headers, $translate.instant);
        };
        var userData = null;
        $scope.getUsersFromSignUpDate = function(days) {
            // if (days > 99) {
            //     days = 99
            // }
            $log.debug('gettingUsersFromSignUpDate');
            LergoClient.users.getDate(days).then(function(result) {
                $scope.limitedUsers = result.data.data;
                console.log('..............', $scope.limitedUsers);
                userData = $scope.limitedUsers;
                $scope.totalLimitedUsers = result.data.count;
                //ng-csv
                // var headers = $scope.localizedHeaders();
                
            });
        };
        $scope.getUserData = function() {
            return userData;
        }

        // $scope.getReports = function () {
            
        //     var headers = $scope.localizedHeaders();
    
        //         var data = _.map($scope.limitedUsers, function (item) {
        //             console.log('item is ', item);
        //             var report = {};
        //             report[headers[0]] = item.data.lesson.name;
        //             report[headers[1]] = item.data.invitee.name;
        //             report[headers[2]] = item.data.invitee.class;
        //             report[headers[3]] = $translate.instant('filters.subjects.'+item.data.lesson.subject);
        //             report[headers[4]] = $filter('date')(item.lastUpdate, 'medium');
        //             report[headers[5]] = item.correctPercentage;
        //             if (item.duration !== 0) {
        //                 report[headers[6]] = $filter('duration')(item.duration);
        //             } else {
        //                 report[headers[6]] = $translate.instant('report.incomplete');
        //             }
        //             return report;
        //         }
               
        // };

       

        $scope.getUserSignUpDate = function (user) {
            return new Date(parseInt(user._id.substring(0, 8), 16) * 1000);
        };


    });
