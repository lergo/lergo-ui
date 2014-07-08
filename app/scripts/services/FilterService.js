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
	this.subjects = [ 'english', 'math', 'geometry', 'science', 'grammar', 'spelling', 'biology', 'chemistry', 'physics', 'history', 'geography', 'art', 'music', 'other' ];

	/**
	 * This function require ageRange and age to verify whether age is with in
	 * the range. return true if age is in the range, else return false
	 */
	this.filterByAge = function(age) {
		var filter=$rootScope.filter;
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
		var filter=$rootScope.filter;
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
		var filter=$rootScope.filter;
		if (!filter || !filter.language) {
			return true;
		}
		return language === filter.language;
	};

	this.filterBySubject = function(subject) {
		var filter=$rootScope.filter;
		if (!filter || !filter.subject) {
			return true;
		}
		return subject === filter.subject;
	};

});
