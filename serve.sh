PORT=$1

if [ -z $PORT ]; then
	PORT=8080
fi

npm install -d && $(npm bin)/bower install

./node_modules/.bin/serve -p $PORT
