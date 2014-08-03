'use strict';

describe('Controller: LessonsindexCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsindexCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LessonsindexCtrl = $controller('LessonsIndexCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(typeof(scope.getAll)).toBe('function');
    });
});
