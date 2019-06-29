import axios, { AxiosError } from 'axios';
import { ICreateGrpError, IGroupsInfo } from '../types';
import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';

const createGrpScss = (dispatch: Function, response: any) => {
    dispatch({ type: 'GRP_CREATE_SUCCESS', payload: response });
}

const createGrpFail = (dispatch: Function, error: any) => {
    dispatch({ type: 'GRP_CREATE_FAIL', payload: error });
}

const getGrpScss = (dispatch: Function, response: any) => {
    dispatch({ type: 'GRP_INFO', payload: response });
}


const getGrpQA = (dispatch: Function, response: any) => {
    dispatch({ type: 'GET_GRP_QA', payload: response });
}

const getGrpQADetails = (dispatch: Function, response: any) => {
    dispatch({ type: 'GET_GRP_QA_DETAILS', payload: response });
}

const getCommentDetails = (dispatch: Function, response: any) => {
    dispatch({ type: 'GET_COMMENT_DETAILS', payload: response });
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




// To fetch all group QA
export const fetchGroupQA = (groupID: string, start: number = 0) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                            query($groupID: String, $start: Int) {
                                questions(sort: "updatedAt:desc", limit: 10, start: $start, where: {
                                    groupID: $groupID
                                }) {
                                    _id
                                    title
                                    groupID
                                    comments{
                                        _id
                                    }
                                    creator
                                    updatedAt
                                }
                            }
                        `,
                        variables: {
                            "groupID": groupID,
                            "start": start
                        }
                    }).then((res: any) => {
                        getGrpQA(dispatch, res.data);
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


// To fetch all group QA details
export const fetchGroupQADetails = (questionID: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                            query($questionID: String) {
                                questions( where: {
                                    _id: $questionID
                                }) {
                                    _id
                                    title
                                    groupID
                                    description
                                    comments {
                                        _id
                                        description
                                        creator
                                        createdAt
                                        updatedAt
                                    }
                                    creator
                                    updatedAt
                                    createdAt
                                }
                            }
                        `,
                        variables: {
                            "questionID": questionID
                        }
                    }).then((res: any) => {
                        getGrpQADetails(dispatch, res.data.questions[0]);
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


// To fetch  group comment details
export const fetchCommentDetails = (commentID: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.query({
                        query: gql`
                            query($commentID: String) {
                                comments(where: {
                                    _id: $commentID
                                }) {
                                    _id
                                    description
                                    creator
                                    createdAt
                                    updatedAt
                                }
                            }
                        `,
                        variables: {
                            "commentID": commentID
                        }
                    }).then((res: any) => {
                        getCommentDetails(dispatch, res.data);
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



// To update  group comment details
export const updateComment = (commentID: string, description: string) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient(authtoken);
                    client.mutate({
                        mutation: gql`
                        mutation($commentID: ID!, $description: String){
                            updateComments(input: {
                              where: {
                                id: $commentID
                              },
                              data: {
                                description: $description
                              }
                            }) {
                              comment {
                                description
                              }
                            }
                          }
                          
                        `,
                        variables: {
                            "commentID": commentID,
                            "description": description
                        }
                    }).then((res: any) => {
                        console.log(res);

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
