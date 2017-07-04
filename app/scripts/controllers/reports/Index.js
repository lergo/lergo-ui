'use strict';

angular.module('lergoApp').controller('ReportsIndexCtrl',
    function ($scope, LergoClient, TagsService, $routeParams, $log, LergoTranslate, $location, $rootScope,
              localStorageService, $window, $filter) {

        $scope.reportsFilter = {};
        $scope.filterPage = {};
        $scope.reportsFilterOpts = {
            'showSubject': true,
            'showLanguage': true,
            'showReportStatus': true,
            'showStudents': true,
            'showClass': true,
            'showCorrectPercentage': true,
            'showReportLesson': true
        };

        $scope.getReportName = function (report) {
            return ( report && report.data && report.data.lesson && report.data.lesson.name && report.data.lesson.name.trim().length > 0) ? report.data.lesson.name : '[no name]';
        };

        $scope.reportTypes = [{
            'id': 'mine'
        }, {
            'id': 'students'
        }, {
            'id': 'class'
        }];

        $scope.reportsPage = {
            reportType: 'students',
            selectAll: false
        };

        function isMyReports() {
            return $scope.reportsPage.reportType === 'mine';
        }

        $scope.$watch('reportsPage.reportType', function (newValue/* , oldValue */) {
            $log.info('reportType changed');
            $scope.reportsFilterOpts.showStudents = isStudentsReports();
            $scope.reportsFilterOpts.showClass = isStudentsReports() || isClassReports();
            $scope.reportsFilterOpts.showReportStatus = isStudentsReports() || isMyReports();
            $scope.filterPage.current = 1;
            $scope.filterPage.updatedLast = new Date().getTime(); // create a
            // 'change'
            // event
            // artificially..
            localStorageService.set('reportType', newValue);
            $location.search('reportType', newValue);

        });

        var reportType = $routeParams.reportType || localStorageService.get('reportType');
        if (!!reportType) {
            $scope.reportsPage.reportType = reportType;
        }

        function isStudentsReports() {
            return $scope.reportsPage.reportType === 'students';
        }

        function isClassReports() {
            return $scope.reportsPage.reportType === 'class';
        }

        $scope.showStudentColumn = function () {
            return isStudentsReports();
        };

        $scope.showStudentCountColumn = function () {
            return isClassReports();
        };

        $scope.showClassColumn = function () {
            return isClassReports() || isStudentsReports();
        };

        $scope.getReportLink = function (reportId) {
            if (isClassReports()) {
                return '#!/public/lessons/reports/agg/' + reportId + '/display';
            }
            return '#!/public/lessons/reports/' + reportId + '/display';
        };


        $scope.isCompleted = function (report) {
            if (isClassReports()) {
                return true;
            }
            return LergoClient.reports.isCompleted(report);

        };

        $scope.loadReports = function () {

            $scope.reportsPage.selectAll = false;

            $log.info('loading reports', $scope.reportsFilter);

            if (!$scope.filterPage.current) {
                return;
            }

            var queryObj = {
                'filter': _.merge({}, $scope.reportsFilter),
                'projection': {'data.quizItems': 0},
                'sort': {
                    'lastUpdate': -1
                },
                'dollar_page': $scope.filterPage
            };
            var promise = null;
            if (isMyReports()) {
                promise = LergoClient.userData.getReports(queryObj);
            } else if (isStudentsReports()) {
                promise = LergoClient.userData.getStudentsReports(queryObj);
            } else if (isClassReports()) {
                promise = LergoClient.userData.getClassReports(queryObj);
            }

            promise.then(function (result) {
                $scope.reports = result.data.data;
                $scope.filterPage.count = result.data.count;
                $scope.errorMessage = null;
            }, function (result) {
                $scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
                $log.error($scope.errorMessage);
            });
            scrollToPersistPosition();
        };
        $scope.createLessonFromWrongQuestions = function () {
            LergoClient.lessons.create().then(function (result) {
                var lesson = result.data;
                lesson.name = $filter('translate')('lesson.practice.title');
                // todo: is this wrong?? shouldn't we take it from the lesson?
                lesson.language = LergoTranslate.getLanguageObject().name;
                lesson.steps = [];
                lesson.description = '';
                lesson.lastUpdate = new Date().getTime();
                var step = {
                    'type': 'quiz',
                    'quizItems': [],
                    'retBefCrctAns': 1,
                    'title': $filter('translate')('lesson.practice.step.title')
                };
                lesson.steps.push(step);
                angular.forEach($scope.reports, function (report) {
                    if (report.selected === true) {
                        lesson.name = lesson.name + report.data.lesson.name + ',';
                        lesson.description = lesson.description + report.data.lesson.name + '\n';
                        getWrongQuestions(report.answers, lesson);
                    }
                });
                lesson.name = lesson.name.slice(0, -1);
                LergoClient.lessons.update(lesson).then(function () {
                    $location.path('/user/lessons/' + lesson._id + '/intro');
                });
            });

        };

        $scope.selectAll = function (event) {
            var checkbox = event.target;
            angular.forEach($scope.reports, function (item) {
                item.selected = checkbox.checked;
            });
        };

        function getWrongQuestions(answers, lesson) {
            angular.forEach(answers, function (answer) {
                if (!answer.checkAnswer.correct) {
                    if (lesson.steps[0].quizItems.indexOf(answer.quizItemId) === -1) {
                        lesson.steps[0].quizItems.push(answer.quizItemId);
                    }
                }
            });
        }

        $scope.deleteReports = function () {
            var toDelete = 0;
            if (confirm($filter('translate')('deleteReports.Confirm'))) {
                angular.forEach($scope.reports, function (report) {
                    if (report.selected === true) {
                        toDelete++;
                        LergoClient.reports.deleteReport(report).then(function () {
                            toDelete--;
                            $scope.errorMessage = null;
                            $scope.reports.splice($scope.reports.indexOf(report), 1);
                            $log.info('report deleted successfully');
                            if (toDelete === 0) {
                                $scope.loadReports();
                            }
                        }, function (result) {
                            $scope.errorMessage = 'Error in deleting report : ' + result.data.message;
                            $log.error($scope.errorMessage);
                        });
                    }
                });
            }
        };

        var path = $location.path();
        $scope.$on('$locationChangeStart', function () {
            persistScroll($scope.filterPage.current);
        });

        $scope.$watch('filterPage.current', function (newValue, oldValue) {
            if (!!oldValue) {

                persistScroll(oldValue);
            }
        });
        function persistScroll(pageNumber) {
            if (!$rootScope.scrollPosition) {
                $rootScope.scrollPosition = {};
            }
            $rootScope.scrollPosition[path + ':page:' + pageNumber] = $window.scrollY;
        }

        function scrollToPersistPosition() {
            var scrollY = 0;
            if (!!$rootScope.scrollPosition) {
                scrollY = $rootScope.scrollPosition[path + ':page:' + $scope.filterPage.current] || 0;
            }
            $window.scrollTo(0, scrollY);
        }

    });
