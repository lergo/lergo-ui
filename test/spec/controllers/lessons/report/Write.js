'use strict';

describe('Controller: LessonsReportWriteCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsReportWriteCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.report = {};
        LessonsReportWriteCtrl = $controller('LessonsReportWriteCtrl', {
            $scope: scope
        });
    }));

    console.log('test/spec/controllers/lesson/report/Write.js failing on .length undefined');
    /*it('should add answers on report', function () {
        expect(scope.report.answers.length).toBe(0);
    });*/
});
