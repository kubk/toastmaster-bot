#!/bin/bash

ssh ec2 -A "cd /var/www/toastmaster-bot \
            && git fetch origin master \
            && git reset --hard origin/master \
            && npm i \
            && npm run start:prod"

