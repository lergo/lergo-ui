'use strict';

describe('Service: AdminClientService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var AdminClientService;
  beforeEach(inject(function (_AdminClientService_) {
    AdminClientService = _AdminClientService_;
  }));

  it('should do something', function () {
    expect(!!AdminClientService).toBe(true);
  });

});
