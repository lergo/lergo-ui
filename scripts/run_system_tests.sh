#!/bin/bash
echo build lergo-protractor-tests
cd lergo-protractor-tests
source ~/.nvm/nvm.sh
nvm use

set -e

export PROVISION_LOG_FILE="/dev/null"
export DEPLOY_BASE="/root/lergo"

mkdir -p $DEPLOY_BASE

 print(){
    echo -e "\e[95m$1\e[0m"
}

export DIRECT_CONNECT=true
export BROWSER_NAME=headlessChrome
export LERGO_ME_CONF="`pwd`/build/vagrant/synced_folder/config.json"

echo LERGO_ME_CONF = $LERGO_ME_CONF

service mongodb start
service mongodb status

mongo lergo-test < build/vagrant/synced_folder/test_data.js > $PROVISION_LOG_FILE

\cp -f  ../lergo-build/scripts/lergo.nginx /etc/nginx/sites-enabled/lergo.conf
service nginx restart

mkdir -p $DEPLOY_BASE/lergo-ri
tar -xzf ../lergo-ri/dist/*.tgz -C $DEPLOY_BASE/lergo-ri

nohup node $DEPLOY_BASE/lergo-ri/package/server.js &> $PROVISION_LOG_FILE &
# node $DEPLOY_BASE/lergo-ri/package/server.js

mkdir -p /var/www/lergo-ui
tar -xzf ../lergo-ui/dist/*.tgz -C /var/www/lergo-ui

useradd -s /bin/false nginx
chown nginx:nginx /var/www/lergo-ui/package -R
ls -ll /var/www/lergo-ui/package

./node_modules/.bin/webdriver-manager update

apt install curl -y
curl http://localhost:1616

./node_modules/.bin/grunt directTest
