'use strict';

describe('Service: LessonsService', function () {

    // load the service's module
    beforeEach(module('lergoApp', 'lergoBackendMock'));

    // instantiate service
    var mLessonsService;
    beforeEach(inject(function (LessonsService) {
        mLessonsService = LessonsService;
    }));

    it('should do something', function () {
        expect(!!mLessonsService).toBe(true);
    });


    describe('getVideoId', function () {
        it('should get video id', function () {
            var step = {'videoUrl': 'https://www.youtube.com/watch?v=heUd26tuinw'};
            var videoId = mLessonsService.getVideoId(step);
            expect(videoId).toBe('heUd26tuinw');
        });

        it('should catch exception', function () {
            var step = { 'videoUrl': 'abcdefghijklmnopqrstuvwxyz' };
            var videoId = mLessonsService.getVideoId(step);
            expect(videoId).toBe(null);
        });

        it('should return null if step does not exist', function () {
            var videoId = mLessonsService.getVideoId(null);
            expect(videoId).toBe(null);
        });
    });

    describe('getImageTitle', function () {
        it('should return undefined when input invalid', function () {
            expect(mLessonsService.getTitleImage({})).toBe(undefined);
            expect(mLessonsService.getTitleImage({'steps': []})).toBe(undefined);
        });

        it('should return a resource from sce when there is a step from youtube', function () {
            var sce = mLessonsService.getTitleImage({ 'steps': [
                {} ,
                { 'videoUrl': 'https://www.youtube.com/watch?v=heUd26tuinw' }
            ]});
            expect(sce.valueOf()).toBe('https://img.youtube.com/vi/heUd26tuinw/0.jpg');
        });
    });


    describe('getStats', function () {
        it('should return a result and then return a cached value', inject(function ($httpBackend, $timeout) {
            $httpBackend.expectGET('/backend/system/statistics').respond(200, { 'data': 'this is stats'});
            var stats = null;
            mLessonsService.getStats().then(function (result) {
                stats = result.data;
            });
            $httpBackend.flush();
            expect(stats.data).toBe('this is stats');

            // now lets test that we are getting cache
            stats = mLessonsService.getStats().then(function (result) {
                stats = result.data;
            });
            $timeout.flush();
            expect(stats.data).toBe('this is stats');
        }));

    });

    describe('copyLesson', function () {
        it('should send an http call', inject(function ($httpBackend) {

            $httpBackend.expectPOST('/backend/lessons/6/copy').respond(200, 'this is a copy');
            mLessonsService.copyLesson(6);
            $httpBackend.flush();

        }));
    });

    describe('deleteLesson', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectPOST('/backend/lessons/6/delete').respond(200, 'this is delete');
            mLessonsService.delete(6);
            $httpBackend.flush();
        }));
    });

    describe('overrideQuestion', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectPOST('/backend/lessons/6/question/3/override').respond(200, 'this is override');
            mLessonsService.overrideQuestion(6, 3);
            $httpBackend.flush();
        }));
    });


    describe('getAll', function () {
        it('should throw an error when queryObj is missing', function () {
            var error = null;
            try {
                mLessonsService.getAll();
            } catch (e) {
                error = e;
            }
            expect(error !== null).toBe(true);
        });

        it('should send an http call with query obj', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/lessons/get/all?query=%7B%7D').respond(200, { 'data': { 'data': [] } });
            mLessonsService.getAll({});
            $httpBackend.flush();
        }));
    });

    describe('create', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectPOST('/backend/lessons/create').respond(200, 'this is create');
            mLessonsService.create();
            $httpBackend.flush();
        }));
    });

    describe('getLessonsWhoUseThisQuestion', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/lessons/using/question/6').respond(200, 'this is search other lessons');
            mLessonsService.getLessonsWhoUseThisQuestion(6);
            $httpBackend.flush();
        }));
    });

    describe('getPermissions', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/lessons/4/permissions').respond(200, 'this is permissions');
            mLessonsService.getPermissions(4);
            $httpBackend.flush();
        }));
    });

    describe('update', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectPOST('/backend/lessons/4/update').respond(200, 'this is update');
            mLessonsService.update({ '_id': 4 });
            $httpBackend.flush();
        }));
    });

    describe('getLessonIntro', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/lessons/4/intro').respond(200, 'this is intro');
            mLessonsService.getLessonIntro(4);
            $httpBackend.flush();
        }));
    });

    describe('getPublicLessons', function () {
        it('should throw exception if queryObj does not exist', function () {

            var error = null;

            try {
                mLessonsService.getPublicLessons();
            } catch (e) {
                error = e;
            }

            expect(error !== null).toBe(true);

        });

        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/public/lessons?query=%7B%7D').respond(200, 'this is public lessons');
            mLessonsService.getPublicLessons({});
            $httpBackend.flush();
        }));
    });

    describe('getLessonById', function () {
        it('should send an http call', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/lessons/find?lessonsId=6').respond(200, 'this is lesson 6');
            mLessonsService.findLessonsById(6);
            $httpBackend.flush();
        }));
    });
});
