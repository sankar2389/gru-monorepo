# Gru

A quick description of gru.

## Docker

##### WEB
```
yarn workspace @gru/web build
cd packages/web/
sudo docker image build -t gru-web .
sudo docker run -p 80:80 --rm gru-web
```

##### CMS
```
sudo docker image build -t gru-cms .
sudo docker run -p 1337:1337 --rm gru-cms
```

### **GraphQL API**

##### `get groups`
```
query {
  groups {
    groupName
  }
}
```
**response :**
```
{
  "data": {
    "groups": [
      {
        "groupName": "new group"
      },
      {
        "groupName": "my new group"
      }
    ]
  }
}
```

##### `get buys/sells`
```
query {
  buys {
    creator,
    price,
    unit,
    quantity
  }
}
```
**response :**
```
{
  "data": {
    "buys": [
      {
        "creator": "iamgroot@mathcody.com",
        "price": 5500,
        "unit": "gm",
        "quantity": 175.5
      }
    ]
  }
}
```

##### `create buy/sell`
`mutation`
```
mutation($input: createBuyInput) {
  createBuy(input: $input) {
    buy{
      creator,
      unit,
      quantity,
      price
    }
  }
}
```
`variables`
```
{
  "input": {
    "data": {
      "creator": "iamgroot@mathcody.com",
      "price": 5500,
      "unit": "gm",
      "quantity": 175.50
    }
  }
}
```
**response :**
```
{
  "data": {
    "createBuy": {
      "buy": {
        "creator": "iamgroot@mathcody.com",
        "unit": "gm",
        "quantity": 175.5,
        "price": 5500
      }
    }
  }
}
```