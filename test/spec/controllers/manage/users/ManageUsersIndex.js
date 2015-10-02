'use strict';

describe('Controller: ManageUsersIndexCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var AdminManageUsersIndexCtrl,
        LergoClient,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _LergoClient_ ) {
        scope = $rootScope.$new();
        LergoClient = _LergoClient_;
        AdminManageUsersIndexCtrl = $controller('ManageUsersIndexCtrl', {
            $scope: scope
        });
        spyOn(LergoClient.users,'getAll').andReturn(window.mockPromise());
    }));

    describe('#loadUsers', function(){
        it('should call LergoClient.users.getAll', function(){
            scope.loadUsers();
            expect(LergoClient.users.getAll).toHaveBeenCalled();
        });

        it('should put data on scope', function(){
            scope.filterPage = {};
            LergoClient.users.getAll.andReturn(window.mockPromise({data:{data:'foo', count: 'bar'}}));
            scope.loadUsers();
            expect(scope.users).toBe('foo');
            expect(scope.filterPage.count).toBe('bar');
        });
    });

});
