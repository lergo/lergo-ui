'use strict';

window.mapWatchers = function( scope ) {
    var watchers = {};
    _.each(scope.$$watchers, function (w) {
        watchers[w.fn.name] = w.fn;
    });
    return watchers;
};
