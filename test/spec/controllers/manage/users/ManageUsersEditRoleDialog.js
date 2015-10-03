'use strict';

describe('Controller: ManageUsersEditRoleDialogCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var ManageUsersEditRoleDialogCtrl,
        LergoClient,
        $modalInstance,
        $controller,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, $rootScope, _LergoClient_, _$modalInstance_  ) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        LergoClient = _LergoClient_;
        $modalInstance = _$modalInstance_;
        ManageUsersEditRoleDialogCtrl = $controller('ManageUsersEditRoleDialogCtrl', {
            $scope: scope
        });

        scope.user = {};

        spyOn($modalInstance, 'close');
        spyOn($modalInstance, 'dismiss');
        spyOn(LergoClient.users,'patchUserRoles').andReturn(window.mockPromise());

    }));

    describe('#init', function(){
        it('should map roles', function(){
            scope.roles = [ {name: 'foo', '_id' : 'foo_id'} , {name:'bar'}];
            scope.user = { roles : ['foo_id']};
            ManageUsersEditRoleDialogCtrl = $controller('ManageUsersEditRoleDialogCtrl', {
                $scope: scope
            });
            expect(scope.roles[0].label).toBe('foo');
            expect(!!scope.roles[0].checked).toBe(true);
            expect(scope.roles[1].label).toBe('bar');
            expect(!!scope.roles[1].checked).toBe(false);
        });

    });

    describe('#submit', function(){
        it('should call pathUserRoles', function(){
            scope.submit();
            expect(LergoClient.users.patchUserRoles).toHaveBeenCalled();
        });

        it('should notify success and close dialog on success', function(){

            LergoClient.users.patchUserRoles.andReturn(window.mockPromise({}));
            scope.submit();
            expect($modalInstance.close).toHaveBeenCalled();
            expect(toastr.success).toHaveBeenCalled();
        });

        it('should notify on error', function(){
            LergoClient.users.patchUserRoles.andReturn(window.mockPromise(null, {}));
            scope.submit();
            expect(toastr.error).toHaveBeenCalled();
        });
    });

    describe('#close', function(){
        it('should close the dialog', function(){
            scope.close();
            expect($modalInstance.dismiss).toHaveBeenCalled();
        });
    });

});
