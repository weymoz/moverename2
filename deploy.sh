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
if [ "$1" == "full" ]; then
  echo "performing full deployment"
  ssh hetz << 'ENDSSH'
PATH="/home/alul/.nvm/versions/node/v10.16.0/bin:$PATH"

RENAME_BASE_DIR=/fo/fj
rm -r $RENAME_BASE_DIR/scr/node
mkdir $RENAME_BASE_DIR/scr/node
tar xf ~/rename.tar.gz -C $RENAME_BASE_DIR/scr/node
cd $RENAME_BASE_DIR/scr/node
npm install --production

RENAME_BASE_DIR=/fo2/fj
rm -r $RENAME_BASE_DIR/scr/node
mkdir $RENAME_BASE_DIR/scr/node
tar xf ~/rename.tar.gz -C $RENAME_BASE_DIR/scr/node
cd $RENAME_BASE_DIR/scr/node
npm install --production

RENAME_BASE_DIR=/fo3/fj
rm -r $RENAME_BASE_DIR/scr/node
mkdir $RENAME_BASE_DIR/scr/node
tar xf ~/rename.tar.gz -C $RENAME_BASE_DIR/scr/node
cd $RENAME_BASE_DIR/scr/node
npm install --production

RENAME_BASE_DIR=/fo4/fj
rm -r $RENAME_BASE_DIR/scr/node
mkdir $RENAME_BASE_DIR/scr/node
tar xf ~/rename.tar.gz -C $RENAME_BASE_DIR/scr/node
cd $RENAME_BASE_DIR/scr/node
npm install --production

RENAME_BASE_DIR=/fo5/fj
rm -r $RENAME_BASE_DIR/scr/node
mkdir $RENAME_BASE_DIR/scr/node
tar xf ~/rename.tar.gz -C $RENAME_BASE_DIR/scr/node
cd $RENAME_BASE_DIR/scr/node
npm install --production

rm -rf ~/rename.tar.gz
ENDSSH

else 

  echo "performing test deployment"
  ssh hetz << 'ENDSSH'
PATH="/home/alul/.nvm/versions/node/v10.16.0/bin:$PATH"
RENAME_BASE_DIR=/fo2/fj
rm -r $RENAME_BASE_DIR/scr/node
mkdir $RENAME_BASE_DIR/scr/node
tar xf rename.tar.gz -C $RENAME_BASE_DIR/scr/node
rm ./rename.tar.gz
cd $RENAME_BASE_DIR/scr/node
npm install --production
ENDSSH
fi
