import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import GroupReducers from './GroupReducers';
import buyOrSellReducers from './buyOrSellReducer';

export const combinedReducers = combineReducers({
    auth: AuthReducer,
    group: GroupReducers,
    buyOrSell: buyOrSellReducers
})

export type IRootState = ReturnType<typeof combinedReducers>