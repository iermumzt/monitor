#/bin/sh

str=$1

echo $str

java -jar sfnttool.jar -w -s ""$str fzltxh.TTF fzltxh.woff
java -jar sfnttool.jar -w -s ""$str fzltxh.TTF fzltxh.eot

mv fzltxh.woff fzltxh.eot /data/projects/iermu_aliyun/app/public/font/