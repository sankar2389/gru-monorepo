import axios, { AxiosError } from 'axios';
import { ISignup, ISignupError, ILogin, IForgotPass } from '../types';
import { AsyncStorage } from 'react-native';
const CMS_API = process.env.CMS_API;

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
            .post(CMS_API + 'auth/local', {
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
                console.log(error);
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
            .post(CMS_API + 'auth/local/register', {
                username: username,
                email: email,
                password: password
            })
            .then(async (response) => {
                await AsyncStorage.setItem('token', response.data.jwt);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
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



export const toggleSideBar = (onToggleSideBar: Boolean) => {
    return async (dispatch: Function) => {
        console.log("onToggleSideBar", onToggleSideBar);
        dispatch({
            type: "TOGGLE_SIDEBAR",
            payload: onToggleSideBar
        })
    }
}

export const forgotPass = (payload: IForgotPass) => {
    const { email } = payload;
    return (dispatch: Function) => {
        axios
            .post(CMS_API + 'auth/forgot-password', {
                email,
                url: CMS_API + 'admin/plugins/users-permissions/auth/reset-password'
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
