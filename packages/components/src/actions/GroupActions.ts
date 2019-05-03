import axios, { AxiosError } from 'axios';
import { ICreateGrpError, IGroupsInfo } from '../types';
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
    //console.log("payload", payload)
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation($input: createGroupInput) {
                            createGroup(input: $input) {
                              group {
                                groupName,
                                creator
                              }
                            }
                          }
                        `,
                        variables: {
                            "input": {
                                "data": {
                                    "groupName": payload.groupName,
                                    "creator": payload.creator
                                }
                            }
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
                                    _id,
                                    groupName,
                                    creator
                                
                                }
                            }
                        `,
                        variables: {
                            creator
                        }
                    }).then((res: any) => {

                        console.log("resssssssssssss", res.data)
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
export const onDeleteGroup = (groupId: string, creator: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation ($input: deleteGroupInput) {
                            deleteGroup(input: $input) {
                              group {
                                  _id
                                groupName
                                creator
                              }
                            }
                          }
                          
                        `,
                        variables: {
                            "input": {
                                "where": {
                                    "id": groupId
                                }
                            }
                        }
                    }).then((res: any) => {
                        client.query({
                            query: gql`
                                query($creator: String) {
                                    groups(where: { creator: $creator }) {
                                        _id,
                                        groupName,
                                        creator
                                    
                                    }
                                }
                            `,
                            variables: {
                                creator
                            }
                        }).then((res: any) => {
                            emitGroupsList(dispatch, res.data);
                        }).catch(e => {
                            throw e;
                        });
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

/** Edit Group */
export const onEditGroup = () => {

}


