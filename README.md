# Run Chat App on Kubernetes

## Prerequisites

1. Docker Desktop with Kubernetes enabled (Settings → Kubernetes)
2. kubectl installed
3. Build images:

```bash
docker build -t chat-server:latest ./Back
docker build -t chat-client:latest ./Front
```

## Deploy

```bash
kubectl apply -f k8sDeployment.yaml
```

## Access

- Client: https://localhost:30173
- Server: https://localhost:30000
- MongoDB: mongodb:27017 (internal)

## Stop

```bash
kubectl delete namespace chat-app
```
