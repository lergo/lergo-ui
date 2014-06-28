'use strict';

angular.module('lergoApp').service(
		'FilterService',
		function Filterservice() {
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
				return 'en';
			};
			this.subjects = [ 'english', 'math','geometry', 'science', 'grammar', 'spelling', 'biology', 'chemistry', 'physics', 'history', 'geography', 'art',
					'music', 'other' ];

			/**
			 * This function require ageRange and age to verify whether age is
			 * with in the range. return true if age is in the range, else
			 * return false
			 */
			this.filterByAge = function(filter, age) {
				if (!filter.ageRange || (!filter.ageRange.min && !filter.ageRange.max)) {
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

			this.filterByViews = function(filter, age) {
				if (!filter.views || (!filter.views.min && !filter.views.max)) {
					return true;
				}
				if (!age) {
					return false;
				}
				if (filter.views.min && age < filter.views.min) {
					return false;
				}
				if (filter.views.max && age > filter.views.max) {
					return false;
				}
				return true;
			};

			this.filterByLanguage = function(filter, language) {
				if (!filter.language) {
					return true;
				}
				return language === filter.language;
			};

			this.filterBySubject = function(filter, subject) {
				if (!filter.subject) {
					return true;
				}
				return subject === filter.subject;
			};

		});
