#!/usr/bin/env bash

cd ./services/api-gateway
docker build -t services/api-gateway:v2 .

cd ../user-api
docker build -t services/user-api:v2 .

cd ../vehicle-api
docker build -t services/vehicle-api:v2 .
