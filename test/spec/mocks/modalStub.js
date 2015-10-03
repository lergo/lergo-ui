'use strict';

angular.module('lergoApp').service('$modal', function(){
    this.open = function(){
        return {
            result: {
                then:function(){}
            }
        };
    };
});

angular.module('lergoApp').service('$modalInstance', function(){
    this.close = function(){};
    this.dismiss = function(){};
});
