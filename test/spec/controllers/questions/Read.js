'use strict';

describe('Controller: QuestionsReadCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var QuestionsReadCtrl,
        $rootScope,
        $controller,
        QuestionsService,
        LergoClient,
        $q,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _QuestionsService_, _LergoClient_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        QuestionsService = _QuestionsService_;
        LergoClient = _LergoClient_;
        $q = _$q_;

        spyOn(QuestionsService,'getQuestionById').andReturn(window.mockPromise({ data : { quizItem : { language : 'en'} } }));
        spyOn(QuestionsService, 'getTypeById').andReturn({previewTemplate: 'foo'});
        spyOn(LergoClient.questions,'checkAnswer').andReturn(window.mockPromise({data:{correct:true}}));

        scope = $rootScope.$new();
        QuestionsReadCtrl = $controller('QuestionsReadCtrl', {
            $scope: scope
        });
    }));

    describe('#getQuestionViewTemplate', function(){
        it('should return empty string if unknown type otherwise should return type template', function(){
            expect(scope.getQuestionViewTemplate()).toBe(''); // empty
            scope.quizItem = { 'type' : 'bar' }; // some type
            expect(scope.getQuestionViewTemplate()).toBe('foo'); // check vs. mock result
        });

    });

    describe('#isLiked', function(){
        it('should return if question is liked', function(){
            expect(scope.isLiked()).toBe(false);
            scope.questionLike = true;
            expect(scope.isLiked()).toBe(true);
        });
    });



    describe('#absoluteShareLink', function(){
        it('should get share link', function(){
            scope.absoluteShareLink({});
            expect(scope.share).toBe(true);
            expect(scope.shareLink).toContain('/read');
        });
    });

    describe('#isCorrectFillInTheBlanks', function(){
        it('should return true iff fitb is correct', function(){
            expect(scope.isCorrectFillInTheBlanks({ userAnswer: ['foo'], answer: ['foo']},0)).toBe(true);
            expect(scope.isCorrectFillInTheBlanks({ userAnswer: ['foo'], answer: ['bar']},0)).toBe(false);
            expect(scope.isCorrectFillInTheBlanks({ userAnswer: ['foo'], answer: ['bar;foo']},0)).toBe(true);
            expect(scope.isCorrectFillInTheBlanks({ userAnswer: ['foo'], answer: ['bar;BAR']},0)).toBe(false);
        });
    });

    describe('isMultiChoiceMultiAnswer', function(){
        it('should return true iff multi answer', function(){
            expect(scope.isMultiChoiceMultiAnswer({})).toBe(false);
            expect(scope.isMultiChoiceMultiAnswer({ options : [ { checked : true} ] })).toBe(false);
            expect(scope.isMultiChoiceMultiAnswer({ options : [ { checked : true}, {checked:true} ] })).toBe(true);
        });
    });

    describe('#checkAnswer', function(){
        it('should check answer', function(){
            Audio.prototype.play = jasmine.createSpy('audio-play');
            scope.checkAnswer(); // just verify does not throw error
        });
    });

    describe('#getFillInTheBlanksSize', function(){
        it('should return size', function(){
            expect(scope.getFillIntheBlankSize({ answer: ['a;aa;aaa'] }, 0)).toBe(50);

            expect(scope.getFillIntheBlankSize({ blanks: { type : 'custom' , size: 20}}, 0)).toBe(220);
        });
    });



});
