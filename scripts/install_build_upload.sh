#!/bin/bash
set -e
echo install lergo-ui
cd lergo-ui
source ~/.nvm/nvm.sh
nvm install
npm install
./node_modules/.bin/bower --allow-root --config.interactive=false install


echo 'build lergo-ui'
npm install -g grunt-cli
grunt

echo get the next build number from build-tracker
aws s3 cp s3://lergo-build-number-tracker/build-tracker.txt build-tracker.txt
CURRENT_BUILD_ID=`cat build-tracker.txt`

echo checking current build number,  $CURRENT_BUILD_ID  is an integer
if [[ ! "$CURRENT_BUILD_ID" =~ ^[0-9]+$ ]]; then 
  exit 1
fi

echo  aws access keys: $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY

export BUILD_NUMBER=$((CURRENT_BUILD_ID + 1))
echo $BUILD_NUMBER > build-tracker.txt

echo upload indexed build number to s3
aws s3 cp build-tracker.txt s3://lergo-build-number-tracker/build-tracker.txt 

echo previous build number was $CURRENT_BUILD_ID and current build id is now $BUILD_NUMBER

export BUILD_ID=${CI_STRING_TIME:-local-build-id};
export BUILD_DISPLAY_NAME=$hash${CI_COMMIT_ID:-local-build-id};
export BUILD_TAG=CI_Build;


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

echo "Build Number : $BUILD_NUMBER <br/> Build ID : $BUILD_ID <br/> Build Name : $BUILD_DISPLAY_NAME <br/> Job Name : $JOB_NAME <br/> Build Tag : $BUILD_TAG <br/>" > $VERSION_TEMPLATE


cd dist
npm install --production
npm pack

cd ../..

echo
echo upload_artifacts
echo



export ARTIFACTS_HOME=`pwd`/artifacts/
mkdir -p $ARTIFACTS_HOME

pushd lergo-ri
   nvm use
popd

set -e

echo $BUILD_NUMBER > build.id


\cp -f lergo-ri/dist/*.tgz $ARTIFACTS_HOME
\cp -f lergo-ui/dist/*.tgz $ARTIFACTS_HOME
\cp -f build.id $ARTIFACTS_HOME
\cp -f lergo-ri/build/install.sh $ARTIFACTS_HOME

echo pwd

pushd lergo-ri/build/vagrant/synced_folder/tasks
ls -ll $ARTIFACTS_HOME

# echo 'AWS_ACCESS_KEY_ID' $AWS_ACCESS_KEY_ID

  grunt s3:uploadArtifacts
  grunt s3:uploadArtifactsLatest
popd
