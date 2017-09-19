# Getting Started With Minikube

## 1. Building Docker image

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

## 2. Installing Helm chart

```sh
helm init
helm install --name services ./helm
```

## 3. Accessing Application

```sh
minikube service api-gateway
minikube service jaeger-query
```

## Troubleshooting

### Failing probes on minikube

See: https://github.com/kubernetes/minikube/issues/999
