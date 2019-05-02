import axios, { AxiosError } from 'axios';
import { ICreateGrpError, IGroupsInfo, IDeleteGroup } from '../types';
import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';
import { string } from 'prop-types';

const createGrpScss = (dispatch: Function, response: any) => {
    dispatch({ type: 'GRP_CREATE_SUCCESS', payload: response });
}

const createGrpFail = (dispatch: Function, error: any) => {
    dispatch({ type: 'GRP_CREATE_FAIL', payload: error });
}

const getGrpScss = (dispatch: Function, response: any) => {
    dispatch({ type: 'GRP_INFO', payload: response });
}

const getGrpFail = (dispatch: Function, error: AxiosError) => {
    dispatch({ type: 'GET_GRP_FAIL', payload: error });
}

const emitGroupsList = (dispatch: Function, response: any) => {
    dispatch({ type: 'GRPS_LST', payload: response })
}

/** Create Group */
export const createGroup = (payload: IGroupsInfo) => {
    console.log("payload", payload)
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                            mutation($groupName: String, $creator: String, $createdAt: String){
                                createGroup(input: {
                                  data: {
                                    groupName: $groupName,
                                    creator: $creator,
                                    createdAt: $createdAt,
                                    members: []
                                    }
                                }) {
                                    group {
                                      groupName
                                      creator
                                      members
                                    }
                                }
                            }
                        `,
                        variables: {
                            groupName: payload.groupName,
                            creator: payload.creator,
                            createdAt: payload.createdAt
                        }

                    }).then((res: any) => {
                        console.log(res)
                        console.log('res: ', res.data);
                        getGrpScss(dispatch, res.data);
                    }).catch(e => {
                        console.log("first error", e)
                        throw e;
                    });
                }
            })
            .catch(e => {
                console.log("last error", e)
                throw e;
            })
    }
}

export const getGroupsList = (creator: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                            query($creator: String) {
                                groups(where: { creator: $creator }) {
                                    groupName
                                }
                            }
                        `,
                        variables: {
                            creator
                        }
                    }).then((res: any) => {

                        console.log('res: ', res.data);
                        emitGroupsList(dispatch, res.data);
                    }).catch(e => {
                        throw e;
                    });
                }
            })
    }
}

export const getGroupInfo = (groupId: number) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                            query {
                                group(id: $groupId) {
                                    groupName
                                }
                            }
                        `
                    }).then((res: any) => {
                        console.log('res: ', res.data);
                        getGrpScss(dispatch, res.data);
                    }).catch(e => {
                        throw e;
                    });
                }
            })
            .catch(e => {
                throw e;
            })
    }
}

/** Delete Group */
export const onDeleteGroup = (payload: IDeleteGroup) => {
    const { groupId } = payload;
    console.log("IDeleteGroup", groupId)
}

/** Edit Group */
export const onEditGroup = (payload: IDeleteGroup) => {


    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                console.log("authtoken", authtoken)
                if (authtoken) {
                    const client = createApolloClient(authtoken);

                    console.log("client", client)
                    client.mutate({
                        mutation: gql`
                        mutation {
                            createGroup(input: {
                              data: {
                                groupName: "My1 second group",
                                creator: "santanubaraijjjjjj@mathcody.com",

                              }
                            }) {
                              group {
                                groupName
                                creator
                                members
                              }
                            }
                          }
                        `
                    }).then((res: any) => {
                        console.log(res)
                        console.log('res: ', res.data);
                        getGrpScss(dispatch, res.data);
                    }).catch(e => {
                        console.log("first error", e)
                        throw e;
                    });
                }
            })
            .catch(e => {
                console.log("last error", e.message)
                throw e;
            })
    }
}


