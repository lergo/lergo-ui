'use strict';

describe('Service: LergoResourceLinksConverter', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var LergoResourceLinksConverter;
    beforeEach(inject(function (_LergoResourceLinksConverter_) {
        LergoResourceLinksConverter = _LergoResourceLinksConverter_;
    }));

    describe('#convert', function () {
        it('should convert google drive links', function () {
            expect(LergoResourceLinksConverter.convert('https://drive.google.com/file/d/0B48m4oFFlf9IUVZueFA4VVg5Ym8/view?usp=sharing')).toBe('https://drive.google.com/uc?export=view&id=0B48m4oFFlf9IUVZueFA4VVg5Ym8');
            expect(LergoResourceLinksConverter.convert('https://drive.google.com/open?id=0B48m4oFFlf9IV3BVelpGUlp4bG8')).toBe('https://drive.google.com/uc?export=view&id=0B48m4oFFlf9IV3BVelpGUlp4bG8');
        });

        it('should leave link as is if no conversion defined', function () {
            expect(LergoResourceLinksConverter.convert('foo')).toBe('foo');
        });
    });

});
