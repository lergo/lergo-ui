'use strict';

describe('Controller: LessonsUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsUpdateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, LergoClient, TagsService) {
        scope = $rootScope.$new();
        spyOn(TagsService, 'getAllAvailableTags').andCallFake(function () {
            return {
                then: function () {
                }
            };
        });
        spyOn(LergoClient.lessons, 'getById').andCallFake(function () {
            return {
                then: function () {
                }
            };
        });
        LessonsUpdateCtrl = $controller('LessonsUpdateCtrl', {
            $scope: scope,
            ContinuousSave: function () {

                this.getStatus = function () {
                    return 'foo' + new Date().getTime();
                };

            }
        });
    }));

    it('should attach displayStep function to scope', function () {
        expect(typeof(scope.displayStep)).toBe('function');
    });

    describe('watch on saveLesson status', function () {
        it('should update the scope with new value', inject(function () {
            scope.$digest();
            expect(scope.saveStatus.indexOf('foo')).toBe(0);
        }));
    });
});
