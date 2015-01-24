'use strict';

describe('Controller: HomepageCtrl', function() {

    // load the controller's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var scope = null;
    var LergoClient = null;


    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();


        LergoClient = {
            lessons : {
                getPublicLessons : function( /*queryObj*/ ){
                    return {
                        'then' : function( success ){
                            success( { 'data' : { 'data' : 'this is data' ,  'count' : 10 } } );
                        }
                    };
                }
            }
        };

        $controller('HomepageCtrl', {
            $scope : scope,
            LergoClient: LergoClient
        });
    }));

    describe('load lessons', function(){
        it('should load lessons', function(){
            spyOn(LergoClient.lessons, 'getPublicLessons').andCallThrough();
            scope.loadLessons();
            expect(LergoClient.lessons.getPublicLessons).toHaveBeenCalled();
            expect(scope.filterPage.count).toBe(10);
            expect(scope.lessons).toBe('this is data');
        });
    });

    describe('absoluteShareLink', function(){
        it('should return a value', function(){
            expect(scope.absoluteShareLink({'_id' : 6})).toMatch(new RegExp('http://localhost:(9002|9001)/#!/public/lessons/6/share'));
        });

    });

    describe('persistScroll', function(){
        //beforeEach(module('lergoBackendMock'))
        it('should remember scroll position', inject(function( $rootScope ){

            var before = _.size($rootScope.scrollPosition);
            // now lets generate an 'oldValue' watch
            scope.filterPage.current = 1;
            scope.$digest();
            scope.filterPage.current = 2;
            scope.$digest();
            var after = _.size($rootScope.scrollPosition);
            expect(after).toBe(before+1);
        }));
    });

});
