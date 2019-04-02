#!/bin/bash
echo build lergo-ri
cd lergo-ri
source ~/.nvm/nvm.sh
nvm use

set -e

./node_modules/.bin/grunt  clean:dist jshint jsdoc copy bundledDependencies
cd dist
npm install --production
npm pack
