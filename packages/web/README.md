# GRU web app

#### Create docker
```
yarn build
docker image build -t gru-web .
```

#### Run docker
```
docker run -p 80:80 --rm gru-web
```

#### Push docker image to gcr
```
docker tag gru-web gcr.io/gru-platform/gru-web
docker push gcr.io/gru-platform/gru-web
```

#### K8 deployments & service exposing
```
kubectl create -f kubernetes/deployment.yaml
kubectl expose deployment/gru-web --port=80 --target-port=80 --type=LoadBalancer
```