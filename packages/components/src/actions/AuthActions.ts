import axios, { AxiosError } from 'axios';
import { ISignup, ISignupError, ILogin, IForgotPass } from '../types';
import { AsyncStorage } from 'react-native';
import createApolloClient from '../apollo';
import gql from 'graphql-tag';

const regSuccess = (dispatch: Function, message: string) => {
    dispatch({ type: 'REG_SUCCESS', payload: message });
}
const signupFail = (dispatch: Function, message: ISignupError) => {
    dispatch({ type: 'REG_FAIL', payload: message });
}
const loginSuccess = (dispatch: Function, message: string) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: message });
}
const loginFail = (dispatch: Function, message: ISignupError) => {
    dispatch({ type: 'LOGIN_FAIL', payload: message });
}
const logout = (dispatch: Function, message: string) => {
    dispatch({ type: 'LOGOUT_USER', payload: message });
}
const resetSuccess = (dispatch: Function, response: any) => {
    dispatch({ type: 'RESET_SUCCESS', payload: response })
}
const resetError = (dispatch: Function, error: any) => {
    dispatch({ type: 'RESET_FAIL', payload: error });
}

export const loginUser = (payload: ILogin) => {
    const { email, password } = payload;
    return (dispatch: Function) => {
        axios
            .post('http://localhost:1337/auth/local', {
                identifier: email,
                password
            })
            .then(async (response) => {
                console.log("response", response)
                await AsyncStorage.setItem('token', response.data.jwt);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                loginSuccess(dispatch, response.data.jwt);
            })
            .catch((error: AxiosError) => {
                const err: ISignupError = error.response!.data
                console.error('Error: ', err.message);
                loginFail(dispatch, err);
            });
    }
}

export const signupUser = (payload: ISignup) => {
    const { username, email, password } = payload;
    return (dispatch: Function) => {
        axios
            .post('http://localhost:1337/auth/local/register', {
                username: username,
                email: email,
                password: password
            })
            .then(response => {
                // Handle success.
                console.log('Well done!');
                console.log('User profile', response.data.user);
                console.log('User token', response.data.jwt);
                regSuccess(dispatch, response.data.jwt);
            })
            .catch((error: AxiosError) => {
                // axios puts original error response to error.response https://github.com/axios/axios/issues/960#issuecomment-309287911
                const err: ISignupError = error.response!.data
                console.error('Error: ', err.message);
                signupFail(dispatch, err);
            });
    }
}

export const logoutUser = () => {
    return async (dispatch: Function) => {
        await AsyncStorage.clear();
        logout(dispatch, '');
    }
}

export const forgotPass = (payload: IForgotPass) => {
    const { email } = payload;
    return (dispatch: Function) => {
        axios
            .post('http://localhost:1337/auth/forgot-password', {
                email,
                url: 'http:/localhost:1337/admin/plugins/users-permissions/auth/reset-password'
            })
            .then(response => {
                resetSuccess(dispatch, response);
            })
            .catch((error: AxiosError) => {
                console.log(error.response);
                const err: any = error.response!.data
                resetError(dispatch, err);
            })
    }
}
