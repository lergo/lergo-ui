'use strict';

angular.module('lergoApp').service('FilterService', function Filterservice($rootScope) {

	this.languages = [ {
		'id' : 'english',
		'locale' : 'en'
	}, {
		'id' : 'hebrew',
		'locale' : 'he'
	}, {
		'id' : 'arabic',
		'locale' : 'ar'
	}, {
		'id' : 'russian',
		'locale' : 'ru'
	}, {
		'id' : 'other',
		'locale' : 'en'
	} ];

	this.subjects = [ 'english', 'math', 'geometry', 'science', 'language', 'grammar', 'spelling', 'biology', 'chemistry', 'physics', 'history', 'geography', 'art', 'music', 'other' ];

	this.status = [ 'private', 'public' ];
	this.reportStatus = [ 'complete', 'incomplete' ];

	this.getLocaleByLanguage = function(id) {
		for ( var i = 0; i < this.languages.length; i++) {
			if (id === this.languages[i].id) {
				return this.languages[i].locale;
			}

		}
		return $rootScope.lergoLanguage;
	};

	this.getLanguageByLocale = function(locale) {
		for ( var i = 0; i < this.languages.length; i++) {
			if (locale === this.languages[i].locale) {
				return this.languages[i].id;
			}

		}
		return 'english';
	};

	this.filterByTags = function(tags) {
		var filter = $rootScope.filter;

		if (!filter || !filter.tags || filter.tags.length === 0) { // if filter
			// does not
			// have
			// tags, let
			// this
			// lesson
			// through
			return true;
		}

		if (!tags || tags.length === 0) { // if filter has tags, but lesson
			// doesn't, filter it
			// out.
			return false;
		}

		// make lesson tags a regexp.
		// if one of the filter tags don't match the regexp,
		// this means this lesson does not have a tag that exists on filter
		// and thus should be filtered out.
		var filterRegExp = new RegExp($.map(tags, function(item) {
			return item.label;
		}).join('|'), 'i');
		for ( var i = 0; i < filter.tags.length; i++) {
			if (!filter.tags[i].label.match(filterRegExp)) {
				return false;
			}
		}

		return true;
	};

	/**
	 * This function require ageRange and age to verify whether age is with in
	 * the range. return true if age is in the range, else return false
	 */
	this.filterByAge = function(age) {
		var filter = $rootScope.filter;
		if (!filter || !filter.ageRange || (!filter.ageRange.min && !filter.ageRange.max)) {
			return true;
		}
		if (!age) {
			return false;
		}
		if (filter.ageRange.min && age < filter.ageRange.min) {
			return false;
		}
		if (filter.ageRange.max && age > filter.ageRange.max) {
			return false;
		}
		return true;
	};

	this.filterByViews = function(views) {
		var filter = $rootScope.filter;
		if (!filter || !filter.views || (!filter.views.min && !filter.views.max)) {
			return true;
		}
		if (!views) {
			return false;
		}
		if (filter.views.min && views < filter.views.min) {
			return false;
		}
		if (filter.views.max && views > filter.views.max) {
			return false;
		}
		return true;
	};

	this.filterByLanguage = function(language) {
		var filter = $rootScope.filter;
		if (!filter || !filter.language) {
			return true;
		}
		return language === filter.language;
	};

	this.filterBySubject = function(subject) {
		var filter = $rootScope.filter;
		if (!filter || !filter.subject) {
			return true;
		}
		return subject === filter.subject;
	};

	this.filterByStatus = function(status) {
		var filter = $rootScope.filter;
		if (!filter || !filter.status) {
			return true;
		}
		if (filter.status === 'public') {
			return !!status;
		}
		return !status;
	};

	this.filterByUser = function(user) {
		var filter = $rootScope.filter;
		if (!filter || !filter.user || !user) {
			return true;
		}
		return user.indexOf(filter.user) === 0;
	};
	this.filterByInvitee = function(invitee) {
		var filter = $rootScope.filter;
		if (!filter || !filter.invitee || !invitee) {
			return true;
		}
		if (filter.invitee === invitee) {
			return true;
		}
		return false;
	};

	this.filterByCorrectPercentage = function(correctPercentage) {
		var filter = $rootScope.filter;
		if (!filter || !filter.correctPercentage || (!filter.correctPercentage.min && !filter.correctPercentage.max)) {
			return true;
		}
		if (!correctPercentage) {
			return false;
		}
		if (filter.correctPercentage.min && correctPercentage < filter.correctPercentage.min) {
			return false;
		}
		if (filter.correctPercentage.max && correctPercentage > filter.correctPercentage.max) {
			return false;
		}
		return true;
	};

	this.filterByDuration = function(duration) {
		var filter = $rootScope.filter;
		if (!filter || !filter.duration || (!filter.duration.min && !filter.duration.max)) {
			return true;
		}
		if (filter.duration.min && duration < filter.duration.min * 1000) {
			return false;
		}
		if (filter.duration.max && duration > filter.duration.max * 1000) {
			return false;
		}
		return true;
	};

	this.filterByReportStatus = function(isFinished) {
		var filter = $rootScope.filter;
		if (!filter || !filter.reportStatus) {
			return true;
		}
		if (filter.reportStatus === 'complete') {
			return !!isFinished;
		}
		return !isFinished;
	};
});
