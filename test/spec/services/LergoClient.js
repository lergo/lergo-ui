'use strict';

describe('Service: LergoClient', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var LergoClient;
  beforeEach(inject(function (_LergoClient_) {
    LergoClient = _LergoClient_;
  }));

  it('should do something', function () {
    expect(!!LergoClient).toBe(true);
  });

});
