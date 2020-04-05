'use strict';
angular.module('lergoBackendMock', []).run(function($httpBackend){

    $httpBackend.whenGET('/backend/system/translations/angular-translate.json?lang=general').respond(200,{});
    $httpBackend.whenGET('/backend/system/translations/angular-translate.json?lang=en').respond(200,{});
    $httpBackend.whenGET('/backend/system/statistics').respond({});
    $httpBackend.whenGET('/backend/user/loggedin').respond(200, '{}');
    $httpBackend.whenGET('/backend/public/lessons').respond(200, '{}');
    $httpBackend.whenGET('/backend/tags/filter').respond(200, '[]');
    $httpBackend.whenGET('/backend/reports/students').respond(200, '[]');
    $httpBackend.whenGET('/backend/users/usernames').respond(200, '[]');
    $httpBackend.whenGET('/backend/helpercontents?query=%7B%7D').respond(200, '[]');
    $httpBackend.whenGET('/backend/helpercontents?query=%7B%22locale%22:%22en%22%7D').respond(200, '[]');
    $httpBackend.whenGET('/backend/public/lessons?query=%7B%22filter%22:%7B%22public%22:%7B%22$exists%22:1%7D%7D,%22limit%22:0,%22projection%22:%7B%22userId%22:1,%22username%22:1,%22_id%22:0%7D%7D').respond(200, '[]');

    $httpBackend.whenGET('/backend/system/errors').respond(200,'[]');
    $httpBackend.whenGET('/backend/roles?query=%7B%22projection%22:%7B%22_id%22:1,%22name%22:1%7D%7D').respond(200,'[]');
    $httpBackend.whenGET('/backend/user/permissions').respond(200,'[]');


});
