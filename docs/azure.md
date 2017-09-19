# Getting Started With Azure Container Service

## 1. Creating Kubernetes Cluster

```sh
# Create a resource group
az group create --name webinar-microservices --location westeurope

# Provision a new Kubernetes cluster
az acs create --resource-group webinar-microservices --name my-services --generate-ssh-keys --orchestrator-type kubernetes

# Configure kubectl with the new cluster
az acs kubernetes get-credentials --resource-group webinar-microservices --name my-services --ssh-key-file ~/.ssh/id_rsa
```

## 2. Installing Helm chart

```sh
helm init --upgrade
helm install --name services ./helm
```

## 3. Accessing Application

```sh
kubectl port-forward $(kubectl get pods | grep api-gateway | head -1 | cut -f1 -d' ') 3000:3000
```

http://localhost:3000

## 4. Accessing Jaeger

```sh
kubectl port-forward $(kubectl get pods | grep jaeger-deployment | head -1 | cut -f1 -d' ') 16686:16686
```

http://localhost:16686
