'use strict';

describe('Service: QuestionsService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var QuestionsService;
  beforeEach(inject(function (_QuestionsService_) {
    QuestionsService = _QuestionsService_;
  }));

  it('should do something', function () {
    expect(!!QuestionsService).toBe(true);
  });

});
