import axios, { AxiosError } from 'axios';
import { ICreateGrpError, IGroupsInfo, IDeleteGroup } from '../types';
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

const getGrpFail = (dispatch: Function, error: AxiosError) => {
    dispatch({ type: 'GET_GRP_FAIL', payload: error });
}

const emitGroupsList = (dispatch: Function, response: any) => {
    dispatch({ type: 'GRPS_LST', payload: response })
}

/** Create Group */
export const createGroup = (payload: IGroupsInfo) => {
    const { groupName, users } = payload;
    console.log("group name", groupName)
    return (dispatch: Function) => {
        axios
            .post('http://192.168.0.13:1337/groups', {
                groupName,
                users
            })
            .then(response => {
                createGrpScss(dispatch, response.data);
            })
            .catch((error: AxiosError) => {
                const err: ICreateGrpError = error.response!.data
                console.error('Error: ', err.message);
                createGrpFail(dispatch, err);
            });
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
    const { groupId } = payload;
    console.log("EditGroupAction", groupId)
}


