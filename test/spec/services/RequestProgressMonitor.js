'use strict';

describe('Service: RequestProgressMonitor', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var RequestProgressMonitor;
  beforeEach(inject(function (_RequestProgressMonitor_) {
    RequestProgressMonitor = _RequestProgressMonitor_;
  }));

  it('should do something', function () {
    expect(!!RequestProgressMonitor).toBe(true);
  });

});
