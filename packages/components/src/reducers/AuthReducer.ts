import { AnyAction } from 'redux'
import { IReduxState, IAuth } from '../types'

const initState: IReduxState = {
    auth: {
        username: 'Santanu B',
        password: '1234',
        email: 'santanubarai@mathcody.com',
        authtoken: null,
        error: null,
        loading: false
    }
}
export default (state: IReduxState = initState, action: AnyAction): IReduxState => {
    switch (action.type) {
        /*case 'REG_USER':
            return { ...state, ...initState, authtoken: action.payload };
        case 'REG_FAIL':
            return { ...state, ...initState, error: action.payload };*/
        default:
            return state;
    }
}