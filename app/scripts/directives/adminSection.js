'use strict';

angular.module('lergoApp')
    .directive('adminSection', function ($parse, LergoClient, $q) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                element.hide(); // lets first hide everything... better hidden than not..

                $q.all([LergoClient.isLoggedIn(true), LergoClient.users.getUserPermissions()]).then(function (results) {

                    var user = results[0].data.user;
                    var permissions = results[1];

                    if ( user ) {
                        if (user.isAdmin) {
                            element.show();
                        } else {
                            var expression = $parse(attrs.adminSection);
                            if (expression(permissions)) {
                                element.show();
                            }
                        }
                    }
                });
            }
        };
    });
