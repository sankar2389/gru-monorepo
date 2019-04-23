import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import GroupReducers from './GroupReducers';

export const combinedReducers = combineReducers({
    auth: AuthReducer,
    group: GroupReducers
})

export type IRootState = ReturnType<typeof combinedReducers>