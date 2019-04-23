import axios, { AxiosError } from 'axios';
import { ICreateGrpError, IGroupsInfo  } from '../types';
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

export const createGroup = (payload: IGroupsInfo) => {
    const { groupName, users } = payload;
    return (dispatch: Function) => {
        axios
            .post('http://localhost:1337/groups', {
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
        const client = createApolloClient('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU1NTg5MTkzLCJleHAiOjE1NTgxODExOTN9.DkdcPF0yek5FaHiDNrZOAqJhUMnZpLu_hi1Sg-83yho');
        client.query({
            query: gql`
                        query {
                            groups {
                                groupName
                            }
                        }
                    `
            }).then((res: any) => {
                console.log('res: ', res.data);
                emitGroupsList(dispatch, res.data);
            }).catch(e => {
                throw e;
            });
    }
}

export const getGroupInfo = (groupId: number) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    const client = createApolloClient('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU1NTg5MTkzLCJleHAiOjE1NTgxODExOTN9.DkdcPF0yek5FaHiDNrZOAqJhUMnZpLu_hi1Sg-83yho');
                    client.query({
                        query: gql`
                            query {
                                groups {
                                    groupName
                                }
                            }
                        `
                    }).then((res: any) => {
                        console.log('res: ', res.data);
                    }).catch(e => {
                        throw e;
                    });
                }
            })
            .catch(e => {
                throw e;
            })
        /*axios
            .get('http://localhost:1337/groups', {
                params: { groupId }
            })
            .then(response => {
                getGrpScss(dispatch, response.data);
            })
            .catch((error: AxiosError) => {
                getGrpFail(dispatch, error);
            })
        */
    }
}