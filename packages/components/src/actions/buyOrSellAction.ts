import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';

const getBuyOrSellDataByCreatorSuccess = (dispatch: Function, response: any[]) => {
    dispatch({ type: 'BUY_DATA_LIST_SUCCESS', payload: response })
}


export const clearBuyOrSellReducer = () => {
    return (dispatch: Function) => {
        dispatch({
            type: "CLEAR_BUY_OR_SELL_MESSAGE"
        })
    }
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
                                    acceptedBids
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
                                        "bids": [],
                                        "acceptedBids": []
                                    }
                                }
                            }
                        }).then(res => {
                            dispatch({
                                type: "BUY_OR_SELL_DATA_CREATED_SUCCESS",
                                messageType: "success",
                                message: "Buy is created successfully"
                            })
                        }).catch(err => {
                            dispatch({
                                type: "BUY_OR_SELL_ERROR",
                                messageType: "error",
                                message: err.message
                            })
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
                                    bids
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
                                        "bids": [],
                                        "acceptedBids": []
                                    }
                                }
                            }
                        }).then(res => {
                            dispatch({
                                type: "BUY_OR_SELL_DATA_CREATED_SUCCESS",
                                messageType: "success",
                                message: "Sell is created successfully"
                            })
                        }).catch(err => {
                            dispatch({
                                type: "BUY_OR_SELL_ERROR",
                                messageType: "error",
                                message: err.message
                            })
                        })

                    } else {
                        alert("Nothing is selected")
                    }

                }
            }).catch(err => {
                dispatch({
                    type: "BUY_OR_SELL_ERROR",
                    messageType: "error",
                    message: err.message
                })
            })
    }
}

export const getAllBuyData = (start: number = 0) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query($start: Int) {
                            buys(start: $start, limit: 10){
                              _id
                              price
                              creator
                              creatorObject
                              createdAt
                              type
                              unit
                              quantity,
                              bids
                            }
                          }
                        `,
                        variables: {
                            "start": start
                        }
                    }).then((res: any) => {
                        console.log("ressssssssssssssssssss", res)
                        getBuyOrSellDataByCreatorSuccess(dispatch, res.data);
                    }).catch(err => {
                        dispatch({
                            type: "BUY_OR_SELL_ERROR",
                            messageType: "error",
                            message: err.message
                        })
                    });
                }
            })
    }
}

export const getAllSellData = (start: number = 0) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query($start: Int){
                            sells(start: $start, limit: 10) {
                              _id
                              price
                              creator
                              creatorObject
                              createdAt
                              type
                              unit
                              quantity,
                              bids
                            }
                          }
                        `,
                        variables: {
                            "start": start
                        }
                    }).then((res: any) => {
                        getBuyOrSellDataByCreatorSuccess(dispatch, res.data);
                    }).catch(err => {
                        dispatch({
                            type: "BUY_OR_SELL_ERROR",
                            messageType: "error",
                            message: err.message
                        })
                    });
                }
            })
    }
}

export const onCreateBids = (userId: string, bidsPrice: number, buyOrSellId: string, bidOnBuyOrSell: string, bidQuantity: number, totalPrice: number) => {
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
                                  bidQuantity
                                  totalPrice
                                  status
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
                                    "bidQuantity": bidQuantity,
                                    "totalPrice": totalPrice,
                                    "status": "open",
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
                                                _id
                                                price
                                                creator
                                                creatorObject
                                                createdAt
                                                type
                                                unit
                                                quantity,
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
                                    }).then(buy => {
                                        dispatch({
                                            type: "BUY_OR_SELL_BID_CREATED_SUCCESS",
                                            messageType: "success",
                                            message: "Bid is created successfully on buy",
                                        })
                                    }).catch(err => {
                                        dispatch({
                                            type: "BUY_OR_SELL_ERROR",
                                            messageType: "error",
                                            message: err.message
                                        })
                                    })
                                }).catch(err => {
                                    dispatch({
                                        type: "BUY_OR_SELL_ERROR",
                                        messageType: "error",
                                        message: err.message
                                    })
                                })

                            }

                            //update Bid on sell
                            if (bidOnBuyOrSell === "sell") {
                                //Get sell data by sell Id
                                client.query({
                                    query: gql`
                                    query($_id:String!) {
                                        sells(where:{_id:$_id}) {
                                            _id
                                           bids
                                         }
                                      }
                                    `, variables: {
                                        "_id": buyOrSellId
                                    }
                                }).then(sell => {
                                    let bids = sell.data.sells[0].bids
                                    bids.push(bid.data.createBid.bid._id)
                                    //Update sell bids field by BidId 
                                    client.mutate({
                                        mutation: gql`
                                        mutation ($input: updateSellInput) {
                                            updateSell(input: $input) {
                                              sell {
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
                                    }).then(sell => {
                                        dispatch({
                                            type: "BUY_OR_SELL_BID_CREATED_SUCCESS",
                                            messageType: "success",
                                            message: "Bid is created successfully on sell",
                                            payload: sell
                                        })
                                    }).catch(err => {
                                        dispatch({
                                            type: "BUY_OR_SELL_ERROR",
                                            messageType: "error",
                                            message: err.message
                                        })
                                    })
                                }).catch(err => {
                                    dispatch({
                                        type: "BUY_OR_SELL_ERROR",
                                        messageType: "error",
                                        message: err.message
                                    })
                                })
                            }
                        }
                    }).catch(err => {
                        dispatch({
                            type: "BUY_OR_SELL_ERROR",
                            messageType: "error",
                            message: err.message
                        })
                    })
                }
            }).catch(err => {
                dispatch({
                    type: "BUY_OR_SELL_ERROR",
                    messageType: "error",
                    message: err.message
                })
            })
    }
}

export const getBidsByBidId = (bids: any) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query($id:JSON,){
                            bids(where:{_id_in:$id, status:"open"}){
                                _id
                                userId
                                bidPrice,
                                bidQuantity
                                totalPrice
                                createdAt
                            }
                          }
                        `, variables: {
                            "id": bids
                        }
                    }).then(bid => {
                        let userIds: any = []
                        if (bid.data.bids.length > 0) {
                            bid.data.bids.map((bid: any) => {
                                userIds.push(bid.userId)
                            })
                        }
                        client.query({
                            query: gql`
                            query($id:JSON){
                                users(where:{_id_in:$id}){
                                    _id
                                    username
                                    email
                                }
                              }
                            `, variables: {
                                "id": userIds
                            }
                        }).then(users => {
                            let bids = bid.data.bids;
                            let allUsers = users.data.users;
                            if (bids) {
                                bids.forEach((bid: any) => {
                                    if (allUsers) {
                                        let user = allUsers.filter((u: any) => {
                                            return u._id === bid.userId;
                                        });
                                        bid["user"] = user;
                                    }
                                });
                                //console.log("bidddddd", bids)
                            }
                            dispatch({
                                type: "GET_BID_BY_ID_SUCCESS",
                                payload: bids
                            })
                        }).catch(err => {
                            dispatch({
                                type: "BUY_OR_SELL_ERROR",
                                messageType: "error",
                                message: err.message
                            })
                        })

                    }).catch(err => {
                        dispatch({
                            type: "BUY_OR_SELL_ERROR",
                            messageType: "error",
                            message: err.message
                        })
                    })

                }
            }).catch(err => {
                dispatch({
                    type: "BUY_OR_SELL_ERROR",
                    messageType: "error",
                    message: err.message
                })
            })
    }
}

