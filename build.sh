#!/bin/bash

basepath=$(cd `dirname $0`; pwd)
echo "base path is $basepath";

function check_result(){
  if [ "$1" != "0" ]
  then
    echo "something is wrong, exit.";
    exit 2;
  fi
}

echo "----------------";
echo "start build";

currenttime=`date +%s`
currentMode="test"
currentServer="8004"

if [ "$1" == "release" ]
then
  currentMode="production"
  currentServer='80'
fi
if [ "$2" != "" ]
then 
  currentServer=$2
fi

cd $basepath/tools/deploy
cnpm install
grunt --deploy=$currentMode --server=$currentServer
check_result $?

echo "----------------";
echo "start bootstrap";
cd $basepath/tools/bootstrap
cnpm install
grunt dist
check_result $?

echo "----------------";
echo "build done";
echo "----------------";
