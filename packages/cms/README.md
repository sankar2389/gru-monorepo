# GRU cms

#### Create docker
```
docker image build -t gru-cms .
```

#### Run docker
```
docker run -p 1337:1337 --rm gru-cms
```

#### Push docker image to gcr
```
docker tag gru-cms gcr.io/gru-platform/gru-cms
docker push gcr.io/gru-platform/gru-cms
```

#### K8 deployments & service exposing
```
kubectl create -f kubernetes/deployment.yaml
kubectl expose deployment/gru-cms --port=1337 --target-port=1337 --type=LoadBalancer
```