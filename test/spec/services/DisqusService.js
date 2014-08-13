'use strict';

describe('Service: DisqusService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var DisqusService;
  beforeEach(inject(function (_DisqusService_) {
    DisqusService = _DisqusService_;
  }));

  it('should do something', function () {
    expect(!!DisqusService).toBe(true);
  });

});
