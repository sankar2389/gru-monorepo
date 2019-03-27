import { AnyAction } from 'redux'
import { IAuth } from '../types'

const initState: IAuth = {
    authtoken: null,
    error: null
}
export default (state: IAuth = initState, action: AnyAction): IAuth => {
    switch (action.type) {
        case 'REG_SUCCESS':
            return { ...state, ...initState, authtoken: action.payload };
        case 'REG_FAIL':
            return { ...state, ...initState, error: action.payload };
        default:
            return state;
    }
}