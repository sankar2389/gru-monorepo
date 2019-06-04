import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import GroupReducers from './GroupReducers';
import buyOrSellReducers from './buyOrSellReducer';
import webrtcReducer from "./webrtcReducer";
export const combinedReducers = combineReducers({
    auth: AuthReducer,
    group: GroupReducers,
    buyOrSell: buyOrSellReducers,
    webrtc: webrtcReducer
})

export type IRootState = ReturnType<typeof combinedReducers>