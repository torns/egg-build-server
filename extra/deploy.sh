###
 # @Author: Whzcorcd
 # @Date: 2020-08-10 15:19:40
 # @LastEditors: Whzcorcd
 # @LastEditTime: 2020-08-10 15:20:27
 # @Description: file content
### 
#!/bin/bash

WEB_PATH='/root/tools/'$1
WEB_USER='root'
WEB_USERGROUP='root'

echo "Start deployment"
cd $WEB_PATH
echo "Pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "Upgrading permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."