#!/usr/bin/env bash

TAG=$1
TAG=${TAG:-"v1"}

cd ./services/api-gateway
docker build -t risingstack/webinar-ms-api-gateway:latest -t risingstack/webinar-ms-api-gateway:$TAG .
docker push risingstack/webinar-ms-api-gateway

cd ../user-api
docker build -t risingstack/webinar-ms-user-api:latest -t risingstack/webinar-ms-user-api:$TAG .
docker push risingstack/webinar-ms-user-api

cd ../vehicle-api
docker build -t risingstack/webinar-ms-vehicle-api:latest -t risingstack/webinar-ms-vehicle-api:$TAG .
docker push risingstack/webinar-ms-vehicle-api
