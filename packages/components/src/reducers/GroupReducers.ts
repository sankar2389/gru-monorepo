import { AnyAction } from 'redux'
import { IGroup } from '../types'

const initState: IGroup = {
    groups: [],
    error: null
}
export default (state: IGroup = initState, action: AnyAction): IGroup => {
    switch (action.type) {
        case 'GRP_CREATE_SUCCESS':
            return { ...state };
        case 'GRP_CREATE_FAIL':
            return { ...state, ...initState, error: action.payload };
        case 'GRP_INFO':
            return {
                ...state,
                groups: [...state.groups, action.payload]
            };
        case 'GET_GRP_FAIL':
            return { ...state, ...initState, error: action.payload };
        case 'GRPS_LST':
            return { ...state, ...initState, ...action.payload };

        default:
            return state;
    }
}