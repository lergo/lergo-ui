'use strict';

describe('Service: ContinuousSave', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var ContinuousSave;
  beforeEach(inject(function (_ContinuousSave_) {
    ContinuousSave = _ContinuousSave_;
  }));

  it('should do something', function () {
    expect(!!ContinuousSave).toBe(true);
  });

});
