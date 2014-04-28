'use strict';

describe('Service: LessonsService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var LessonsService;
  beforeEach(inject(function (_LessonsService_) {
    LessonsService = _LessonsService_;
  }));

  it('should do something', function () {
    expect(!!LessonsService).toBe(true);
  });

});
