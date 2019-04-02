#!/bin/bash
set -e
echo build lergo-ui
cd lergo-ui
source ~/.nvm/nvm.sh
nvm install
npm install -g grunt-cli
grunt

COMMITS_TEMPLATE=dist/views/version/_commits.html
VERSION_TEMPLATE=dist/views/version/_version.html

echo "<h1>UI</h1>" > $COMMITS_TEMPLATE
git log  --abbrev=30 --pretty=format:"%h|%an|%ar|%s" -10 >> $COMMITS_TEMPLATE
echo "<h1>BACKEND</h1>" >> $COMMITS_TEMPLATE
cd ..
cd lergo-ri
git log  --abbrev=30 --pretty=format:"%h|%an|%ar|%s" -10 >> ../lergo-ui/$COMMITS_TEMPLATE
cd ..
cd lergo-ui
echo '****************************************************************************************the build number is ' $CI_BUILD_ID
echo 'CI string time' $CI_STRING_TIME
echo "Build Number : $BUILD_NUMBER <br/> Build ID : $BUILD_ID <br/> Build Name : $BUILD_DISPLAY_NAME <br/> Job Name : $JOB_NAME <br/> Build Tag : $BUILD_TAG <br/>" > $VERSION_TEMPLATE


cd dist
npm install --production
npm pack
