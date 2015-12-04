'use strict';

describe('Directive: lergoUserProfile', function () {

    // load the directive's module
    beforeEach(module('lergoApp', 'lergoBackendMock', 'directives-templates', function ($provide) {
        $provide.factory('ContinuousSave', function(){
            return jasmine.createSpy('ContinuousSave');
        });
    }));

    var element,
        $httpBackend,
        $rootScope,
        $location,
        $compile,
        LergoClient,
        ContinuousSave,
        scope;

    function compileElement(html){
        if( !html){
            html = '<div lergo-user-profile can-edit="true"></div>';
        }
        element = angular.element();
        element = $compile(element)(scope);

        scope.$digest();
    }

    beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$location_, _LergoClient_, _ContinuousSave_ ) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        LergoClient = _LergoClient_;
        ContinuousSave= _ContinuousSave_;
        $compile = _$compile_;


        spyOn(LergoClient.users,'update').andReturn('');

        spyOn($location,'path').andReturn('');

        spyOn(LergoClient.users,'getProfile').andReturn(mockPromise());

        $httpBackend.whenGET('/backend/users/profile').respond(200,'{}');

        compileElement();
    }));

    describe('on load', function(){
        it('should register a method to changed user', function(){
            expect(ContinuousSave).toHaveBeenCalled();
            expect(ContinuousSave.mostRecentCall.args[0].saveFn).toBeDefined();
            var saveFn = ContinuousSave.mostRecentCall.args[0].saveFn;
            expect(LergoClient.users.update).not.toHaveBeenCalled();
            saveFn();
            expect(LergoClient.users.update).toHaveBeenCalled();
        });

        it('should get user by username', function(){
            LergoClient.users.getProfile.andReturn(mockPromise({ data : 'foo' }));
            compileElement();
            expect(scope.user).toBe('foo');
        });
    });



    describe('#getLessonsCount', function(){
        it('should return public lessons when mode is public', function(){
            expect(scope.getLessonsCount()).toBe('');

            scope.user = { stats : { 'allLessonsCount' : 22, 'publicLessonsCount' : 12 } };
            scope.mode = 'private';
            expect(scope.getLessonsCount()).toBe(22);

            scope.mode = 'public';
            expect(scope.getLessonsCount()).toBe(12);
        });
    });

    describe('#getQuestionsCount', function(){
        it('should return public lessons when mode is public', function(){
            expect(scope.getQuestionsCount()).toBe('');

            scope.user = { stats : { 'allQuestionsCount' : 22, 'publicQuestionsCount' : 12 } };
            scope.mode = 'private';
            expect(scope.getQuestionsCount()).toBe(22);

            scope.mode = 'public';
            expect(scope.getQuestionsCount()).toBe(12);
        });
    });

    describe('#getCreatedByFilter', function(){
        it('should return filter string', function(){
            scope.user = { _id: 'foo', username : 'bar' };
            expect(scope.getCreatedByFilter()).toBe(JSON.stringify(scope.user));
        });
    });

    describe('#showPublicQuestion', function(){
        it('should redirect to user created questions', function(){
            scope.user = { _id : 'foo' };
            scope.showPublicQuestion();
            expect($location.path).toHaveBeenCalled();
        });
    });
});
