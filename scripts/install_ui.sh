#!/bin/bash
set -e
echo ----------------------------------------- install lergo-ui
cd lergo-ui
source ~/.nvm/nvm.sh
nvm install
npm install
./node_modules/.bin/bower --allow-root --config.interactive=false install


echo ------------------------------------------ build lergo-ui
npm install -g grunt-cli
grunt

hash='#';


export BUILD_NUMBER=${CI_BUILD_ID:-local-build-id};
export BUILD_ID=${CI_STRING_TIME:-local-build-id};
export BUILD_DISPLAY_NAME=$hash${CI_BUILD_ID:-local-build-id};
#export JOB_NAME=${CI_JOB_NAME:-local-job-name};
export BUILD_TAG=CI Build;


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
echo '----------------------------------------- the build number is ' $CI_BUILD_ID
echo 'CI string time' $CI_STRING_TIME
echo "Build Number : $BUILD_NUMBER <br/> Build ID : $BUILD_ID <br/> Build Name : $BUILD_DISPLAY_NAME <br/> Job Name : $JOB_NAME <br/> Build Tag : $BUILD_TAG <br/>" > $VERSION_TEMPLATE


cd dist
npm install --production
npm pack

cd ../..

echo
echo -------------------------------------------- upload_artifacts
echo



export ARTIFACTS_HOME=`pwd`/artifacts/
mkdir -p $ARTIFACTS_HOME

pushd lergo-ri
   nvm use
popd

set -e

echo $CI_BUILD_ID > build.id


\cp -f lergo-ri/dist/*.tgz $ARTIFACTS_HOME
\cp -f lergo-ui/dist/*.tgz $ARTIFACTS_HOME
\cp -f build.id $ARTIFACTS_HOME
\cp -f lergo-ri/build/install.sh $ARTIFACTS_HOME

echo pwd

pushd lergo-ri/build/vagrant/synced_folder/tasks
ls -ll $ARTIFACTS_HOME
echo
echo 'CI_BUILD_ID' $CI_BUILD_ID

echo
echo 'AWS_ACCESS_KEY_ID' $AWS_ACCESS_KEY_ID
echo

sed -i 's/lergo-backups/lergopro-backups/g' Gruntfile.js
sed -i 's/process.env.JOB_NAME/"build-lergopro"/g' Gruntfile.js

  grunt s3:uploadArtifacts
  grunt s3:uploadArtifactsLatest
popd

