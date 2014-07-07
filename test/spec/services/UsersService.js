'use strict';

describe('Service: UsersService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var UsersService;
  beforeEach(inject(function (_UsersService_) {
    UsersService = _UsersService_;
  }));

  it('should do something', function () {
    expect(!!UsersService).toBe(true);
  });

});
