'use strict';

describe('Controller: RolesUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var RolesUpdateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, LergoClient, $q) {
        scope = $rootScope.$new();
        spyOn(LergoClient.roles,'read').andReturn({then:function(){}});
        spyOn(LergoClient.roles,'getPermissions').andReturn({then:function(){}});
        spyOn($q,'all').andReturn({then: function(){}});
        RolesUpdateCtrl = $controller('RolesUpdateCtrl', {
            $scope: scope
        });
    }));

    describe('#init', function(){
        it('should mark all permissions on role as checked=true', inject(function($q, $controller){
            $q.all.andReturn({
                then:function(success){
                    success();
                }
            });

            scope.role = {
                permissions : [ 'foo','bar']
            };
            scope.permissions = [
                { value : 'foo' },
                { value : 'bar' },
                { value : 'hello'}
            ];

            RolesUpdateCtrl = $controller('RolesUpdateCtrl', {
                $scope: scope
            });

            expect(scope.permissions[0].checked).toBe(true);
            expect(scope.permissions[2].checked).not.toBe(true);

        }));

        it('should translate loaded permissions to label & value object array', inject(function($controller, LergoClient){
            LergoClient.roles.getPermissions.andReturn({then:function( success ){
                success( { data : [ 'foo','bar' ] });
            }});
            RolesUpdateCtrl = $controller('RolesUpdateCtrl', {
                $scope: scope
            });

            expect(scope.permissions[0].label).toBe('foo');
            expect(scope.permissions[0].value).toBe('foo');
        }));

        it('should put roles result on scope', inject(function( $controller, LergoClient, $routeParams ){
            LergoClient.roles.read.andReturn({
                then:function(success){
                    success({data:'foo'});
                }
            });
            $routeParams.roleId = 'bar';
            RolesUpdateCtrl = $controller('RolesUpdateCtrl', {
                $scope: scope
            });
            expect(scope.role).toBe('foo');
            expect(LergoClient.roles.read).toHaveBeenCalledWith('bar');
        }));
    }); // # init

    describe('#saveRole', function(){
        beforeEach(inject(function( LergoClient ){
            spyOn(LergoClient.roles,'update').andReturn({then:function(){}});
            scope.permissions = [];
            scope.role = {};
        }));
        it('should translate roles to array of strings and filter out items without checked=true', function(){
            scope.role = {};
            scope.permissions = [{ 'value' : 'foo' , 'checked' : true }, { value: 'bar' , checked: false}];
            scope.saveRole();
            expect(scope.role.permissions[0]).toBe('foo');
            expect(scope.role.permissions.length).toBe(1);
        });

        describe('success', function(){
            beforeEach(inject(function(LergoClient, $location){

                LergoClient.roles.update.andReturn({
                    then:function(success){
                        success({});
                    }
                });
                spyOn($location,'path');
            }));

            it('should notify about success', function(  ){
                scope.saveRole();
                expect(toastr.success).toHaveBeenCalled();
            });

            it('should redirect if done is true', inject(function($location){
                scope.saveRole(false);
                expect($location.path).not.toHaveBeenCalled();
                scope.saveRole(true);
                expect($location.path).toHaveBeenCalled();
            }));
        });

        describe('error', function(){
            beforeEach(inject(function( LergoClient ){
                LergoClient.roles.update.andReturn({then:function(success,error){
                    error({});
                }});
            }));

            it('should notify about failure', function(){
                scope.saveRole();
                expect(toastr.error).toHaveBeenCalled();
            });
        });

    });

    describe('#cancel', function(){
        it('should redirect', inject(function($location){
            spyOn($location,'path');
            scope.cancel();
            expect($location.path).toHaveBeenCalled();
        }));
    });

    describe('#deleteRole', function(){

        beforeEach(inject(function( $location ){
            scope.role = {};
            spyOn($location,'path');
            spyOn(window,'confirm').andReturn(true);
        }));

        it('should confirm deletion', function(){
            window.confirm.andReturn(false);
            scope.deleteRole();
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should call delete if confirmed', inject(function( LergoClient ){
            window.confirm.andReturn(true);
            spyOn(LergoClient.roles,'delete').andReturn({then:function(){}});
            scope.deleteRole();
        }));

        describe('success', function(){
            beforeEach(inject(function( LergoClient ){
                spyOn(LergoClient.roles,'delete').andReturn({
                    then:function(success){
                        success({});
                    }
                });
            }));

            it('should notify about the success and redirect', inject(function(LergoClient, $location){
                scope.deleteRole();
                expect(toastr.success).toHaveBeenCalled();
                expect($location.path).toHaveBeenCalled();
            }));
        });

        describe('error', function () {

            var errorResult = {};

            beforeEach(inject(function (LergoClient) {
                spyOn(LergoClient.roles, 'delete').andReturn({
                    then: function (success, error) {
                        error( errorResult );
                    }
                });
                LergoClient.errors.ResourceInUse = {
                    typeof:function( data ){
                        return data && data.id === 'ResourceInUse';
                    }
                };

            }));

            it('should notify about an error', function () {
                scope.deleteRole();
                expect(toastr.error).toHaveBeenCalled();
            });

            it('should have a specific message for users', function(){
                errorResult = {
                    data: {
                        id: 'ResourceInUse',
                        'description': {
                            'users': [
                                {
                                    'username': 'foo'
                                }
                            ]
                        }
                    }
                };
                scope.deleteRole();
                expect(toastr.error).toHaveBeenCalled();
                expect(toastr.error.mostRecentCall.args[0].indexOf('foo') >= 0).toBe(true);

            });
        });
    });
});
