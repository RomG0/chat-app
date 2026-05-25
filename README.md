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
kubectl apply -f k8s/all.yaml
```

## Access

- Client: http://localhost:30173
- Server: https://localhost:5000 (internal)
- MongoDB: mongodb:27017 (internal)

## View Logs

```bash
kubectl logs -n chat-app mongodb
kubectl logs -n chat-app server
kubectl logs -n chat-app client
```

## Stop

```bash
kubectl delete namespace chat-app
```
