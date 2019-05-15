import { AnyAction } from 'redux'
import { IAuth } from '../types'

const initState: IAuth = {
    authtoken: null,
    error: null,
    onToggleSideBar: null
}
export default (state: IAuth = initState, action: AnyAction): IAuth => {
    switch (action.type) {
        case 'REG_SUCCESS':
            return { ...state, authtoken: action.payload };
        case 'REG_FAIL':
            return { ...state, ...initState, error: action.payload };
        case 'LOGIN_SUCCESS':
            return { ...state, authtoken: action.payload };
        case 'LOGIN_FAIL':
            return { ...state, ...initState, error: action.payload };
        case 'LOGOUT_USER':
            return { ...initState };
        case 'RESET_SUCCESS':
            return { ...initState };
        case 'RESET_FAIL':
            return { ...initState, error: action.payload };
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                onToggleSideBar: action.payload
            };
        default:
            return state;
    }
}