WEB3_HOST=${WEB3_HOST:-localhost}
WEB3_PORT=${WEB3_PORT:-8545}
WEB3_URL=${WEB3_URL:-http://$WEB3_HOST:$WEB3_PORT}

echo "Wait until web3 is ready..."
until nc -z ${WEB3_HOST} ${WEB3_PORT}
do
    sleep 1
done

sleep 2

echo "Starting app"
./central.js all
node index.js