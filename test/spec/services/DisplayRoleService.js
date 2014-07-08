'use strict';

describe('Service: DisplayRoleService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var DisplayRoleService;
  beforeEach(inject(function (_DisplayRoleService_) {
    DisplayRoleService = _DisplayRoleService_;
  }));

  it('should do something', function () {
    expect(!!DisplayRoleService).toBe(true);
  });

});
