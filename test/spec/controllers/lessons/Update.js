'use strict';

describe('Controller: LessonsUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var LessonsUpdateCtrl,
        $location,
        $rootScope,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, LergoClient, TagsService, _$location_ ) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $location = _$location_;
        spyOn($location,'path');
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

            expect($location.path).toHaveBeenCalledWith('/user/create/lessons');

            $rootScope.user = { '_id' : '6' };
            expect($location.path).toHaveBeenCalledWith('/user/create/lessons');

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
