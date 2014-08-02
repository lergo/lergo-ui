'use strict';

angular.module('lergoApp')
    .controller('LessonsInvitationsDisplayCtrl', function ($scope, LergoClient, $location, $routeParams, $log, $controller, ContinuousSave, $rootScope) {

        $log.info('loading invitation', $routeParams.invitationId);
        $controller('LessonsDisplayCtrl', {$scope: $scope});


        var updateChange = new ContinuousSave({
            'saveFn': function (value) {
                $log.info('updating report');
                return LergoClient.reports.update(value);
            }
        });


        function initializeReport( invitation ) {

            // broadcast start of lesson
            function initializeReportWriter( report ) {
                $scope.report = report;
                $scope.$watch('report', updateChange.onValueChange, true);
                $controller('LessonsReportWriteCtrl', {$scope: $scope});
                $rootScope.$broadcast('startLesson', invitation);
            }

            var reportId = $routeParams.reportId;
            if (!!reportId) {
                LergoClient.reports.getById(reportId).then(function (result) {

                    initializeReportWriter(result.data);
                });
            } else {
                LergoClient.reports.createFromInvitation(invitation).then(function (result) {
                    $location.search('reportId', result.data._id);
                    initializeReportWriter(result.data);
                });
            }
        }








        $scope.$watch(function () { // broadcast end of lesson if not next step
            return !!$scope.invitation && !$scope.hasNextStep();
        }, function (newValue/*, oldValue*/) {
            if (!!newValue) {
                $rootScope.$broadcast('endLesson');
                if (!$scope.invitation.anonymous) {
                    LergoClient.reports.ready($routeParams.reportId);
                } else {
                    $log.info('not sending report link because anonymous');
                }
            }
        });


        LergoClient.lessonsInvitations.build($routeParams.invitationId, true, false).then(function (result) {
            $scope.invitation = result.data;
            $scope.lesson = result.data.lesson;
            $scope.lesson.image = LergoClient.lessons.getTitleImage($scope.lesson);
            $scope.questions = {};


            initializeReport( $scope.invitation );
            var items = result.data.quizItems;
            if (!items) {
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                $scope.questions[ item._id ] = item;


            }
        }, function( result ){
            if ( result.status ){
                $location.path('/errors/notFound');
            }
        });

    });
