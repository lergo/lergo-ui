'use strict';

describe('Service: admin/LessonsService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var admin/LessonsService;
  beforeEach(inject(function (_admin/LessonsService_) {
    admin/LessonsService = _admin/LessonsService_;
  }));

  it('should do something', function () {
    expect(!!admin/LessonsService).toBe(true);
  });

});
