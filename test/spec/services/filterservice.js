'use strict';

describe('Service: Filterservice', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var Filterservice;
  beforeEach(inject(function (_Filterservice_) {
    Filterservice = _Filterservice_;
  }));

  it('should do something', function () {
    expect(!!Filterservice).toBe(true);
  });

});
