#!/bin/bash

echo build lergo-ri
cd lergo-ri
source ~/.nvm/nvm.sh
nvm install
echo decoding me.conf
mkdir -p conf/dev
echo TESTME_KEY=$TESTME_KEY

set -e
openssl aes-256-cbc -d -a -in ../lergo-build/scripts/testMe.json.enc -out conf/dev/me.json -pass pass:$TESTME_KEY
./node_modules/.bin/grunt testBefore
./node_modules/.bin/grunt
./node_modules/.bin/grunt testAfter
