'use strict';

describe('Controller: ManageUsersUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var ManageUserUpdateCtrl,
        $controller,
        $location,
        LergoClient,
        $uibModal,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, $rootScope, _$location_, _$uibModal_, _LergoClient_ ) {
        $location = _$location_;
        $uibModal = _$uibModal_;
        $controller = _$controller_;
        LergoClient = _LergoClient_;
        scope = $rootScope.$new();
        ManageUserUpdateCtrl = $controller('ManageUsersUpdateCtrl', {
            $scope: scope
        });

        spyOn($location,'path');
        spyOn(LergoClient.roles,'list').andReturn({then:function(){}});
        spyOn($uibModal,'open').andCallThrough();
        spyOn(LergoClient.users,'read').andReturn({
            then:function(){}
        });
    }));

    describe('#init', function(){
        describe('load user', function(){
            it('should put user on scope', function(){
                LergoClient.users.read.andReturn(window.mockPromise({data:'foo'}));

                ManageUserUpdateCtrl = $controller('ManageUsersUpdateCtrl', {
                    $scope: scope
                });
                expect(LergoClient.users.read).toHaveBeenCalled();
                expect(scope.user).toBe('foo');

            });

            it('should notify about an error', function(){
                LergoClient.users.read.andReturn({
                    then:function(success, error){
                        error();
                    }
                });
                ManageUserUpdateCtrl = $controller('ManageUsersUpdateCtrl', {
                    $scope: scope
                });

                expect(toastr.error).toHaveBeenCalled();
            });
        });
    });

    describe('#close', function(){
        it('should redirect', function(){
            scope.close();
            expect($location.path).toHaveBeenCalled();
        });


    });

    describe('#editUserRoles', function(){
        it('should open a dialog that invokes loadUser on result', function(){
            var modalResponse = { result : { then:jasmine.createSpy('then')}};
            $uibModal.open.andReturn( modalResponse);
            scope.editUserRoles();
            expect($uibModal.open).toHaveBeenCalled();
            expect(modalResponse.result.then).toHaveBeenCalled();
            expect(modalResponse.result.then.mostRecentCall.args[0].name).toBe('loadUser');
        });
    });

    describe('#loadRoles', function(){
        it('should call LergoClient.roles.list', function(){
            scope.loadRoles();
            expect(LergoClient.roles.list).toHaveBeenCalled();
        });

        it('should index results by _id', function(){
            LergoClient.roles.list.andReturn(window.mockPromise({data:{data:[{_id:'foo'}, {'_id':'bar'}]}}));
            scope.loadRoles();
            expect(!!scope.roles.foo).toBe(true);
            expect(!!scope.roles.bar).toBe(true);
        });
    });

    describe('#getRoleName', function(){
        it('should return the role\'s name', function(){
            scope.roles = {
                'foo' :  { name : 'bar' }
            };
            expect(scope.getRoleName('foo')).toBe('bar');
        });
    });
});
