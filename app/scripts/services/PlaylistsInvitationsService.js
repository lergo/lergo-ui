'use strict'; 

angular.module('lergoApp').service('PlaylistsInvitationsService', function PlaylistsInvitationsService($http) {

    /**
     *
     * @param {string} playlistId
     * @param {object} invitation
     * @param {object} invitation.invitee
     * @param {string} invitation.invitee.name
     * @returns {*}
     */
	this.create = function(playlistId, invitation) {
		return $http.post('/backend/playlists/' + playlistId + '/invitations/create', invitation);
	};

	this.createAnonymous = function(playlistId) {
		return $http.post('/backend/playlists/' + playlistId + '/invitations/create');
	};

	this.build = function(invitationId, constructPlaylist, forceConstruct) {
		return $http({
			url : '/backend/playlistsinvitations/' + invitationId + '/build',
			method : 'GET',
			params : {
				construct : constructPlaylist,
				forceConstruct : forceConstruct
			}
		});

	};
	this.update = function(invitation) {
		return $http.post('/backend/invitations/' + invitation._id + '/update', invitation);
	};

    this.getLink = function(invitation){
        return window.location.origin + '/index.html#!/public/playlists/' + invitation.playlistId + '/intro?invitationId=' + invitation._id;
    };

    this.get = function( invitationId ){
        return $http.get('/backend/invitations/' + invitationId + '/get' );
    };

    this.getByPin = function( pin ){
        return $http.get('/backend/invitations/pin/' + pin );
    };

	this.remove = function(invitation) {
		return $http.post('/backend/invitations/' + invitation._id + '/delete');
	};

    this.getStudents = function(){
        return $http.get('/backend/playlistsinvitations/students');
    };

    this.getClasses = function(){
        return $http.get('/backend/playlistsinvitations/classes');
    };

});