export const bidAcceptOrReject = (type: string, evt: string, status: string, _id: string, buyOrSellId: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    //GET BUY BY ID
                    if (type === "buy") {
                        client.query({
                            query: gql`
                            query($id:JSON){
                                buys(where:{_id_in:$id}){
                                    _id
                                    acceptedBids
                                }
                              }
                            `, variables: {
                                "id": buyOrSellId
                            }
                        }).then(buy => {
                            let acceptedBids = buy.data.buys[0].acceptedBids
                            acceptedBids.push(_id)
                            client.mutate({
                                mutation: gql`
                                mutation ($input: updateBuyInput) {
                                    updateBuy(input: $input) {
                                      buy {
                                        acceptedBids
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
                                            "acceptedBids": acceptedBids
                                        }
                                    }
                                }
                            }).then(buy => {
                                //UPDATE BIDS STATUS
                                client.mutate({
                                    mutation: gql`
                                    mutation ($input: updateBidInput) {
                                        updateBid(input: $input) {
                                        bid {
                                            _id
                                            status
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
                                                "status": status
                                            }
                                        }
                                    }
                                }).then(bid => {
                                    dispatch({
                                        type: "BID_ACCEPTED_OR_REJECTED_SUCCESS",
                                        payload: bid.data.updateBid.bid,
                                        messageType: "success",
                                        message: `One bid is ${evt} successfully for buy`
                                    })
                                })
                            }).catch(err => {
                                dispatch({
                                    type: "BUY_OR_SELL_ERROR",
                                    messageType: "error",
                                    message: err.message
                                })
                            })

                        }).catch(err => {
                            dispatch({
                                type: "BUY_OR_SELL_ERROR",
                                messageType: "error",
                                message: err.message
                            })
                        })
                    }
                    if (type === "sell") {
                        client.query({
                            query: gql`
                            query($id:JSON){
                                sells(where:{_id_in:$id}){
                                    _id
                                    acceptedBids
                                }
                              }
                            `, variables: {
                                "id": buyOrSellId
                            }
                        }).then(sell => {
                            let acceptedBids = sell.data.sells[0].acceptedBids
                            acceptedBids.push(_id)
                            client.mutate({
                                mutation: gql`
                                mutation ($input: updateSellInput) {
                                    updateSell(input: $input) {
                                      sell {
                                        acceptedBids
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
                                            "acceptedBids": acceptedBids
                                        }
                                    }
                                }
                            }).then(buy => {
                                //UPDATE BIDS STATUS
                                client.mutate({
                                    mutation: gql`
                                    mutation ($input: updateBidInput) {
                                        updateBid(input: $input) {
                                        bid {
                                            _id
                                            status
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
                                                "status": status
                                            }
                                        }
                                    }
                                }).then(bid => {
                                    dispatch({
                                        type: "BID_ACCEPTED_OR_REJECTED_SUCCESS",
                                        payload: bid.data.updateBid.bid,
                                        messageType: "success",
                                        message: `One bid is ${evt} successfully for Sell`
                                    })
                                })
                            }).catch(err => {
                                dispatch({
                                    type: "BUY_OR_SELL_ERROR",
                                    messageType: "error",
                                    message: err.message
                                })
                            })

                        }).catch(err => {
                            dispatch({
                                type: "BUY_OR_SELL_ERROR",
                                messageType: "error",
                                message: err.message
                            })
                        })
                    }
                }
            }).catch(err => {
                dispatch({
                    type: "BUY_OR_SELL_ERROR",
                    messageType: "error",
                    message: err.message
                })
            })
    }
}
