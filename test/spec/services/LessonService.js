'use strict';

describe('Service: LessonService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var LessonService;
  beforeEach(inject(function (_LessonService_) {
    LessonService = _LessonService_;
  }));

  it('should do something', function () {
    expect(!!LessonService).toBe(true);
  });

});
