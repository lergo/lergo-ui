'use strict';

describe('Service: QuestionsService', function () {

    // load the service's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    // instantiate service
    var mQuestionsService;
    beforeEach(inject(function (QuestionsService) {
        mQuestionsService = QuestionsService;
    }));

    describe('# copyQuestion', function () {
        it('should invoke a POST request', inject(function ($httpBackend) {
            $httpBackend.expectPOST('/backend/questions/6/copy').respond(200);
            mQuestionsService.copyQuestion(6);
            $httpBackend.flush();
        }));
    });

    describe('# getQuestionById', function () {
        it('should invoke a GET request', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/questions/6').respond(200);
            mQuestionsService.getQuestionById(6);
            $httpBackend.flush();
        }));
    });

    describe('# findQuestionsById', function () {
        it('should invoke a GET request with questionIds param', inject(function ($httpBackend) {
            var questionsId = [1, 2, 3];
            var params = _.map(questionsId, function (item) {
                return 'questionsId=' + item;
            });
            $httpBackend.expectGET('/backend/questions/find?' + params.join('&')).respond(200);
            mQuestionsService.findQuestionsById(questionsId);
            $httpBackend.flush();
        }));
    });

    describe('# getPublicQuestions', function () {
        it('should invoke a GET request with queryObj', inject(function ($httpBackend) {
            var queryObj = {'a': 'b'};
            $httpBackend.expectGET('/backend/questions/publicLessons?query=' + encodeURI(JSON.stringify(queryObj))).respond(200);
            mQuestionsService.getPublicQuestions(queryObj);
            $httpBackend.flush();
        }));
    });

    describe('# createQuestion', function () {
        it('should invoke a POST request with question in body', inject(function ($httpBackend) {
            var question = {'this': 'is a question'};
            $httpBackend.expectPOST('/backend/questions/create', question).respond(200);
            mQuestionsService.createQuestion(question);
            $httpBackend.flush();
        }));
    });

    describe('#updateQuestion', function () {
        it('should invoke a POST request with question', inject(function ($httpBackend) {
            var question = {'_id': 6, 'this': 'is an update'};
            $httpBackend.expectPOST('/backend/questions/6/update', question).respond(200);
            mQuestionsService.updateQuestion(question);
            $httpBackend.flush();
        }));
    });

    describe('#questionsType', function () {
        var types = null;
        beforeEach(function () {
            types = mQuestionsService.questionsType;
        });
        it('should exist', function () {

            expect(!!types).toBe(true);
        });

        it('should have "answers" , "isValid", "canSubmit" functions', function () {
            _.each(types, function (type) {
                _.each(['answers', 'isValid', 'canSubmit'], function (fn) {
                    expect(type.hasOwnProperty(fn)).toBe(true, 'type [' + type.id + '] should have function [' + fn + ']');
                });
            });
        });


        describe('fill in the blanks', function () {
            var fitb = null;
            beforeEach(function () {
                fitb = mQuestionsService.getTypeById('fillInTheBlanks');
            });

            describe('answers', function () {
                it('should split a string separated with ; to an array', function () {
                    expect(fitb.answers({'answer': ['a;b;c', 'foo']})).toBe('a / b / c ; foo');
                });
            });

            describe('is valid', function () {


                it('should return false if no questions', function () {
                    expect(fitb.isValid({})).toBe(false);
                });
                it('should return false if no answers', function () {
                    expect(fitb.isValid({'question': 'hello'})).toBe(false);
                    expect(fitb.isValid({'question': 'hello', 'answer': []})).toBe(false);
                });

                it('should return false if answers has a null value', function () {
                    expect(fitb.isValid({'question': 'hello', 'answer': [1, 2, null]})).toBe(false);
                });

                /* it('should return true if answers is an array with items that are not null', function () {
                    expect(fitb.isValid({'question': 'hello', 'answer': [1, 2]})).toBe(true);
                }); */   /* this test should fail for fill-in-the-blanks */
            });

            describe('can submit', function () {
                it('should return true iff data is valid', function () {
                    expect(fitb.canSubmit()).toBe(false);
                    expect(fitb.canSubmit({})).toBe(false);
                    expect(fitb.canSubmit({'userAnswer': ['foo'], 'answer': [1, 2, 3]})).toBe(false);
                    expect(fitb.canSubmit({'userAnswer': ['foo', null, 3], 'answer': [1, 2, 3]})).toBe(false);
                    expect(fitb.canSubmit({'userAnswer': ['foo', 2, 3], 'answer': [1, 2, 3]})).toBe(true);

                });

            });
        });

        describe('multi choices', function () {
            var mc = null;
            beforeEach(function () {
                mc = mQuestionsService.getTypeById('multipleChoices');
            });
            describe('is valid', function () {
                it('should return true iff data complete', function () {
                    expect(mc.isValid({})).toBe(false);
                    expect(mc.isValid({'question': 'hello'})).toBe(false);
                    expect(mc.isValid({'question': 'hello', 'options': [{}]})).toBe(false);
                    expect(mc.isValid({'question': 'hello', 'options': [{'label': 'option'}]})).toBe(false);
                    expect(mc.isValid({
                        'question': 'hello',
                        'options': [{'label': 'option', 'checked': true}]
                    })).toBe(true);
                });
            });

            describe('can submit', function () {
                it('should return true iff data is complete', function () {
                    expect(mc.canSubmit()).toBe(false);
                    expect(mc.canSubmit({})).toBe(false);
                    expect(mc.canSubmit({'options': []})).toBe(false);
                    expect(mc.canSubmit({'options': [{}]})).toBe(false);
                    expect(mc.canSubmit({'options': [{'userAnswer': true}]})).toBe(true);
                });
            });

            describe('answers', function () {
                it('should return answers as string', function () {
                    expect(mc.answers({
                        'options': [{'label': 'a', 'checked': true}, {'label': 'b'}, {
                            'label': 'c',
                            'checked': true
                        }]
                    })).toBe('a ; c');

                });
            });
        });

        describe('exact match', function () {
            var em = null;
            beforeEach(function () {
                em = mQuestionsService.getTypeById('exactMatch');
            });

            describe('isValid', function () {
                it('should return true iff data is complete', function () {
                    expect(em.isValid({'question': 'hello'})).toBe(false);
                    expect(em.isValid({'question': 'hello', 'options': []})).toBe(false);
                    expect(em.isValid({'question': 'hello', 'options': [{'label': 'hello', 'checked':true }]})).toBe(true);
                });
            });

            describe('answers', function () {
                it('should return answers as string', function () {

                    expect(em.answers({'options': [{'label': 'foo', checked:true}, {'label': 'bar', checked:true}]})).toBe('foo / bar');
                });
            });

        });
    });

    describe('#getTypeById', function () {
        var types = null;
        beforeEach(function () {
            types = mQuestionsService.questionsType;
        });

        it('should get question type by its ID', function () {

            _.each(types, function (type) {
                var result = mQuestionsService.getTypeById(type.id);
                expect(result).toBe(type);
            });
        });

        it('should throw error if question type does not exist', function () {

            expect(function () {
                mQuestionsService.getTypeById('foo');
            }).toThrow();
        });
    });


});
