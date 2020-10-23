
'use strict';
angular.module('lergoApp').service('ShareService',
    function ShareService() {
        var classInviteeName = '';
        return {
            getInvitee: function () {
                return classInviteeName;
            },
            setInvitee: function(value) {
                classInviteeName = value;
            }
        };
    });