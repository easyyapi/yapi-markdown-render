#!/bin/sh
#

head=`git rev-parse HEAD`
echo $head
git checkout .
git checkout master
git reset --hard ${head}
git reset --soft 93aa307945b0470064dc0209503ef001882f5134
git add .
git commit -m "deploy"
git push --set-upstream origin master
git push -f