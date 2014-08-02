'use strict';

describe('Controller: TranslationsDiffCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var TranslationsDiffCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        TranslationsDiffCtrl = $controller('TranslationsDiffCtrl', {
            $scope: scope
        });
    }));

    describe('#truncateEntry', function () {
        it('should truncate long string ', function () {
            var entry = 'this is a very long entry';
            expect(scope.truncateEntry(entry).length).toBeLessThan(entry.length);
        });
    });
});
