import axios, { AxiosError } from 'axios';
import { ISignup, ISignupError } from '../types';

const regSuccess = (dispatch: Function, message: string) => {
    dispatch({ type: 'REG_SUCCESS', payload: message });
}
const signupFail = (dispatch: Function, message: ISignupError) => {
    dispatch({ type: 'REG_FAIL', payload: message });
}
export const signupUser = (payload: ISignup) => {
    const { username, email, password } = payload;
    return (dispatch: any) => {
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