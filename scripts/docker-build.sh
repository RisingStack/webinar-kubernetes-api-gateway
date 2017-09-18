#!/usr/bin/env bash

cd ./services/api-gateway
docker build -t services/api-gateway:v1 .

cd ../user-api
docker build -t services/user-api:v1 .

cd ../vehicle-api
docker build -t services/vehicle-api:v1 .
