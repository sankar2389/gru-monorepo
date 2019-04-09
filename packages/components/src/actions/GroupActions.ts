import axios, { AxiosError } from 'axios';
import { ICreateGrpError, IGroupsInfo  } from '../types';

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

export const getGroupInfo = (groupId: number) => {
    return (dispatch: Function) => {
        axios
            .get('http://localhost:1337/groups', {
                params: { groupId }
            })
            .then(response => {
                getGrpScss(dispatch, response.data);
            })
            .catch((error: AxiosError) => {
                getGrpFail(dispatch, error);
            })
    }
}