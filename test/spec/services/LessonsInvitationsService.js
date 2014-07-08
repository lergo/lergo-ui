'use strict';

describe('Service: LessonsInvitationsService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var LessonsInvitationsService;
  beforeEach(inject(function (_LessonsInvitationsService_) {
    LessonsInvitationsService = _LessonsInvitationsService_;
  }));

  it('should do something', function () {
    expect(!!LessonsInvitationsService).toBe(true);
  });

});
