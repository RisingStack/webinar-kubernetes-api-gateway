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

For more information check out the official [Azure Container Service with Kubernetes Documentation](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/).

## 2. Installing Helm chart

Azure Container Services comes with a pre-installed helm tiller.  
You should be sure that your local helm matches the version of the server: `helm version`

```sh
helm init
helm install --name services ./helm
```

You can expose the `api-gateway` service via `LoadBalancer`:

```sh
helm upgrade services ./helm/ --set api-gateway.public=true
```

To read more about helm check out the [Packing a Kubernetes Microservices App with Helm on Azure Container Service](https://open.microsoft.com/2017/05/23/kubernetes-helm-microsoft-azure-container-service/) article.

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
