import { AnyAction } from 'redux'
import { IGroup } from '../types'

const initState: IGroup = {
    groups: [],
    questions: [],
    error: null,
    questionDetails: {},
    commentDetail: {},
    commentUpdateStatus: 1,
    questionUpdateStatus: 1
}
export default (state: IGroup = initState, action: AnyAction): IGroup => {
    switch (action.type) {
        case 'GRP_CREATE_SUCCESS':
            return {
                ...state,
                groups: [...state.groups, action.payload]
            };
        case 'GRP_CREATE_FAIL':
            return { ...state, ...initState, error: action.payload };
        case 'GRP_INFO':
            return {
                ...state,
                groups: action.payload
            };
        case 'GET_GRP_FAIL':
            return { ...state, ...initState, error: action.payload };
        case 'GRPS_LST':
            return { ...state, ...initState, ...action.payload };
        case 'GET_GRP_QA':
            return {
                ...state,
                questions: action.payload
            };
        case 'GET_GRP_QA_DETAILS':
            return {
                ...state,
                questionDetails: action.payload
            }
        case 'GET_COMMENT_DETAILS':
            return {
                ...state,
                commentDetail: action.payload
            }
        case 'COMMENT_UPDATE_STATUS':
            return {
                ...state,
                commentUpdateStatus: action.payload
            }
        case 'QUESTION_UPDATE_STATUS':
            return {
                ...state,
                questionUpdateStatus: action.payload
            }
        case 'RESET_UPDATE_STATUS':
            return {
                ...state,
                questionUpdateStatus: 2,
                commentUpdateStatus: 2
            }
        default:
            return state;
    }
}