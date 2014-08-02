'use strict';

describe('Service: QuestionsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mQuestionsService;
    beforeEach(inject(function (QuestionsService) {
        mQuestionsService = QuestionsService;
    }));

    it('should do something', function () {
        expect(!!mQuestionsService).toBe(true);
    });

});
