mkdir ./dist

cp ./src/config.js \
  ./src/helpers.js \
  ./src/rename.js \
  ./src/task-runner.js \
  ./src/start.sh \
  ./package.json \
  ./package-lock.json dist

cd ./dist 

tar czf rename.tar.gz \
  ./config.js \
  ./helpers.js \
  ./rename.js \
  ./task-runner.js \
  ./start.sh \
  ./package.json \
  ./package-lock.json


scp rename.tar.gz hetz:~

rm -r ../dist

ssh hetz << 'ENDSSH'
PATH="/home/alul/.nvm/versions/node/v10.16.0/bin:$PATH"
rm -r /fo2/fj/scr/node
mkdir /fo2/fj/scr/node
tar xf rename.tar.gz -C /fo2/fj/scr/node
rm ./rename.tar.gz
cd /fo2/fj/scr/node
npm install --production
ENDSSH

