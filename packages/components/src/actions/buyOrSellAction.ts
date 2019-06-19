//import { ICreateSell } from '../types';
import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';
import { now } from 'moment';



const getBuyOrSellDataByCreatorSuccess = (dispatch: Function, response: any[]) => {
    dispatch({ type: 'BUY_DATA_LIST_SUCCESS', payload: response })
}


export const createBuyOrSell = (buyOrsell: string, buyOrSellType: string, unit: string, quantity: any, buyOrSellPrice: number, creator: string, creatorObject: any) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken)
                    if (buyOrsell === "buy") {
                        client.mutate({
                            mutation: gql`
                            mutation ($input: createBuyInput) {
                                createBuy(input: $input) {
                                  buy {
                                    price
                                    creator
                                    creatorObject
                                    type
                                    unit
                                    quantity
                                  }
                                }
                              }                          
                            `,
                            variables: {
                                "input": {
                                    "data": {
                                        "price": buyOrSellPrice,
                                        "creator": creator,
                                        "creatorObject": creatorObject,
                                        "type": buyOrSellType,
                                        "unit": unit,
                                        "quantity": quantity,
                                        "bids": []

                                    }
                                }
                            }
                        }).then(res => {
                            console.log("res buy", res)
                        }).catch(err => {
                            console.log("err buy", err)
                        })

                    } else if (buyOrsell === "sell") {
                        client.mutate({
                            mutation: gql`
                            mutation ($input: createSellInput) {
                                createSell(input: $input) {
                                  sell {
                                    price
                                    creator
                                    creatorObject
                                    type
                                    unit
                                    quantity
                                  }
                                }
                              }                      
                            `,
                            variables: {
                                "input": {
                                    "data": {
                                        "price": buyOrSellPrice,
                                        "creator": creator,
                                        "creatorObject": creatorObject,
                                        "type": buyOrSellType,
                                        "unit": unit,
                                        "quantity": quantity,
                                    }
                                }
                            }
                        }).then(res => {
                            console.log("res sell", res)
                        }).catch(err => {
                            console.log("err sell", err)
                        })

                    } else {
                        alert("Nothing is selected")
                    }

                }
            }).catch(err => {
                console.log("err all", err)
            })
    }
}

export const getBuyDataByCreator = (creator: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query {
                            buys{
                              _id
                              price
                              creator
                              creatorObject
                              createdAt
                              type
                              unit
                              quantity
                            }
                          }
                        `
                    }).then((res: any) => {
                        getBuyOrSellDataByCreatorSuccess(dispatch, res.data);
                    }).catch(e => {
                        console.log("grapql error", e)
                        throw e;
                    });
                }
            })
    }
}

export const getSellDataByCreator = (creator: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query{
                            sells {
                              _id
                              price
                              creator
                              creatorObject
                              createdAt
                              type
                              unit
                              quantity
                            }
                          }
                        `
                    }).then((res: any) => {
                        getBuyOrSellDataByCreatorSuccess(dispatch, res.data);
                    }).catch(e => {
                        console.log("grapql error", e)
                        throw e;
                    });
                }
            })
    }
}

export const onUpdateBuyPrice = (_id: any, buyPrice: number, creator: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation ($input: updateBuyInput) {
                            updateBuy(input: $input) {
                              buy {
                                price
                              }
                            }
                          }
                        `,
                        variables: {
                            "input": {
                                "where": {
                                    "id": _id
                                },
                                "data": {
                                    "price": buyPrice
                                }
                            }
                        }
                    }).then((res: any) => {
                        client.query({
                            query: gql`
                            query {
                                buys{
                                  _id
                                  price
                                  creator
                                  creatorObject
                                  createdAt
                                }
                              }`
                        }).then((res: any) => {
                            getBuyOrSellDataByCreatorSuccess(dispatch, res.data);
                        }).catch(e => {
                            console.log("grapql error", e)
                            throw e;
                        });
                    }).catch(e => {
                        console.log("grapql error", e)
                        throw e;
                    });
                }
            })
    }
}

export const onUpdateSellPrice = (_id: any, buyPrice: number, creator: string) => {
    console.log("emsil", creator)
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation ($input: updateSellInput) {
                            updateSell(input: $input) {
                              sell {
                                price
                              }
                            }
                          }
                        `,
                        variables: {
                            "input": {
                                "where": {
                                    "id": _id
                                },
                                "data": {
                                    "price": buyPrice
                                }
                            }
                        }
                    }).then((res: any) => {
                        client.query({
                            query: gql`
                            query {
                                sells{
                                  _id
                                  price
                                  creator
                                  creatorObject
                                  createdAt
                                }
                              }
                            `
                        }).then((res: any) => {
                            getBuyOrSellDataByCreatorSuccess(dispatch, res.data);
                        }).catch(e => {
                            console.log("grapql error", e)
                            throw e;
                        });
                    }).catch(e => {
                        console.log("grapql error", e)
                        throw e;
                    });
                }
            })
    }
}

export const onCreateBids = (userId: string, bidsPrice: number, buyOrSellId: string, bidOnBuyOrSell: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation ($input: createBidInput) {
                            createBid(input: $input) {
                              bid {
                                  _id
                                  userId
                                  bidPrice
                                  createdAt                   
                              }
                            }
                          }                          
                        `,
                        variables: {
                            "input": {
                                "data": {
                                    "userId": userId,
                                    "bidPrice": bidsPrice,
                                    "createdAt": new Date()
                                }
                            }
                        }
                    }).then(bid => {
                        if (bid.data.createBid.bid._id) {
                            //update buy
                            if (bidOnBuyOrSell === "buy") {
                                //Get buy data
                                client.query({
                                    query: gql`
                                    query($_id:String!) {
                                        buys(where:{_id:$_id}) {
                                            _id
                                           bids
                                         }
                                      }
                                    `, variables: {
                                        "_id": buyOrSellId
                                    }
                                }).then(buy => {
                                    let bids = buy.data.buys[0].bids
                                    bids.push(bid.data.createBid.bid._id)
                                    //Update buy bids data by BidId 
                                    client.mutate({
                                        mutation: gql`
                                        mutation ($input: updateBuyInput) {
                                            updateBuy(input: $input) {
                                              buy {
                                                bids
                                              }
                                            }
                                          }
                                        `,
                                        variables: {
                                            "input": {
                                                "where": {
                                                    "id": buyOrSellId
                                                },
                                                "data": {
                                                    "bids": bids
                                                }
                                            }
                                        }
                                    }).then(res => {
                                        alert("One bid is created on Buy")

                                    }).catch(err => {
                                        console.log(err.message)
                                    })
                                }).catch(err => {
                                    console.log(err.message)
                                })

                            }


                        }



                    }).catch(err => {
                        console.log(err.message)
                    })
                }
            }).catch(err => {
                alert(err.message)
            })
    }
}