'use strict';
angular.module('lergoBackendMock', []).run(function($httpBackend){

    var supportedLanguages = [
        { 'id' : 'en', 'dir' : 'ltr' },
        { 'id' : 'he', 'dir' : 'rtl' },
        { 'id' : 'ru', 'dir' : 'ltr' },
        { 'id' : 'ar', 'dir' : 'rtl' }
    ];

    for ( var i = 0; i < supportedLanguages.length; i++){
        $httpBackend.whenGET('/backend/system/translations/' + supportedLanguages[i].id + '.json').respond({'angularjs': 'cool'});
    }

    $httpBackend.whenGET('/translations/general.json').respond({});
    $httpBackend.whenGET('/backend/system/statistics').respond({});
    $httpBackend.whenGET('/backend/user/loggedin').respond(200, '{}');
    $httpBackend.whenGET('/backend/public/lessons').respond(200, '{}');
    $httpBackend.whenGET('/backend/tags/filter').respond(200, '[]');


});