//import { ICreateSell } from '../types';
import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';




export const createBuyOrSell = (data: any) => {
    console.log("asdfasfdas", data.buyOrsell)


    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken)
                    if (data.buyOrsell === "buy") {
                        client.mutate({
                            mutation: gql`
                            mutation ($input: createBuyInput) {
                                createBuy(input: $input) {
                                  buy {
                                    price
                                    creator
                                  }
                                }
                              }                          
                            `,
                            variables: {
                                "input": {
                                    "data": {
                                        "price": data.buyOrSellPrice,
                                        "creator": data.creator
                                    }
                                }
                            }
                        }).then(res => {
                            console.log("res buy", res)
                        }).catch(err => {
                            console.log("err", err)
                        })

                    } else if (data.buyOrsell === "sell") {
                        client.mutate({
                            mutation: gql`
                            mutation ($input: createSellInput) {
                                createSell(input: $input) {
                                  sell {
                                    price
                                    creator
                                  }
                                }
                              }                          
                            `,
                            variables: {
                                "input": {
                                    "data": {
                                        "price": data.buyOrSellPrice,
                                        "creator": data.creator
                                    }
                                }
                            }
                        }).then(res => {
                            console.log("res sell", res)
                        }).catch(err => {
                            console.log("err", err)
                        })

                    } else {
                        alert("Nothing is selected")
                    }

                }
            }).catch(err => {
                console.log("err", err)
            })
    }



    // if (data.buyOrsell === "sell") {
    //     AsyncStorage.getItem('token').then((authtoken: string | null) => {
    //         if (authtoken) {
    //             const client = createApolloClient(authtoken);
    //             client.mutate({
    //                 mutation: gql`
    //                     mutation ($input: createSellInput) {
    //                         createSell(input: $input) {
    //                         sell {
    //                             price
    //                             creator
    //                         }
    //                         }
    //                     }
    //                 `,
    //                 variables: {
    //                     "input": {
    //                         "data": {
    //                             "price": 1010,
    //                             "creator": "sb.com"
    //                         }
    //                     }
    //                 }
    //             })
    //         }
    //     }).catch(err => {
    //         console.log("err", err)
    //     })
    // }

}












// return (dispatch: Function) => {
//     AsyncStorage.getItem('token')
//         .then((authtoken: string | null) => {
//             if (authtoken) {
//                 const client = createApolloClient(authtoken);
//                 if (data.buyOrsell === "buy") {
//                     client.mutate({
//                         mutation: gql`
//                         mutation ($input: createBuyInput) {
//                             createBuy(input: $input) {
//                               buy {
//                                 price
//                                 creator
//                               }
//                             }
//                           }
//                         `,
//                         variables: {
//                             "input": {
//                                 "data": {
//                                     "price": data.buyOrSellPrice,
//                                     "creator": data.creator
//                                 }
//                             }
//                         }
//                     }).then(res => {
//                         console.log("create buy", res.data)
//                     })
//                 } else if (data.buyOrsell === "sell") {
//                     client.mutate({
//                         mutation: gql`
//                         mutation ($input: createSellInput) {
//                             createSell(input: $input) {
//                               sell {
//                                 price
//                                 creator
//                               }
//                             }
//                           }

//                         `,
//                         variables: {
//                             "input": {
//                                 "data": {
//                                     "price": 1010,
//                                     "creator": "sb.com"
//                                 }
//                             }
//                         }
//                     }).then(res => {
//                         console.log("create sell", res.data)
//                     }).catch(e => {
//                         console.log("err", e)
//                     })
//                 } else {
//                     alert("Nothing is selected")
//                 }

//             }
//         })
//         .catch(e => {
//             throw e;
//         })
// }