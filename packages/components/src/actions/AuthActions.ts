import axios from 'axios'
interface ISignup {
    username: string,
    email: string,
    password: string
}
const signupFail = (dispatch: Function, message: string) => {
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
            })
            .catch(error => {
                // axios puts original error response to error.response https://github.com/axios/axios/issues/960#issuecomment-309287911
                error = error.response;
                console.error('Error: ', error.data.message);
            });
    }
}