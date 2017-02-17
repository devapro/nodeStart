# Node Start Kit
NodeJS start template


download this repository

cd ./project
npm i
cd ./public
bower i

select angular.js 1.5.0

run script for add default users:

node ./migrations/init_users.js

run app:
node ./bin/start

config:

./config.json

./config_prod.json

for use config_prod.json:

NODE_ENV=production node ./bin/start