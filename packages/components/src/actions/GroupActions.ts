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
                                  _id,
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
                                    "creator": payload.creator,
                                    "members": []
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
                                        creator,
                                        members,
                                        createdAt
                                    }
                                }
                            `,
                            variables: {
                                creator: payload.creator
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
                                    creator,
                                    members,
                                    createdAt
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
                                        creator,
                                        members,
                                        createdAt
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
export const onUpdateGroup = (groupId: string, groupName: string, creator: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation ($input: updateGroupInput) {
                            updateGroup(input: $input) {
                              group {
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
                                },
                                "data": {
                                    "groupName": groupName
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
                                        creator,
                                        members,
                                        createdAt
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


export const onAddUserToGroup = (groupId: any, user: any) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query($_id:String!) {
                            groups(where:{_id:$_id}) {
                                _id
                              members
                             }
                          }
                        `, variables: {
                            "_id": groupId
                        }
                    }).then(group => {
                        let members = group.data.groups[0].members
                        members.push(user._id)
                        client.mutate({
                            mutation: gql`
                             mutation ($input: updateGroupInput) {
                                 updateGroup(input: $input) {
                                  group {
                                    _id,
                                    groupName,
                                    creator,
                                    members,
                                    createdAt
                                  }
                                }
                              }
                             `,
                            variables: {
                                "input": {
                                    "where": {
                                        "id": groupId
                                    }, "data": {
                                        "members": members
                                    }
                                }
                            }
                        }).then(group => {
                            dispatch({
                                type: "GROUP_MEMBER_UPDATE_SUCCESS",
                                payload: group.data.updateGroup.group
                            })
                        })
                    }).catch(err => {
                        console.log(err.message)
                    })
                }
            }).catch(err => {
                console.log(err.message)
            })
    }

}

export const onRemoveUserFromGroup = (groupId: any, user: any) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                        query($_id:String!) {
                            groups(where:{_id:$_id}) {
                                _id
                              members
                             }
                          }
                        `, variables: {
                            "_id": groupId
                        }
                    }).then(group => {
                        let members = group.data.groups[0].members
                        for (var i = 0; i < members.length; i++) {
                            if (members[i] === user._id) {
                                members.splice(i, 1);
                            }
                        }
                        client.mutate({
                            mutation: gql`
                             mutation ($input: updateGroupInput) {
                                 updateGroup(input: $input) {
                                  group {
                                    _id,
                                    groupName,
                                    creator,
                                    members,
                                    createdAt
                                  }
                                }
                              }
                             `,
                            variables: {
                                "input": {
                                    "where": {
                                        "id": groupId
                                    }, "data": {
                                        "members": members
                                    }
                                }
                            }
                        }).then(group => {
                            dispatch({
                                type: "GROUP_MEMBER_UPDATE_SUCCESS",
                                payload: group.data.updateGroup.group
                            })
                        })
                    }).catch(err => {
                        console.log(err.message)
                    })
                }
            }).catch(err => {
                console.log(err.message)
            })
    }

}

