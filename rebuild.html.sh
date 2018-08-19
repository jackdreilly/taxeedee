export CURDIR=`pwd`
cp -rf html /tmp/
cd /tmp/html
npm install
node_modules/webpack-cli/bin/cli.js --config webpack.config.js
cd $CURDIR
ln -s /tmp/html/dist/*.js html/html/
