'use strict';
window.mockPromise = function(successResponse, errorResponse){
    return {
        then:function(success, error){
            if ( !!successResponse ){
                success(successResponse);
            }

            if (!!errorResponse ){
                error(errorResponse);
            }
        }
    };
};

