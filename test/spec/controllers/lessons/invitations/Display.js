'use strict';

describe('Controller: LessonsInvitationsDisplayCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsInvitationsDisplayCtrl,
        LergoClient,
        practiceMistakesLesson,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _LergoClient_ ) {

        LergoClient = _LergoClient_;

        spyOn(LergoClient.lessonsInvitations,'build').andReturn(window.mockPromise({ data: { lesson : {} } }));
        practiceMistakesLesson = { data : {} };
        spyOn(LergoClient.lessons,'create').andReturn(window.mockPromise(practiceMistakesLesson));
        spyOn(LergoClient.lessons,'update').andReturn(window.mockPromise({}));

        scope = $rootScope.$new();
        LessonsInvitationsDisplayCtrl = $controller('LessonsInvitationsDisplayCtrl', {
            $scope: scope
        });
    }));

    describe('practice mistakes', function(){
        it('should make questions unique', function(){ // solves bug where lessons gets stuck

            scope.report = { data: {lesson:{ name: 'foo', steps: [ { type: 'quiz', retryQuestion: false } ]}} };
            scope.wrongQuestions = ['a','b','a','b'];
            spyOn(scope,'startLesson');

            scope.practiceMistakes();
            expect(practiceMistakesLesson.data.steps[0].quizItems.length).toBe(2);
            expect(LergoClient.lessons.update).toHaveBeenCalled();
            //expect(scope.startLesson).toHaveBeenCalled();
        });
    });
});
