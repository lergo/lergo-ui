'use strict';

window.mapWatchers = function( scope ) {
    var watchers = {};
    _.each(scope.$$watchers, function (w) {
        watchers[w.fn.name] = w.fn;
    });
    return watchers;
};

window.mapListeners = function( scope ) {
    var result = {};

    _.each(scope.$$listeners, function (w) {
        _.each(w, function(item){
            if ( item ) {
                result[item.name] = item;
            }
        });
    });
    return result;
};
