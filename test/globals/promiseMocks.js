'use strict';
window.mockPromise = function(successResponse, errorResponse, reutrnValue ){
    return {
        then:function(success, error){
            if ( !!successResponse ){
                success(successResponse);
            }

            if (!!errorResponse ){
                error(errorResponse);
            }
            return reutrnValue;
        }
    };
};

