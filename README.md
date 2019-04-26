# Gru

A quick description of gru.

## Docker

##### WEB
```
yarn workspace @gru/web build
cd packages/web/dist/
sudo docker image build -t gru-web .
sudo docker run -p 3000:80 --rm gru-web
```

##### CMS
```
sudo docker image build -t gru-cms .
sudo docker run -p 1337:1337 --rm gru-cms
```

