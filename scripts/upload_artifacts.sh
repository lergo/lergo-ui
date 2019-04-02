#!/bin/bash


source ~/.nvm/nvm.sh
export ARTIFACTS_HOME=`pwd`/artifacts/
mkdir -p $ARTIFACTS_HOME

pushd lergo-ri
   nvm use
popd

set -e

echo $CI_BUILD_ID > build.id

export BUILD_NUMBER=${CI_BUILD_ID:-local-build-id};
export JOB_NAME=${CI_JOB_NAME:-local-job-name};

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
#  grunt s3:uploadArtifactsLatest
popd
