# cms
A quick description of cms.

## Push docker to k8
```
docker build -t gru-cms:0.1 .
docker tag gru-cms:0.1 gcr.io/gru-platform/gru-cms
docker push gcr.io/gru-platform/gru-cms
```
