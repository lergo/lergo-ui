'use strict';

describe('Controller: LessonsIntroCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp', 'lergoBackendMock'));

    var LessonsIntroCtrl,
        $controller,
        LergoClient,
        DisplayRoleService,
        $routeParams,
        $rootScope,
        $location,
        $log,

        scope;

    function initController() {
        scope = $rootScope.$new();

        LessonsIntroCtrl = $controller('LessonsIntroCtrl', {
            $scope: scope
        });
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, _$rootScope_, _LergoClient_, _$routeParams_, _$location_, _$log_, _DisplayRoleService_) {
        LergoClient = _LergoClient_;

        spyOn(LergoClient.lessons, 'getLessonIntro').andReturn(window.mockPromise({data: {name: 'foo'}}));

        spyOn(LergoClient.lessons, 'getPermissions').andReturn(window.mockPromise({data: 'foo'}));
        spyOn(LergoClient.lessons, 'delete').andReturn(window.mockPromise());
        spyOn(LergoClient.lessons, 'getShareLink').andReturn('foo');
        spyOn(LergoClient.lessons, 'findLessonsById').andReturn(window.mockPromise());
        spyOn(LergoClient.likes, 'getMyLessonLike').andReturn(window.mockPromise());
        spyOn(LergoClient.lessonsInvitations, 'createAnonymous').andReturn(window.mockPromise());
        spyOn(LergoClient.lessons, 'copyLesson').andReturn(window.mockPromise({data: {}}));
        spyOn(LergoClient.abuseReports, 'abuseLesson');
        spyOn(LergoClient.users, 'findUsersById').andReturn(window.mockPromise());
        spyOn(LergoClient.likes, 'countLessonLikes').andReturn(window.mockPromise());
        spyOn(LergoClient.likes, 'deleteLessonLike').andReturn(window.mockPromise());
        spyOn(LergoClient.likes, 'likeLesson').andReturn(window.mockPromise());
        spyOn(LergoClient.questions, 'findQuestionsById').andReturn(window.mockPromise());

        $controller = _$controller_;
        $routeParams = _$routeParams_;
        $rootScope = _$rootScope_;
        $location = _$location_;
        DisplayRoleService = _DisplayRoleService_;

        spyOn($location, 'path').andReturn({
            replace: function () {
            },
            search: function () {
            }
        });

        spyOn(window, 'confirm').andReturn(true);
        spyOn(DisplayRoleService, 'canSeeActionItemsOnLessonIntroPage');

        $log = _$log_;
        spyOn($log, 'error').andCallThrough();
        $log.error.logs = [];


        initController();

    }));

    describe('#init', function () {

        describe('#getLessonIntro', function () {


            it('should invoke getLessonIntroInvoked', function () {
                expect(LergoClient.lessons.getLessonIntro).toHaveBeenCalled();
            });

            describe('#success', function () {
                it('should put result on on lesson and initialize page', function () {
                    expect(scope.lesson.name).toBe('foo');
                    expect(scope.page.title).toBe('foo');
                });

                it('should call startLesson if routeParams.autoPlay is set', function () {
                    $routeParams.autoPlay = true;
                    initController();
                    // default behavior of autoPlay..
                    expect(LergoClient.lessonsInvitations.createAnonymous).toHaveBeenCalled();
                });

                describe('#loadQuestions', function () {
                    var questionsResponse = [{
                        '_id': 'one',
                        summary: 'foo',
                        userId: 'bar',
                        copyOf: ['two']
                    }, {'_id': 'two', userId: 'hello', copyOf: ['one']}];
                    beforeEach(function () {
                        LergoClient.lessons.getLessonIntro.andReturn(window.mockPromise({
                            data: {
                                name: 'foo',
                                steps: [{quizItems: []}]
                            }
                        }));
                        LergoClient.questions.findQuestionsById.andReturn(window.mockPromise({data: questionsResponse}));

                    });

                    it('should put questions on scope', function () {

                        initController();
                        expect(scope.questions.length).toBe(questionsResponse.length);
                    });

                    it('should keep another field on scope with only questions with summary', function () {
                        initController();
                        expect(scope.questionsWithSummary.length).toBe(1);
                    });


                    describe('#giveCreditToQuestionsWeUseFromOthers', function () {
                        it('should merge info of users and put of scope', function () {
                            LergoClient.users.findUsersById.andReturn(window.mockPromise({
                                data: [{
                                    _id: 'bar',
                                    info: 'bar_info'
                                }]
                            }));
                            initController();
                            expect(_.size(scope.questionsFromOthers)).toBe(2);
                            expect(scope.questionsFromOthers.one.userDetails.info).toBe('bar_info');
                        });
                    });

                    describe('giveCreditToQuestionsWeCopied', function () {
                        it('should merge info of users and put of scope', function () {
                            LergoClient.users.findUsersById.andReturn(window.mockPromise({
                                data: [{
                                    _id: 'bar',
                                    info: 'bar_info'
                                }]
                            }));
                            initController();

                            expect(_.size(scope.questionsWeCopied)).toBe(2);
                            expect(scope.questionsWeCopied.one.userDetails.info).toBe('bar_info');
                        });
                    });


                });

            });

            describe('error', function () {
                it('should redirect to notFound if response was 404', function () {
                    LergoClient.lessons.getLessonIntro.andReturn(window.mockPromise(null, {status: 404}));
                    initController();
                    expect($location.path).toHaveBeenCalledWith('/errors/notFound');
                });

                it('should not do anything otherwise', function () {
                    LergoClient.lessons.getLessonIntro.andReturn(window.mockPromise(null, {}));
                    initController();
                    expect($location.path).not.toHaveBeenCalled();
                });
            });


        });

        describe('#getPermissions', function () {
            it('should invoke getPermissionsInvoked', function () {
                expect(LergoClient.lessons.getPermissions).toHaveBeenCalled();
            });

            it('should put result on scope', function () {
                expect(scope.permissions).toBe('foo');
            });
        });


    });

    describe('#likeLesson', function () {
        it('should putLessonLike on scope', function () {
            LergoClient.likes.likeLesson.andReturn(window.mockPromise({data: 'foo'}));
            scope.likeLesson();
            expect(scope.lessonLike).toBe('foo');
        });
    });

    describe('#unlikeLesson', function () {
        it('should remove lessonLike from scope', function () {
            scope.lessonLike = 'foo';
            LergoClient.likes.deleteLessonLike.andReturn(window.mockPromise({}));
            scope.unlikeLesson();
            expect(scope.lessonLike).toBe(null);
        });
    });

    describe('#copyLesson', function () {
        describe('success', function () {
            it('should redirect', function () {
                scope.copyLesson();
                expect($location.path).toHaveBeenCalled();
            });

        });

        describe('error', function () {
            it('should log error', function () {
                LergoClient.lessons.copyLesson.andReturn(window.mockPromise(null, 'foo'));
                scope.copyLesson();
                expect($log.error).toHaveBeenCalledWith('foo');
            });
        });
    });

    describe('#isLiked', function () {
        it('should return if lessons is liked or not', function () {
            expect(scope.isLiked()).toBe(false);
            scope.lessonLike = true;
            expect(scope.isLiked()).toBe(true);
        });
    });

    describe('#deleteLesson', function () {
        it('should prompt', function () {
            scope.deleteLesson({});
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should call "delete" if confirmed ', function () {
            scope.deleteLesson({});
            expect(LergoClient.lessons.delete).toHaveBeenCalled();
        });

        it('should not call "delete" if rejected', function () {
            window.confirm.andReturn(false);
            scope.deleteLesson({});

            expect(LergoClient.lessons.delete).not.toHaveBeenCalled();
        });

        it('should redirect to lessons once lesson is deleted ', function () {
            LergoClient.lessons.delete.andReturn(window.mockPromise({}));
            scope.deleteLesson({});
            expect($location.path).toHaveBeenCalled();
        });

        it('should put errorMessage on error', function () {
            LergoClient.lessons.delete.andReturn(window.mockPromise(null, {data: {message: 'foo'}}));
            scope.deleteLesson({});
            expect(scope.errorMessage).toContain('Error in deleting Lesson');
        });
    });

    describe('#showActionItems', function () {
        it('should return if user can see action item', function () {
            DisplayRoleService.canSeeActionItemsOnLessonIntroPage.andReturn('foo');
            expect(scope.showActionItems()).toBe('foo');
        });
    });

    describe('#preivew', function () {
        it('should redirect to preview', function () {
            scope.preview();
            expect($location.path).toHaveBeenCalled();
        });
    });


    describe('#showEditSummary', function () {
        it('should be true if lesson has copyOf and copyOfItems not empty', function () {
            scope.lesson = {copyOf: 'foo'};
            scope.copyOfItems = ['foo'];
            expect(scope.showEditSummary()).toBe(true);

            // check what happens if copyOfItems is an object
            scope.copyOfItems = {'foo': 'bar'};
            expect(scope.showEditSummary()).toBe(true);
        });


        it('should be true if questionsFromOthers', function () {
            scope.questionsFromOthers = {'foo': 'bar'};
            expect(scope.showEditSummary()).toBe(true);

            scope.questionsFromOthers = ['foo'];
            expect(scope.showEditSummary()).toBe(true);
        });

        it('should be true if questionsWeCopied is not empty', function () {
            scope.questionsWeCopied = ['foo'];
            expect(scope.showEditSummary()).toBe(true);

            scope.questionsWeCopied = {'foo': 'bar'};
            expect(scope.showEditSummary()).toBe(true);
        });

        it('should be true if there are questions with summary', function () {
            scope.questions = [{summary: 'foo'}];
            expect(scope.showEditSummary()).toBe(true);
        });


    });

    describe('#showReadMore', function () {
        it('should return true if showEditSummary is true', function () {
            spyOn(scope, 'showEditSummary').andReturn(true);
            expect(scope.showReadMore()).toBe(true);
        });

        it('should return true if description was filtered', function () {
            scope.lesson = {description: {length: 10}}; // in real life this is a string, but it doesn't really matter ..
            expect(scope.showReadMore('b')).toBe(true);
        });

    });

    describe('#startLesson', function () {

        it('should redirect to preview if preview mode is on', function () {
            $routeParams.preview = true;
            initController();
            scope.startLesson();
            expect($location.path).toHaveBeenCalled();
        });

        it('should call createAnonymous invitation if no invitationId was specified', function () {
            scope.startLesson();
            expect(LergoClient.lessonsInvitations.createAnonymous).toHaveBeenCalled();
        });

        it('should redirect to invitation if anonymous and invite was created', function () {
            LergoClient.lessonsInvitations.createAnonymous.andReturn(window.mockPromise({data: {id: 'foo'}}));
            scope.startLesson();
            expect($location.path).toHaveBeenCalled();
        });

        it('should redirect to invitation if invitationId is specified', function () {
            $routeParams.invitationId = 'foo';
            initController();
            scope.startLesson();
            expect($location.path).toHaveBeenCalled();

        });

    });

    describe('#setActiveAction', function () {
        it('should change/toggle activeSessionItem', function () {
            scope.setActiveAction('foo');
            expect(scope.isActiveAction('foo')).toBe(true, 'it should be foo');

            // change
            scope.setActiveAction('bar');
            expect(scope.isActiveAction('bar')).toBe(true, 'it should be bar');

            // toggle
            scope.setActiveAction('bar');
            expect(scope.isActiveAction('bar')).toBe(false, 'it should have been toggled');
        });
    });

    describe('#submitAbuseReport', function () {
        it('should put true on submit and submit abuseReport', function () {
            scope.submitAbuseReport();
            expect(LergoClient.abuseReports.abuseLesson).toHaveBeenCalled();
            expect(scope.submit).toBe(true);
        });
    });

    describe('#onTextClick', function () {
        it('should call select on target', function () {
            var event = {target: {select: jasmine.createSpy('select')}};
            scope.onTextClick(event);
            expect(event.target.select).toHaveBeenCalled();
        });
    });

    describe('watchers', function () {

        var watchers = {
            loadCopyOfDetails: function () {
            }, // adding mocks so code will display properly in ide..
            loadLike: function () {
            },
            countLikes: function () {
            }
        };

        function mapWatchers() {
            watchers = {}; // don't keep garbage..

            _.each(scope.$$watchers, function (w) {
                watchers[w.fn.name] = w.fn;
            });
        }

        beforeEach(mapWatchers);

        describe('$$loadLike', function () {
            it('should getMyLessonLike', function () {
                watchers.loadLike({});
                expect(LergoClient.likes.getMyLessonLike).toHaveBeenCalled();
            });

            it('should put lesson like on scope', function () {
                LergoClient.likes.getMyLessonLike.andReturn(window.mockPromise({data: 'foo'}));
                watchers.loadLike({});
                expect(scope.lessonLike).toBe('foo');
            });

            it('should watch lessonLike', function () {
                watchers.loadLike({});
                mapWatchers();
                expect(watchers.countLikes).toBeDefined();
            });

            describe('$$countLikes', function () {
                beforeEach(function () {
                    watchers.loadLike({}); //this will add the watch countLikes
                    mapWatchers();
                });
                it('should put lessonLikes count on scope', function () {
                    LergoClient.likes.countLessonLikes.andReturn(window.mockPromise({data: {count: 7}}));
                    watchers.countLikes();
                    expect(scope.lessonLikes).toBe(7);
                });
            });
        });

        describe('$$loadCopyOfDetails', function () {

            it('should create share link and put it on scope', function () {

                watchers.loadCopyOfDetails({});
                expect(LergoClient.lessons.getShareLink).toHaveBeenCalled();
                expect(scope.shareLink).toBe('foo');
                expect(scope.embedCode).toContain('foo');
            });

            it('should fetch copyOf data if lesson is copied', function () {
                watchers.loadCopyOfDetails({copyOf: {}});
                expect(LergoClient.lessons.findLessonsById).toHaveBeenCalled();
            });

            describe('load of copyOfLesson data', function () {
                beforeEach(function () {
                    LergoClient.lessons.findLessonsById.andReturn(window.mockPromise({}));
                });
                it('should do nothing if newValue is falsy', function () {
                    watchers.loadCopyOfDetails();
                    expect(scope.shareLink).toBeUndefined();
                });
                it('should load owners details', function () {
                    watchers.loadCopyOfDetails({copyOf: {}});
                    expect(LergoClient.users.findUsersById).toHaveBeenCalled();
                });

                it('should merge all the info together, and put it on scope', function () {
                    scope.lesson = {userId: 'foo', 'copyOf': {}};
                    LergoClient.lessons.findLessonsById.andReturn(window.mockPromise({
                        data: [
                            {
                                userId: 'bar'
                            }, {
                                userId: 'foo' // should be filtered
                            },
                            {
                                userId: 'hello'
                            }, {
                                userId: 'world'
                            }
                        ]
                    }));

                    LergoClient.users.findUsersById.andReturn(window.mockPromise({
                        data: [{
                            '_id': 'bar',
                            info: 'bar_info'
                        }]
                    }));
                    watchers.loadCopyOfDetails(scope.lesson);
                    expect(scope.copyOfItems.length).toBe(3);
                    expect(scope.copyOfItems[0].userDetails.info).toBe('bar_info');
                });
            });
        });

    });


});
