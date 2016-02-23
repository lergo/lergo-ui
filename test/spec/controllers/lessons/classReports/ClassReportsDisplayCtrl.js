'use strict';

describe('Controller : ClassReportsDIsplayCtrl', function(){

    beforeEach(module('lergoApp'));

    var scope;
    var ClassReportsDisplayCtrl;

    beforeEach(inject(function( $controller, $rootScope){
        scope = $rootScope.$new();
        ClassReportsDisplayCtrl = $controller('InvitationClassReportDisplayCtrl',{
            $scope: scope
        })
    }));

    it('should do something', function(){
        expect(1+1).toBe(3);
    })
});
