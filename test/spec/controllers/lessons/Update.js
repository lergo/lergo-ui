'use strict';

describe('Controller: LessonsUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var LessonsUpdateCtrl,
        $window,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, LergoClient, TagsService, _$window_ ) {
        scope = $rootScope.$new();
        $window = _$window_;
        spyOn($window.history,'go');
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

    describe('#done', function(){
        it('should go back in history twice!', function(){
            scope.done();
            expect($window.history.go).toHaveBeenCalledWith(-2);
        });
    });

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
