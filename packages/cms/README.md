# GRU cms [minimum required version node v10]

#### Run in dev mode
```
cd packages/cms
npm i
cd ../../
DB_HOST=192.168.0.13 yarn dev:cms
```

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

### **DigitalOcean deployment**

#### Upload docker container from local machine to DigitalOcean droplet
```
docker save -o gru-cms.tar gru-cms
scp gru-cms.tar root@104.248.145.85:/root/docker_images/
```

#### Load container on droplet docker
```
docker load -i gru-cms.tar
```

#### Run container in detached mode
```
docker run --net=host -p 1337:1337 --rm -d gru-cms
```
