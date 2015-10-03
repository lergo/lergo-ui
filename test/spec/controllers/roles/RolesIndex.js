'use strict';

describe('Controller: RolesIndexCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var RolesIndexCtrl,
        LergoClient,
        $controller,
        $location,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, $rootScope, _LergoClient_, _$location_) {
        $controller = _$controller_;
        scope = $rootScope.$new();
        RolesIndexCtrl = $controller('RolesIndexCtrl', {
            $scope: scope
        });
        LergoClient = _LergoClient_;
        $location = _$location_;
        spyOn($location,'path');
        spyOn(LergoClient.roles,'create').andReturn({then:function(){}});
        spyOn(LergoClient.roles,'list');

    }));

    describe('#init', function(){
        it('should call LergoClient.roles.list', function(){
            scope.create();
            expect(LergoClient.roles.create).toHaveBeenCalled();
        });

        it('should notify if roles.list failed', function(){
            LergoClient.roles.list.andReturn({
                then:function(success,error){
                    error({});
                }
            });
            RolesIndexCtrl = $controller('RolesIndexCtrl', {
                $scope: scope
            });
            expect(toastr.error).toHaveBeenCalled();
        });

        it('should put roles result on scope', function(){
            LergoClient.roles.list.andReturn({then: function(success){
                success({data: { data : 'foo' }});
            }});
            RolesIndexCtrl = $controller('RolesIndexCtrl', {
                $scope: scope
            });
            expect(scope.roles).toBe('foo');
        });

    });

    describe('#create', function(){
        it('should call LergoClient.roles.create', function(){
            scope.create();
            expect(LergoClient.roles.create).toHaveBeenCalled();
        });

        describe('success', function(){
            beforeEach(function(){
                LergoClient.roles.create.andReturn({
                    then:function(success){
                        success({ data : { }});
                    }
                });
            }) ;
            it('should redirect to update', function(){
                scope.create();
                expect($location.path).toHaveBeenCalled();
            });
        });

        describe('error', function(){
            var errorResponse = {};
            beforeEach(function(){
                LergoClient.roles.create.andReturn({
                    then:function(success,error){
                        error(errorResponse);
                    }
                });
            });

            it('should notify about an error', function(){
                scope.create();
                expect(toastr.error).toHaveBeenCalled();
                expect(scope.errorMessage).toBe('unknown error');
            });
        });
    });

    describe('#getRoleName', function(){
        it('should return role.name if exists or "no name..." as default', function(){
            expect(scope.getRoleName({'name' : 'foo'})).toBe('foo');
            expect(scope.getRoleName({})).toBe('no name.. :(');
        });
    });
});
