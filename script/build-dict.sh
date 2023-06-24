#!/bin/bash
node ./script/build-dict.js $1 $2 /tmp/dict.json
echo 'export const raw = ' > ./src/dict.js
cat /tmp/dict.json >> ./src/dict.js
