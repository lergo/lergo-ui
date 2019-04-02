#!/bin/bash
echo build lergo-ri
cd lergo-ri/build/vagrant/synced_folder/tasks
source ~/.nvm/nvm.sh
nvm install


set -e
npm install
