'use strict';

angular.module('lergoApp').service('FilterService', function Filterservice() {
	this.languages = [ 'english', 'hebrew', 'arabic', 'russian', 'other', ];
	this.subjects = [ 'english', 'math', 'science', 'grammar', 'spelling', 'biology', 'other' ];
});
