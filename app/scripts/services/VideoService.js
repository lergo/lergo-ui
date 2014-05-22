'use strict';

angular.module('lergoApp').service('VideoService', function VideoService() {
	this.getMedia = function(url) {
		var media = {};
		if (url.match('http|https://(www.)?youtube|youtu.be')) {
			media.type = 'youtube';
			if (url.match('embed')) {
				media.id = url.split(/embed\//)[1].split('"')[0];
			} else {
				media.id = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
			}
			return media;
		} else if (url.match('http://(player.)?vimeo.com')) {
			media.id = url.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
			media.type = 'vimeo';
			return media;
		}
		return null;
	};
});
