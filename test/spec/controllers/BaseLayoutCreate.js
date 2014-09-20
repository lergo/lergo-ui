'use strict';

describe('Controller: BaseLayoutCreateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var BaselayoutcreateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope ) {
        scope = $rootScope.$new();
        BaselayoutcreateCtrl = $controller('BaseLayoutCreateCtrl', {
            $scope: scope,
            $routeParams : { 'activeTab' : 'lessons'}
        });
    }));

    it('should NOT attach lessonTabActive function to scope', function () {
        expect(typeof(scope.lessonTabActive)).toBe('undefined');
    });

    it('should  attach sections to scope', function () {
        expect(typeof(scope.sections)).toBe('object');
    });
});
