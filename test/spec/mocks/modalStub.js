'use strict';

angular.module('lergoApp').service('$uibModal', function(){
    this.open = function(){
        return {
            result: {
                then:function(){}
            }
        };
    };
});

angular.module('lergoApp').service('$uibModalInstance', function(){
    this.close = function(){};
    this.dismiss = function(){};
});
