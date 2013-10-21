'use strict';

describe('Filter: i18n', function () {

  // load the filter's module
  beforeEach(module('lergoApp'));

  // initialize a new instance of the filter before each test
  var i18n;
  var httpMock;
  beforeEach(inject(function ($filter, $httpBackend) {
      try{
          httpMock = $httpBackend;
          httpMock.expectGET('/translations/en.json').respond({'angularjs':'cool'});
          httpMock.expectGET('/translations/he.json').respond({'angularjs':'מגניב'});
          i18n = $filter('i18n');
          httpMock.flush();
      }catch(e){ console.log( "got error while injecting " + e.message ); }


  }));

  it('should return "cool"', function () {
    var text = 'angularjs';
    expect(i18n(text)).toBe('cool');
  });

});
