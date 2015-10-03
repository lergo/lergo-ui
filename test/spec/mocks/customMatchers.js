'use strict';
beforeEach(function() {
    var matchers = {
        toDisplay: function() {
            return this.actual.css('display') !== 'none';
        }
    };

    this.addMatchers(matchers);
});
