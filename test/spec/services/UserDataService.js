'use strict';

describe('Service: UserDataService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var UserDataService;
  beforeEach(inject(function (_UserDataService_) {
    UserDataService = _UserDataService_;
  }));

  it('should do something', function () {
    expect(!!UserDataService).toBe(true);
  });

});
