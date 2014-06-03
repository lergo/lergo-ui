'use strict';

angular.module('lergoApp').service('FilterService', function Filterservice() {
	this.languages = [ 'english', 'hebrew', 'arabic', 'russian', 'other', ];
	this.subjects = [ 'english', 'math', 'science', 'grammar', 'spelling', 'biology', 'other' ];
	this.ageRanges = [ {
		"id" : "4-7",
		'min' : 4,
		'max' : 7
	}, {
		"id" : "8-11",
		'min' : 8,
		'max' : 11
	}, {
		"id" : "12-15",
		'min' : 12,
		'max' : 15
	}, {
		"id" : "16+",
		'min' : 16,
		'max' : 100
	} ];

	this.getAgeRangeFilterById = function (id) {
		for ( var i = 0; i < this.ageRanges.length; i++) {
			if (id === this.ageRanges[i].id) {
				return this.ageRanges[i];
			}

		}
		throw new Error('Age Range ' + id + ' is unsupported ');
	};
	/**
	 * This function require ageRange Id and age to verify that the age false
	 * with in the range return true if age is in the range else return false
	 */
	this.filterByAge = function(id, age) {
		if (!age) {
			return false;
		}
		var range = this.getAgeRangeFilterById(id);
		if (!range) {
			return false;
		} else if (age < range.min) {
			return false;
		} else if (age > range.max) {
			return false;
		}
		return true;
	};
});
