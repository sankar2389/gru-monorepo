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

### **DigitalOcean deployment**

#### Upload docker container from local machine to DigitalOcean droplet
```
docker save -o gru-web.tar gru-web
scp gru-web.tar root@104.248.145.85:/root/docker_images/
```

#### Load container on droplet docker
```
docker load -i gru-web.tar
```

#### Run container in detached mode
```
docker run --net=host -p 80:80 --rm -d gru-web
```