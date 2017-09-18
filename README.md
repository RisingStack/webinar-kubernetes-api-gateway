# Microservices​ ​with​ ​Node.js​ ​and​ ​Kubernetes​

## Start

### Kubernetes

#### 1. Building Docker image

Installing [Minikube](https://github.com/kubernetes/minikube) and [Helm](https://github.com/kubernetes/helm)

```sh
brew install kubernetes-helm
brew cask install minikube
```

Re-using local Docker daemon with minikube:

```sh
eval $(minikube docker-env)
```

Building Docker image:

```sh
./scripts/docker-build.sh
```

#### 2. Installing Helm chart

```sh
helm init
helm install --name services ./helm
```

#### 3. Accessing application

```sh
minikube service api-gateway
minikube service jaeger-query
```

### Local

```sh
docker-compose build
docker-compose up
```

http://localhost:3000/docs

## Docs

http://localhost:3000/docs

![Swagger API Gateway](images/swagger_api_gateway)

## Distributed Tracing

http://localhost:16686

![Distributed Tracing](images/tracing_output.png)
