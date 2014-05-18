'use strict';

describe('Service: RequestProgressInterceptor', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var RequestProgressInterceptor;
  beforeEach(inject(function (_RequestProgressInterceptor_) {
    RequestProgressInterceptor = _RequestProgressInterceptor_;
  }));

  it('should do something', function () {
    expect(!!RequestProgressInterceptor).toBe(true);
  });

});
