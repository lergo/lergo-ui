#!/bin/bash
set -e
echo 'access realstaging to perform upgrade'

pushd lergo-ri
    source ~/.nvm/nvm.sh
    nvm install
    npm install
popd

cd lergo-ri
echo 'pwd:'
pwd
# echo 'TESTME_KEY' $TESTME_KEY

echo 'creating file conf/dev/jeffkey4lergo.pem'
mkdir conf/dev && touch conf/dev/jeffkey4lergo.pem

echo 'decrypting jeffkey4lergo pem'

source build/decrypt_jeffkey4lergo_pem.sh

mkdir ~/.ssh && touch ~/.ssh/known_hosts
ssh-keyscan -H 52.28.226.213 >> ~/.ssh/known_hosts
export KEY_FILE=conf/dev/jeffkey4lergo.pem

echo 'accessing realstaging'
chmod 600 $KEY_FILE
ssh -i $KEY_FILE ubuntu@52.28.226.213 << EOF
echo 'inside realstaging'
sudo service lergo upgrade && sudo service lergo stop && sudo service lergo start
sudo service lergo status
exit
EOF
