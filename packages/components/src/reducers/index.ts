import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';

export const combinedReducers = combineReducers({
    auth: AuthReducer
})

export type IRootState = ReturnType<typeof combinedReducers>