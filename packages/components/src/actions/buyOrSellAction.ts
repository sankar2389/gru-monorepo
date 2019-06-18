//import { ICreateSell } from '../types';
import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';



const getBuyOrSellDataByCreatorSuccess = (dispatch: Function, response: any[]) => {
    dispatch({ type: 'BUY_DATA_LIST_SUCCESS', payload: response })
}


export const createBuyOrSell = (buyOrsell: string, buyOrSellType: string, buyOrSellPrice: number, creator: string, creatorObject: any) => {
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
                                    creator,
                                    creatorObject,
                                    type
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
                                        "type": buyOrSellType
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
                                        "type": buyOrSellType
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
    console.log("creator", creator)
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