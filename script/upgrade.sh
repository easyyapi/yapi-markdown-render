#!/bin/sh
#

head=`git rev-parse HEAD`
echo "current head:$head"
git fetch origin
git checkout master
git reset  --hard origin/master
git pull
new_head=`git rev-parse HEAD`
echo "update to:$new_head"