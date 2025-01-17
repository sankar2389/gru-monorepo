# Gru

A quick description of gru.

#### Run frontend with API
```
CMS_API=http://104.248.145.85:1337/ yarn dev:web
```
#### Run backend strapi cms
```
yarn dev:cms
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