'use strict';

describe('Controller: BaseLayoutCreateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var BaselayoutcreateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $route, $location) {
        scope = $rootScope.$new();
        BaselayoutcreateCtrl = $controller('BaseLayoutCreateCtrl', {
            $scope: scope,
            $route: { current: {} },
            $location: $location

        });
    }));

    it('should attach lessonTabActive function to scope', function () {
        expect(typeof(scope.lessonTabActive)).toBe('function');
    });
});
