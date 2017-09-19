# Getting Started With Azure Container Service

## 1. Creating Kubernetes Cluster

```sh
# Create a resource group
az group create --name webinar-microservices --location westeurope

# Provision a new Kubernetes cluster
az acs create --resource-group webinar-microservices --name my-services --generate-ssh-keys --orchestrator-type kubernetes

# Configure kubectl with the new cluster
az acs kubernetes get-credentials --resource-group webinar-microservices --name my-services
```

## 2. Installing Helm chart

```sh
helm init
helm install --name services --set ./helm
```

## 3. Accessing application

```sh
kubectl proxy
```

http://localhost:8001/api/v1/proxy/namespaces/default/services/api-gateway
http://localhost:8001/api/v1/proxy/namespaces/default/services/jaeger-query
